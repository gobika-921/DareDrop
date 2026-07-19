import { nanoid } from "nanoid";
import { create } from "zustand";

import { getAllDares } from "../data";
import {
  archiveSession,
  completeGame,
  createActiveSession,
  createPlayAgainSession,
  createRound,
  isGameComplete,
  resolveRound,
  revealRound,
} from "../services/gameEngine";
import { canPass, canSkip, getSkipsRemaining, validateGameStart } from "../services/gameValidator";
import { recoverSession } from "../services/sessionRecovery";
import {
  getActiveSession,
  getArchivedSessions,
  getCustomDares,
  setActiveSession,
  setArchivedSessions,
} from "../services/storage";
import {
  Dare,
  GameConfiguration,
  GameSession,
  Player,
  RoundResult,
} from "../types";

// ─── Store State ───────────────────────────────────────────────────────────────

interface GameSessionState {
  /** The current active game session, or null if no game is in progress. */
  session: GameSession | null;

  /** Error message from the last failed action. */
  error: string | null;

  /** Whether the store is performing an async operation. */
  loading: boolean;
}

interface GameSessionActions {
  /**
   * Starts a new game. Validates inputs, creates an Active session,
   * creates the first round, and persists.
   */
  startGame: (players: Player[], configuration: GameConfiguration) => Promise<void>;

  /**
   * Creates the next round (selects player + dare) and appends it to the session.
   */
  nextRound: () => Promise<void>;

  /**
   * Transitions the current round from Pending to Revealed.
   */
  revealCurrentRound: () => void;

  /**
   * Resolves the current round with the given result.
   * Creates a HistoryEntry and persists. Automatically ends game if round limit reached.
   */
  resolveCurrentRound: (result: RoundResult) => Promise<void>;

  /**
   * Ends the game early. Generates summary and transitions to Completed.
   */
  endGame: () => Promise<void>;

  /**
   * Archives the current Completed session and starts a new game
   * with the same players and configuration.
   */
  playAgain: () => Promise<void>;

  /**
   * Archives the current Completed session and resets the store.
   */
  newGame: () => Promise<void>;

  /**
   * Attempts to resume a persisted Active session from storage.
   */
  resumeSession: () => Promise<void>;

  /**
   * Resets the store and clears the active session from storage.
   */
  resetSession: () => Promise<void>;
}

type GameSessionStore = GameSessionState & GameSessionActions;

// ─── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Loads all available dares (bundled + custom) for use in gameplay.
 */
async function loadAllDares(): Promise<Dare[]> {
  const customDares = await getCustomDares();
  return getAllDares(customDares);
}

/**
 * Persists the current session to storage.
 */
async function persistSession(session: GameSession | null): Promise<void> {
  await setActiveSession(session);
}

// ─── Store ─────────────────────────────────────────────────────────────────────

