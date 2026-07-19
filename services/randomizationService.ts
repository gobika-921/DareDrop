import {
  Dare,
  Difficulty,
  GameRules,
  HistoryEntry,
  Player,
} from "../types";

/**
 * Default random number generator — returns a number in [0, 1).
 * Replaced by a seeded function in tests for deterministic behavior.
 */
type RandomFn = () => number;
const defaultRandom: RandomFn = () => Math.random();

/**
 * Picks a random element from an array using the provided random function.
 * Returns undefined if the array is empty.
 */
function pickRandom<T>(arr: readonly T[], randomFn: RandomFn): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(randomFn() * arr.length)];
}

// ─── Player Selection ──────────────────────────────────────────────────────────

/**
 * Selects the next player for a round.
 *
 * Rules (GAME_RULES.md §3):
 * 1. Equal probability for all eligible players.
 * 2. Soft preference: avoid immediate repetition of the last player.
 * 3. If noRepeatPlayers is enabled, enforce full-cycle rotation before repeats.
 *
 * @param players    The immutable snapshot of session players.
 * @param history    The session's history entries (used to derive the cycle).
 * @param rules      The active game rules.
 * @param randomFn   Optional injectable random for deterministic testing.
 * @returns The selected Player.
 */
export function selectPlayer(
  players: readonly Player[],
  history: readonly HistoryEntry[],
  rules: GameRules,
  randomFn: RandomFn = defaultRandom,
): Player {
  if (players.length === 0) {
    throw new Error("[RandomizationService] Cannot select from empty player pool.");
  }
  if (players.length === 1) {
    return players[0];
  }

  const lastPlayerId = history.length > 0
    ? history[history.length - 1].playerId
    : null;

  if (rules.noRepeatPlayers) {
    return selectPlayerNoRepeat(players, history, lastPlayerId, randomFn);
  }

  // Soft preference: avoid immediate repeat
  const candidates = players.filter((p) => p.id !== lastPlayerId);
  if (candidates.length === 0) {
    // Only one player was available and it's the last one — unavoidable repeat
    return players[0];
  }
  return pickRandom(candidates, randomFn)!;
}

/**
 * No-repeat-cycle player selection (GAME_RULES.md §3.3).
 * Tracks which players have been selected in the current cycle.
 * A cycle completes when every player has been selected at least once.
 */
function selectPlayerNoRepeat(
  players: readonly Player[],
  history: readonly HistoryEntry[],
  lastPlayerId: string | null,
  randomFn: RandomFn,
): Player {
  const N = players.length;
  const cycleIndex = history.length % N;
  
  const currentCycleHistory = history.slice(history.length - cycleIndex);
  const selectedInCycle = new Set(currentCycleHistory.map(h => h.playerId));

  const remaining = players.filter((p) => !selectedInCycle.has(p.id));

  // Soft preference: avoid immediate repeat (§3.2)
  if (remaining.length > 1 && lastPlayerId !== null) {
    const withoutLast = remaining.filter((p) => p.id !== lastPlayerId);
    if (withoutLast.length > 0) {
      return pickRandom(withoutLast, randomFn)!;
    }
  }

  return pickRandom(remaining, randomFn)!;
}

// ─── Dare Selection ────────────────────────────────────────────────────────────

/**
 * Builds the pool of eligible dares based on selected packs and difficulties.
 *
 * @param allDares           All available dares (bundled + custom).
 * @param selectedPackIds    Pack IDs chosen in GameConfiguration.
 * @param enabledDifficulties Difficulties enabled in GameConfiguration.
 * @returns Filtered array of eligible dares.
 */
export function buildEligibleDarePool(
  allDares: readonly Dare[],
  selectedPackIds: readonly string[],
  enabledDifficulties: readonly Difficulty[],
): Dare[] {
  const packIdSet = new Set(selectedPackIds);
  const difficultySet = new Set(enabledDifficulties);

  return allDares.filter(
    (d) =>
      d.packId !== null &&
      packIdSet.has(d.packId) &&
      difficultySet.has(d.difficulty),
  );
}

/**
 * Selects the next dare for a round.
 *
 * Rules (GAME_RULES.md §4):
 * 1. Equal probability for all eligible dares.
 * 2. Soft preference: avoid immediate repetition of the last dare.
 * 3. If noRepeatDares is enabled, enforce no-repeat until all eligible dares used.
 *
 * @param eligibleDares The pre-filtered pool of eligible dares.
 * @param usedDareIds   Set of dare IDs already used in this session.
 * @param lastDareId    The dare ID used in the previous round (or null).
 * @param rules         The active game rules.
 * @param randomFn      Optional injectable random for deterministic testing.
 * @returns The selected Dare.
 */
export function selectDare(
  eligibleDares: readonly Dare[],
  usedDareIds: ReadonlySet<string>,
  lastDareId: string | null,
  rules: GameRules,
  randomFn: RandomFn = defaultRandom,
): Dare {
  if (eligibleDares.length === 0) {
    throw new Error("[RandomizationService] Cannot select from empty dare pool.");
  }
  if (eligibleDares.length === 1) {
    return eligibleDares[0];
  }

  if (rules.noRepeatDares) {
    return selectDareNoRepeat(eligibleDares, usedDareIds, lastDareId, randomFn);
  }

  // Soft preference: avoid immediate repeat
  const candidates = eligibleDares.filter((d) => d.id !== lastDareId);
  if (candidates.length === 0) {
    return eligibleDares[0];
  }
  return pickRandom(candidates, randomFn)!;
}

/**
 * No-repeat dare selection (GAME_RULES.md §4.3).
 * Tracks which dares have been used. When all are used, resets the tracking.
 */
function selectDareNoRepeat(
  eligibleDares: readonly Dare[],
  usedDareIds: ReadonlySet<string>,
  lastDareId: string | null,
  randomFn: RandomFn,
): Dare {
  // Filter to unused dares
  let remaining = eligibleDares.filter((d) => !usedDareIds.has(d.id));

  // If all dares have been used, reset (§4.3)
  if (remaining.length === 0) {
    remaining = [...eligibleDares];
  }

  // Soft preference: avoid immediate repeat
  if (remaining.length > 1 && lastDareId !== null) {
    const withoutLast = remaining.filter((d) => d.id !== lastDareId);
    if (withoutLast.length > 0) {
      return pickRandom(withoutLast, randomFn)!;
    }
  }

  return pickRandom(remaining, randomFn)!;
}
