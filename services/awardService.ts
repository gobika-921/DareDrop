import {
  Award,
  AwardTitle,
  HistoryEntry,
  Player,
} from "../types";

/**
 * Per-player stats computed from history for award calculation.
 */
interface PlayerStats {
  playerId: string;
  playerIndex: number;
  roundsPlayed: number;
  completed: number;
  skipped: number;
  passed: number;
  completionRate: number;
}

/**
 * Computes all awards from session history.
 *
 * Award rules (GAME_RULES.md §9):
 * - "Dare Devil": Highest completion rate, ≥3 rounds.
 * - "Biggest Chicken": Most skips, ≥3 rounds.
 * - "Skip Master": Most skips, zero passes, ≥3 rounds.
 * - "Most Fearless": Zero skips, ≥5 completed rounds.
 * - "Comedy King": Most completed dares, ≥1 completion.
 *
 * Tie-breaking: player with lowest index in players array wins (§9.3).
 * Awards with no eligible players are omitted (§9.5).
 *
 * @param history The complete session history.
 * @param players The session's player snapshot.
 * @returns Array of earned Awards.
 */
export function computeAwards(
  history: readonly HistoryEntry[],
  players: readonly Player[],
): Award[] {
  if (history.length === 0) return [];

  const statsMap = buildPlayerStats(history, players);
  const stats = Array.from(statsMap.values());
  const awards: Award[] = [];

  // "Dare Devil" — highest completion rate, ≥3 rounds
  const dareDevelEligible = stats.filter((s) => s.roundsPlayed >= 3);
  const dareDevil = pickWinner(dareDevelEligible, (a, b) => b.completionRate - a.completionRate);
  if (dareDevil) {
    awards.push(createAward(dareDevil.playerId, "Dare Devil", `Completed ${Math.round(dareDevil.completionRate * 100)}% of their dares`));
  }

  // "Biggest Chicken" — most skips, ≥3 rounds
  const chickenEligible = stats.filter((s) => s.roundsPlayed >= 3 && s.skipped > 0);
  const chicken = pickWinner(chickenEligible, (a, b) => b.skipped - a.skipped);
  if (chicken) {
    awards.push(createAward(chicken.playerId, "Biggest Chicken", `Skipped ${chicken.skipped} dare${chicken.skipped !== 1 ? "s" : ""}`));
  }

  // "Skip Master" — most skips, zero passes, ≥3 rounds
  const skipMasterEligible = stats.filter((s) => s.roundsPlayed >= 3 && s.skipped > 0 && s.passed === 0);
  const skipMaster = pickWinner(skipMasterEligible, (a, b) => b.skipped - a.skipped);
  if (skipMaster) {
    awards.push(createAward(skipMaster.playerId, "Skip Master", `Skipped ${skipMaster.skipped} dare${skipMaster.skipped !== 1 ? "s" : ""} without a single pass`));
  }

  // "Most Fearless" — zero skips, ≥5 completed rounds
  const fearlessEligible = stats.filter((s) => s.skipped === 0 && s.completed >= 5);
  const fearless = pickWinner(fearlessEligible, (a, b) => b.completed - a.completed);
  if (fearless) {
    awards.push(createAward(fearless.playerId, "Most Fearless", `Completed ${fearless.completed} dares without skipping once`));
  }

  // "Comedy King" — most completed dares, ≥1 completion
  const comedyEligible = stats.filter((s) => s.completed >= 1);
  const comedyKing = pickWinner(comedyEligible, (a, b) => b.completed - a.completed);
  if (comedyKing) {
    awards.push(createAward(comedyKing.playerId, "Comedy King", `Completed the most dares with ${comedyKing.completed} total`));
  }

  return awards;
}

/**
 * Builds a per-player stats map from history.
 */
function buildPlayerStats(
  history: readonly HistoryEntry[],
  players: readonly Player[],
): Map<string, PlayerStats> {
  const statsMap = new Map<string, PlayerStats>();

  players.forEach((player, index) => {
    statsMap.set(player.id, {
      playerId: player.id,
      playerIndex: index,
      roundsPlayed: 0,
      completed: 0,
      skipped: 0,
      passed: 0,
      completionRate: 0,
    });
  });

  for (const entry of history) {
    const stat = statsMap.get(entry.playerId);
    if (!stat) continue;
    stat.roundsPlayed++;
    if (entry.result === "Completed") stat.completed++;
    else if (entry.result === "Skipped") stat.skipped++;
    else if (entry.result === "Passed") stat.passed++;
  }

  // Compute completion rates
  for (const stat of statsMap.values()) {
    stat.completionRate = stat.roundsPlayed > 0
      ? stat.completed / stat.roundsPlayed
      : 0;
  }

  return statsMap;
}

/**
 * Picks the winner from eligible stats using a comparator.
 * Tie-breaking: player with lowest playerIndex wins (§9.3).
 */
function pickWinner(
  eligible: PlayerStats[],
  comparator: (a: PlayerStats, b: PlayerStats) => number,
): PlayerStats | null {
  if (eligible.length === 0) return null;

  eligible.sort((a, b) => {
    const primary = comparator(a, b);
    if (primary !== 0) return primary;
    // Tie-break by player index (lowest wins)
    return a.playerIndex - b.playerIndex;
  });

  return eligible[0];
}

function createAward(playerId: string, title: AwardTitle, description: string): Award {
  return { playerId, title, description };
}