export const useGameSessionStore = create<GameSessionStore>((set, get) => ({
  // Initial state
  session: null,
  error: null,
  loading: false,

  startGame: async (players, configuration) => {
    set({ loading: true, error: null });

    try {
      const allDares = await loadAllDares();

      // Pre-flight validation (GAME_RULES.md §10.1)
      const validationError = validateGameStart(players, configuration, allDares);
      if (validationError) {
        set({ error: validationError, loading: false });
        return;
      }

      // Create session
      const session = createActiveSession(nanoid(), players, configuration);

      // Create first round
      const firstRound = createRound(session, allDares);
      const sessionWithRound: GameSession = {
        ...session,
        rounds: [firstRound],
      };

      await persistSession(sessionWithRound);
      set({ session: sessionWithRound, loading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to start game.";
      set({ error: msg, loading: false });
    }
  },

  nextRound: async () => {
    const { session } = get();
    if (!session || session.state !== "Active") return;

    set({ error: null });

    try {
      const allDares = await loadAllDares();
      const newRound = createRound(session, allDares);
      const updated: GameSession = {
        ...session,
        rounds: [...session.rounds, newRound],
      };

      await persistSession(updated);
      set({ session: updated });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to create next round.";
      set({ error: msg });
    }
  },

  revealCurrentRound: () => {
    const { session } = get();
    if (!session || session.state !== "Active") return;

    const rounds = [...session.rounds];
    const currentIndex = rounds.length - 1;
    if (currentIndex < 0) return;

    const current = rounds[currentIndex];
    if (current.state !== "Pending") return;

    rounds[currentIndex] = revealRound(current);
    set({ session: { ...session, rounds } });
  },

  resolveCurrentRound: async (result) => {
    const { session } = get();
    if (!session || session.state !== "Active") return;

    set({ error: null });

    try {
      const rounds = [...session.rounds];
      const currentIndex = rounds.length - 1;
      if (currentIndex < 0) return;

      const current = rounds[currentIndex];
      if (current.state !== "Revealed") return;

      // Validate skip/pass
      if (result === "Skipped" && !canSkip(current.playerId, session.history, session.configuration.skipLimit)) {
        set({ error: "No skips remaining for this player." });
        return;
      }
      if (result === "Passed" && !canPass(session.configuration.rules.allowPasses)) {
        set({ error: "Passes are not allowed in this game." });
        return;
      }

      // Find the player and dare for the history entry
      const player = session.players.find((p) => p.id === current.playerId);
      const allDares = await loadAllDares();
      const dare = allDares.find((d) => d.id === current.dareId);

      if (!player || !dare) {
        set({ error: "Could not find player or dare for this round." });
        return;
      }

      const [resolvedRound, historyEntry] = resolveRound(current, result, player, dare);
      rounds[currentIndex] = resolvedRound;

      let updated: GameSession = {
        ...session,
        rounds,
        history: [...session.history, historyEntry],
      };

      // Check if game should end
      if (isGameComplete(updated)) {
        updated = completeGame(updated);
      }

      await persistSession(updated);
      set({ session: updated });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to resolve round.";
      set({ error: msg });
    }
  },

  endGame: async () => {
    const { session } = get();
    if (!session || session.state !== "Active") return;

    try {
      const completed = completeGame(session);
      await persistSession(completed);
      set({ session: completed, error: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to end game.";
      set({ error: msg });
    }
  },

  playAgain: async () => {
    const { session } = get();
    if (!session || session.state !== "Completed") return;

    try {
      // Archive current session
      const existingArchived = await getArchivedSessions();
      const [, updatedArchived] = archiveSession(session, existingArchived);
      await setArchivedSessions(updatedArchived);

      // Create new session with same players/config
      const newSession = createPlayAgainSession(nanoid(), session);

      // Create first round
      const allDares = await loadAllDares();
      const firstRound = createRound(newSession, allDares);
      const sessionWithRound: GameSession = {
        ...newSession,
        rounds: [firstRound],
      };

      await persistSession(sessionWithRound);
      set({ session: sessionWithRound, error: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to play again.";
      set({ error: msg });
    }
  },

  newGame: async () => {
    const { session } = get();

    try {
      if (session && session.state === "Completed") {
        const existingArchived = await getArchivedSessions();
        const [, updatedArchived] = archiveSession(session, existingArchived);
        await setArchivedSessions(updatedArchived);
      }

      await persistSession(null);
      set({ session: null, error: null });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to start new game.";
      set({ error: msg });
    }
  },

  resumeSession: async () => {
    set({ loading: true, error: null });

    try {
      const storedSession = await getActiveSession();
      const allDares = await loadAllDares();
      const recovered = recoverSession(storedSession, allDares);

      set({ session: recovered, loading: false });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to resume session.";
      set({ error: msg, loading: false });
    }
  },

  resetSession: async () => {
    await persistSession(null);
    set({ session: null, error: null, loading: false });
  },
}));

// ─── Granular Selectors ────────────────────────────────────────────────────────

/** Selects the current (last) round, or undefined if none. */
export const selectCurrentRound = (state: GameSessionStore) => {
  const rounds = state.session?.rounds;
  return rounds && rounds.length > 0 ? rounds[rounds.length - 1] : undefined;
};

/** Selects the current round's player, or undefined. */
export const selectCurrentPlayer = (state: GameSessionStore) => {
  const round = selectCurrentRound(state);
  if (!round || !state.session) return undefined;
  return state.session.players.find((p) => p.id === round.playerId);
};

/** Selects the round progress as { current, total }. */
export const selectRoundProgress = (state: GameSessionStore) => {
  if (!state.session) return { current: 0, total: 0 };
  return {
    current: state.session.history.length + 1,
    total: state.session.configuration.rounds,
  };
};

/** Selects the number of skips remaining for the current round's player. */
export const selectSkipsRemaining = (state: GameSessionStore) => {
  const round = selectCurrentRound(state);
  if (!round || !state.session) return 0;
  return getSkipsRemaining(
    round.playerId,
    state.session.history,
    state.session.configuration.skipLimit,
  );
};

/** Selects whether the current player can skip. */
export const selectCanSkip = (state: GameSessionStore) => {
  const round = selectCurrentRound(state);
  if (!round || !state.session) return false;
  return canSkip(
    round.playerId,
    state.session.history,
    state.session.configuration.skipLimit,
  );
};

/** Selects whether passes are allowed in the current game. */
export const selectCanPass = (state: GameSessionStore) => {
  if (!state.session) return false;
  return canPass(state.session.configuration.rules.allowPasses);
};
