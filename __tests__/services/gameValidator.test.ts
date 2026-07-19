import { describe, expect, it } from "@jest/globals";

import { BUNDLED_DARES } from "../../data/bundledDares";
import {
  canPass,
  canSkip,
  getSkipsRemaining,
  getSkipsUsed,
  validateGameStart,
} from "../../services/gameValidator";
import { Dare, HistoryEntry, Player } from "../../types";

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
  playerId: string,
  result: "Completed" | "Skipped" | "Passed",
): HistoryEntry {
  return {
    roundNumber: 1,
    playerId,
    playerNameSnapshot: "Test",
    dareId: "dare-1",
    dareTextSnapshot: "Test dare",
    difficulty: "Mild",
    result,
    timestamp: new Date().toISOString(),
  };
}

const validConfig = {
  difficulty: ["Mild" as const],
  rounds: 10,
  skipLimit: 3,
  selectedPackIds: ["pack-mild"],
  allowCustomDares: false,
  rules: { noRepeatPlayers: false, noRepeatDares: false, allowPasses: false },
};

// ─── Tests ─────────────────────────────────────────────────────────────────────

describe("validateGameStart", () => {
  it("returns null for a valid configuration", () => {
    const result = validateGameStart(makePlayers(2), validConfig, BUNDLED_DARES);
    expect(result).toBeNull();
  });

  it("rejects fewer than 2 players", () => {
    const result = validateGameStart(makePlayers(1), validConfig, BUNDLED_DARES);
    expect(result).not.toBeNull();
  });

  it("rejects more than 20 players", () => {
    const result = validateGameStart(makePlayers(21), validConfig, BUNDLED_DARES);
    expect(result).not.toBeNull();
  });

  it("rejects empty difficulty array", () => {
    const config = { ...validConfig, difficulty: [] as import("../../types").Difficulty[] };
    const result = validateGameStart(makePlayers(2), config, BUNDLED_DARES);
    expect(result).not.toBeNull();
  });

  it("rejects rounds below 5", () => {
    const config = { ...validConfig, rounds: 3 };
    const result = validateGameStart(makePlayers(2), config, BUNDLED_DARES);
    expect(result).not.toBeNull();
  });

  it("rejects rounds above 100", () => {
    const config = { ...validConfig, rounds: 101 };
    const result = validateGameStart(makePlayers(2), config, BUNDLED_DARES);
    expect(result).not.toBeNull();
  });

  it("rejects skipLimit > rounds", () => {
    const config = { ...validConfig, skipLimit: 11 };
    const result = validateGameStart(makePlayers(2), config, BUNDLED_DARES);
    expect(result).not.toBeNull();
  });

  it("rejects empty selectedPackIds", () => {
    const config = { ...validConfig, selectedPackIds: [] as string[] };
    const result = validateGameStart(makePlayers(2), config, BUNDLED_DARES);
    expect(result).not.toBeNull();
  });

  it("rejects when no eligible dares exist for selected packs+difficulties", () => {
    const config = { ...validConfig, selectedPackIds: ["nonexistent-pack"] };
    const result = validateGameStart(makePlayers(2), config, BUNDLED_DARES);
    expect(result).not.toBeNull();
  });
});

describe("canSkip", () => {
  it("returns true when player has skips remaining", () => {
    const history = [makeEntry("player-1", "Skipped")];
    expect(canSkip("player-1", history, 3)).toBe(true);
  });

  it("returns false when skip limit reached", () => {
    const history = [
      makeEntry("player-1", "Skipped"),
      makeEntry("player-1", "Skipped"),
      makeEntry("player-1", "Skipped"),
    ];
    expect(canSkip("player-1", history, 3)).toBe(false);
  });

  it("does not count other players skips", () => {
    const history = [
      makeEntry("player-2", "Skipped"),
      makeEntry("player-2", "Skipped"),
      makeEntry("player-2", "Skipped"),
    ];
    expect(canSkip("player-1", history, 3)).toBe(true);
  });

  it("does not count passes as skips", () => {
    const history = [
      makeEntry("player-1", "Passed"),
      makeEntry("player-1", "Passed"),
    ];
    expect(canSkip("player-1", history, 1)).toBe(true);
  });
});

describe("getSkipsUsed / getSkipsRemaining", () => {
  it("derives skip count from history", () => {
    const history = [
      makeEntry("player-1", "Skipped"),
      makeEntry("player-1", "Completed"),
      makeEntry("player-1", "Skipped"),
    ];
    expect(getSkipsUsed("player-1", history)).toBe(2);
    expect(getSkipsRemaining("player-1", history, 5)).toBe(3);
  });

  it("returns 0 remaining when at limit", () => {
    const history = [
      makeEntry("player-1", "Skipped"),
      makeEntry("player-1", "Skipped"),
    ];
    expect(getSkipsRemaining("player-1", history, 2)).toBe(0);
  });
});

describe("canPass", () => {
  it("returns true when passes are allowed", () => {
    expect(canPass(true)).toBe(true);
  });

  it("returns false when passes are not allowed", () => {
    expect(canPass(false)).toBe(false);
  });
});
