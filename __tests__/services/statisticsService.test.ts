import { describe, expect, it } from "@jest/globals";

import { generateSummary } from "../../services/statisticsService";
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
): HistoryEntry {
  return {
    roundNumber,
    playerId,
    playerNameSnapshot: "Test",
    dareId: `dare-${roundNumber}`,
    dareTextSnapshot: "Test dare",
    difficulty: "Mild",
    result,
    timestamp: new Date().toISOString(),
  };
}

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("generateSummary", () => {
  const players = makePlayers(2);

  it("produces correct counts for mixed results", () => {
    const history: HistoryEntry[] = [
      makeEntry(1, "player-1", "Completed"),
      makeEntry(2, "player-2", "Skipped"),
      makeEntry(3, "player-1", "Passed"),
      makeEntry(4, "player-2", "Completed"),
      makeEntry(5, "player-1", "Completed"),
    ];

    const summary = generateSummary(history, players);

    expect(summary.totalRounds).toBe(5);
    expect(summary.completed).toBe(3);
    expect(summary.skipped).toBe(1);
    expect(summary.passed).toBe(1);
  });

  it("maintains invariant: completed + skipped + passed === totalRounds", () => {
    const history: HistoryEntry[] = [
      makeEntry(1, "player-1", "Completed"),
      makeEntry(2, "player-2", "Skipped"),
      makeEntry(3, "player-1", "Passed"),
    ];

    const summary = generateSummary(history, players);
    expect(summary.completed + summary.skipped + summary.passed).toBe(summary.totalRounds);
  });

  it("computes correct completion rate", () => {
    const history: HistoryEntry[] = [
      makeEntry(1, "player-1", "Completed"),
      makeEntry(2, "player-2", "Completed"),
      makeEntry(3, "player-1", "Skipped"),
      makeEntry(4, "player-2", "Completed"),
    ];

    const summary = generateSummary(history, players);
    expect(summary.completionRate).toBe(0.75); // 3/4
  });

  it("handles empty history (degenerate session)", () => {
    const summary = generateSummary([], players);

    expect(summary.totalRounds).toBe(0);
    expect(summary.completed).toBe(0);
    expect(summary.skipped).toBe(0);
    expect(summary.passed).toBe(0);
    expect(summary.completionRate).toBe(0);
    expect(summary.awards).toEqual([]);
  });

  it("includes awards in the summary", () => {
    const history: HistoryEntry[] = [];
    // Give player-1 enough rounds for Comedy King
    for (let i = 0; i < 5; i++) {
      history.push(makeEntry(i + 1, "player-1", "Completed"));
    }

    const summary = generateSummary(history, players);
    expect(summary.awards.length).toBeGreaterThan(0);
  });
});
