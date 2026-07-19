import {
  Dare,
  GameConfiguration,
  GameSession,
  HistoryEntry,
  Player,
} from "../types";

/**
 * Validates that a game session can transition to Active.
 *
 * Pre-flight checks (GAME_RULES.md §10.1):
 * - At least 2 players.
 * - At least one difficulty enabled.
 * - At least one pack selected with ≥1 eligible dare.
 * - skipLimit ≤ rounds.
 * - rounds between 5 and 100.
 *
 * @returns An error message string, or null if valid.
 */
export function validateGameStart(
  players: readonly Player[],
  configuration: GameConfiguration,
  allDares: readonly Dare[],
): string | null {
  if (players.length < 2) {
    return "At least 2 players are required to start a game.";
  }
  if (players.length > 20) {
    return "A maximum of 20 players is allowed.";
  }
  if (configuration.difficulty.length === 0) {
    return "At least one difficulty must be enabled.";
  }
  if (configuration.rounds < 5 || configuration.rounds > 100) {
    return "Round count must be between 5 and 100.";
  }
  if (configuration.skipLimit < 0 || configuration.skipLimit > configuration.rounds) {
    return "Skip limit must be between 0 and the number of rounds.";
  }
  if (configuration.selectedPackIds.length === 0) {
    return "At least one dare pack must be selected.";
  }

  // Check that the selected packs contain at least one eligible dare
  const packIdSet = new Set(configuration.selectedPackIds);
  const difficultySet = new Set(configuration.difficulty);
  const eligibleDareCount = allDares.filter(
    (d) => d.packId !== null && packIdSet.has(d.packId) && difficultySet.has(d.difficulty),
  ).length;

  if (eligibleDareCount === 0) {
    return "Selected packs and difficulties must contain at least one eligible dare.";
  }

  return null;
}

/**
 * Checks whether a player can skip a dare.
 *
 * Skip counts are derived from history, never stored on Player (GAME_RULES.md §5.3).
 *
 * @param playerId  The player's ID.
 * @param history   The session's history.
 * @param skipLimit The configured skip limit.
 * @returns true if the player can skip.
 */
export function canSkip(
  playerId: string,
  history: readonly HistoryEntry[],
  skipLimit: number,
): boolean {
  const skipsUsed = history.filter(
    (e) => e.playerId === playerId && e.result === "Skipped",
  ).length;
  return skipsUsed < skipLimit;
}

/**
 * Returns the number of skips a player has used.
 * Derived from history (DATA_MODEL.md §19).
 */
export function getSkipsUsed(
  playerId: string,
  history: readonly HistoryEntry[],
): number {
  return history.filter(
    (e) => e.playerId === playerId && e.result === "Skipped",
  ).length;
}

/**
 * Returns the number of remaining skips for a player.
 */
export function getSkipsRemaining(
  playerId: string,
  history: readonly HistoryEntry[],
  skipLimit: number,
): number {
  return Math.max(0, skipLimit - getSkipsUsed(playerId, history));
}

/**
 * Checks whether passes are allowed.
 *
 * GAME_RULES.md §6.1: Passes are available only if allowPasses is true.
 */
export function canPass(allowPasses: boolean): boolean {
  return allowPasses;
}

/**
 * Validates a persisted session for structural integrity.
 * Returns null if the session is corrupted.
 */
export function validateSessionIntegrity(
  session: GameSession,
  allDares: readonly Dare[],
): string | null {
  if (!session.id) return "Session has no ID.";
  if (!session.state) return "Session has no state.";
  if (!session.configuration) return "Session has no configuration.";
  if (!Array.isArray(session.players) || session.players.length < 2) {
    return "Session has fewer than 2 players.";
  }
  if (!Array.isArray(session.rounds)) return "Session has no rounds array.";
  if (!Array.isArray(session.history)) return "Session has no history array.";

  // Verify that all referenced dares still exist
  const dareIdSet = new Set(allDares.map((d) => d.id));
  for (const round of session.rounds) {
    if (!dareIdSet.has(round.dareId)) {
      return `Round ${round.roundNumber} references unknown dare ${round.dareId}.`;
    }
  }

  return null;
}
