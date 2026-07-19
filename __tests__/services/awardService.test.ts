import { describe, expect, it } from "@jest/globals";

import { computeAwards } from "../../services/awardService";
import { HistoryEntry, Player } from "../../types";

// ─── Test Helpers ──────────────────────────────────────────────────────────────

function makePlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `player-${i + 1}`,
    name: `Player ${i + 1}`,
    avatarColor: "coral" as const,
    createdAt: new Date().toISOString(),
  }));
}

function makeEntry(
  roundNumber: number,
  playerId: string,
  result: "Completed" | "Skipped" | "Passed",
  difficulty: "Mild" | "Spicy" | "Extreme" = "Mild",
): HistoryEntry {
  return {
    roundNumber,
    playerId,
    playerNameSnapshot: "Test",
    dareId: `dare-${roundNumber}`,
    dareTextSnapshot: "Test dare",
    difficulty,
    result,
    timestamp: new Date().toISOString(),
  };
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("computeAwards", () => {
  const players = makePlayers(3);

  it("returns empty array for empty history", () => {
    expect(computeAwards([], players)).toEqual([]);
  });

  it("computes 'Dare Devil' for highest completion rate with ≥3 rounds", () => {
    const history: HistoryEntry[] = [
      makeEntry(1, "player-1", "Completed"),
      makeEntry(2, "player-1", "Completed"),
      makeEntry(3, "player-1", "Completed"),
      makeEntry(4, "player-2", "Completed"),
      makeEntry(5, "player-2", "Skipped"),
      makeEntry(6, "player-2", "Skipped"),
    ];

    const awards = computeAwards(history, players);
    const dareDevil = awards.find((a) => a.title === "Dare Devil");
    expect(dareDevil).toBeDefined();
    expect(dareDevil!.playerId).toBe("player-1"); // 100% vs 33%
  });

  it("computes 'Biggest Chicken' for most skips with ≥3 rounds", () => {
    const history: HistoryEntry[] = [
      makeEntry(1, "player-1", "Skipped"),
      makeEntry(2, "player-1", "Skipped"),
      makeEntry(3, "player-1", "Completed"),
      makeEntry(4, "player-2", "Skipped"),
      makeEntry(5, "player-2", "Completed"),
      makeEntry(6, "player-2", "Completed"),
    ];

    const awards = computeAwards(history, players);
    const chicken = awards.find((a) => a.title === "Biggest Chicken");
    expect(chicken).toBeDefined();
    expect(chicken!.playerId).toBe("player-1");
  });

  it("computes 'Skip Master' for most skips with zero passes and ≥3 rounds", () => {
    const history: HistoryEntry[] = [
      makeEntry(1, "player-1", "Skipped"),
      makeEntry(2, "player-1", "Skipped"),
      makeEntry(3, "player-1", "Completed"),
      makeEntry(4, "player-2", "Skipped"),
      makeEntry(5, "player-2", "Passed"),
      makeEntry(6, "player-2", "Completed"),
    ];

    const awards = computeAwards(history, players);
    const skipMaster = awards.find((a) => a.title === "Skip Master");
    expect(skipMaster).toBeDefined();
    expect(skipMaster!.playerId).toBe("player-1"); // player-2 has a pass
  });

  it("computes 'Most Fearless' for zero skips and ≥5 completions", () => {
    const history: HistoryEntry[] = [];
    for (let i = 0; i < 6; i++) {
      history.push(makeEntry(i + 1, "player-1", "Completed"));
    }
    // player-2 has a skip
    history.push(makeEntry(7, "player-2", "Completed"));
    history.push(makeEntry(8, "player-2", "Skipped"));

    const awards = computeAwards(history, players);
    const fearless = awards.find((a) => a.title === "Most Fearless");
    expect(fearless).toBeDefined();
    expect(fearless!.playerId).toBe("player-1");
  });

  it("computes 'Comedy King' for most completions", () => {
    const history: HistoryEntry[] = [
      makeEntry(1, "player-1", "Completed"),
      makeEntry(2, "player-1", "Completed"),
      makeEntry(3, "player-2", "Completed"),
    ];

    const awards = computeAwards(history, players);
    const comedy = awards.find((a) => a.title === "Comedy King");
    expect(comedy).toBeDefined();
    expect(comedy!.playerId).toBe("player-1");
  });

  it("uses player index for tie-breaking", () => {
    const history: HistoryEntry[] = [
      makeEntry(1, "player-1", "Completed"),
      makeEntry(2, "player-1", "Completed"),
      makeEntry(3, "player-1", "Completed"),
      makeEntry(4, "player-2", "Completed"),
      makeEntry(5, "player-2", "Completed"),
      makeEntry(6, "player-2", "Completed"),
    ];

    const awards = computeAwards(history, players);
    const dareDevil = awards.find((a) => a.title === "Dare Devil");
    expect(dareDevil).toBeDefined();
    // Both have 100% completion — player-1 has lower index
    expect(dareDevil!.playerId).toBe("player-1");
  });

  it("omits awards when no player is eligible", () => {
    // Only 2 rounds per player — below ≥3 threshold for most awards
    const history: HistoryEntry[] = [
      makeEntry(1, "player-1", "Completed"),
      makeEntry(2, "player-2", "Completed"),
    ];

    const awards = computeAwards(history, players);
    // Only Comedy King should appear (no minimum)
    expect(awards.find((a) => a.title === "Dare Devil")).toBeUndefined();
    expect(awards.find((a) => a.title === "Most Fearless")).toBeUndefined();
    expect(awards.find((a) => a.title === "Comedy King")).toBeDefined();
  });
});
