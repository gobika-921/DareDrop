import {
  Dare,
  GameConfiguration,
  GameSession,
  HistoryEntry,
  Player,
  Round,
  RoundResult,
} from "../types";

import { createHistoryEntry } from "./historyService";
import {
  buildEligibleDarePool,
  selectDare,
  selectPlayer,
} from "./randomizationService";
import { generateSummary } from "./statisticsService";

type RandomFn = () => number;

/**
 * Maximum number of archived sessions (FIFO eviction). DATA_MODEL.md §13.3.
 */
const MAX_ARCHIVED_SESSIONS = 50;

// ─── Round Creation ────────────────────────────────────────────────────────────

/**
 * Creates a new Pending round by selecting a player and a dare.
 *
 * The round is created in the Pending state. It will transition to Revealed
 * when the spin animation completes, and to Resolved when the user acts.
 *
 * @param session   The current game session.
 * @param allDares  All available dares (bundled + custom).
 * @param randomFn  Optional injectable RNG for testing.
 * @returns The new Round.
 */
export function createRound(
  session: GameSession,
  allDares: readonly Dare[],
  randomFn?: RandomFn,
): Round {
  const { configuration, players, history, rounds } = session;

  // Select player
  const player = selectPlayer(players, history, configuration.rules, randomFn);

  // Build eligible dare pool
  const eligibleDares = buildEligibleDarePool(
    allDares,
    configuration.selectedPackIds,
    configuration.difficulty,
  );

  if (eligibleDares.length === 0) {
    throw new Error("[GameEngine] No eligible dares available. Check configuration.");
  }

  // Build used dare IDs set for no-repeat tracking
  const usedDareIds = new Set(history.map((h) => h.dareId));
  const lastDareId = history.length > 0 ? history[history.length - 1].dareId : null;

  // Select dare
  const dare = selectDare(
    eligibleDares,
    usedDareIds,
    lastDareId,
    configuration.rules,
    randomFn,
  );

  const roundNumber = rounds.length + 1;

  return {
    roundNumber,
    state: "Pending",
    playerId: player.id,
    dareId: dare.id,
    startedAt: new Date().toISOString(),
  };
}

// ─── Round State Transitions ───────────────────────────────────────────────────

/**
 * Transitions a round from Pending to Revealed.
 * Called when the spin animation completes.
 */
export function revealRound(round: Round): Round {
  if (round.state !== "Pending") {
    throw new Error(`[GameEngine] Cannot reveal round in state "${round.state}".`);
  }
  return { ...round, state: "Revealed" };
}

/**
 * Resolves a round with the given result and creates a HistoryEntry.
 *
 * @param round   The round to resolve (must be in Revealed state).
 * @param result  The outcome (Completed, Skipped, or Passed).
 * @param player  The Player for this round.
 * @param dare    The Dare for this round.
 * @returns A tuple of [resolvedRound, historyEntry].
 */
export function resolveRound(
  round: Round,
  result: RoundResult,
  player: Player,
  dare: Dare,
): [Round, HistoryEntry] {
  if (round.state !== "Revealed") {
    throw new Error(`[GameEngine] Cannot resolve round in state "${round.state}".`);
  }
  if (round.result !== undefined) {
    throw new Error("[GameEngine] Round already resolved — double-resolve rejected.");
  }

  const resolvedRound: Round = {
    ...round,
    state: "Resolved",
    result,
    completedAt: new Date().toISOString(),
  };

  const entry = createHistoryEntry(resolvedRound, player, dare);

  return [resolvedRound, entry];
}

// ─── Game Completion ───────────────────────────────────────────────────────────

/**
 * Checks whether the game should end.
 *
 * The game ends when the number of resolved rounds reaches the configured
 * round limit (GAME_RULES.md §2.3).
 */
export function isGameComplete(session: GameSession): boolean {
  return session.history.length >= session.configuration.rounds;
}

/**
 * Generates the summary and transitions the session to Completed.
 *
 * @param session The Active session with all rounds resolved.
 * @returns The Completed session with summary and endedAt set.
 */
export function completeGame(session: GameSession): GameSession {
  if (session.state !== "Active") {
    throw new Error(`[GameEngine] Cannot complete game in state "${session.state}".`);
  }

  const summary = generateSummary(session.history, session.players);

  return {
    ...session,
    state: "Completed",
    summary,
    endedAt: new Date().toISOString(),
  };
}

// ─── Session Archival ──────────────────────────────────────────────────────────

/**
 * Archives a Completed session.
 *
 * Transitions the session to Archived and appends it to the archived list,
 * enforcing the 50-session FIFO cap (GAME_RULES.md §11.3).
 *
 * @param session           The Completed session to archive.
 * @param archivedSessions  The current list of archived sessions.
 * @returns A tuple of [archivedSession, updatedArchivedList].
 */
export function archiveSession(
  session: GameSession,
  archivedSessions: GameSession[],
): [GameSession, GameSession[]] {
  const archived: GameSession = { ...session, state: "Archived" };

  const updated = [...archivedSessions, archived];

  // FIFO eviction if over cap
  while (updated.length > MAX_ARCHIVED_SESSIONS) {
    updated.shift();
  }

  return [archived, updated];
}

// ─── Session Creation ──────────────────────────────────────────────────────────

/**
 * Creates a new GameSession in Active state from validated players and configuration.
 *
 * @param id            A pre-generated UUID for the session.
 * @param players       The validated player list (will be snapshotted).
 * @param configuration The validated game configuration.
 * @returns A new Active GameSession.
 */
export function createActiveSession(
  id: string,
  players: Player[],
  configuration: GameConfiguration,
): GameSession {
  return {
    id,
    state: "Active",
    configuration,
    players: [...players], // snapshot by value (DATA_MODEL.md §6.3)
    rounds: [],
    history: [],
    startedAt: new Date().toISOString(),
  };
}

/**
 * Creates a new session with the same players and configuration ("Play Again").
 * The previous session must be archived first (GAME_RULES.md §11.1).
 */
export function createPlayAgainSession(
  newId: string,
  previousSession: GameSession,
): GameSession {
  return createActiveSession(
    newId,
    previousSession.players,
    previousSession.configuration,
  );
}
