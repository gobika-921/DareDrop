import { HistoryEntry, Player, Summary } from "../types";

import { computeAwards } from "./awardService";

/**
 * Generates a complete Summary from session history.
 *
 * Summary rules (GAME_RULES.md §8):
 * - Generated once when GameSession transitions to Completed.
 * - Derived entirely from GameSession.history.
 * - Invariant: completed + skipped + passed === totalRounds.
 *
 * @param history The complete session history (must contain only Resolved rounds).
 * @param players The session's player snapshot.
 * @returns A fully populated Summary.
 */
export function generateSummary(
  history: readonly HistoryEntry[],
  players: readonly Player[],
): Summary {
  const totalRounds = history.length;
  const completed = history.filter((e) => e.result === "Completed").length;
  const skipped = history.filter((e) => e.result === "Skipped").length;
  const passed = history.filter((e) => e.result === "Passed").length;

  // Invariant check (DATA_MODEL.md §15.3)
  if (completed + skipped + passed !== totalRounds) {
    console.error(
      `[StatisticsService] Invariant violation: ${completed} + ${skipped} + ${passed} !== ${totalRounds}`,
    );
  }

  const completionRate = totalRounds > 0 ? completed / totalRounds : 0;
  const awards = computeAwards(history, players);

  return {
    totalRounds,
    completed,
    skipped,
    passed,
    completionRate,
    awards,
  };
}
