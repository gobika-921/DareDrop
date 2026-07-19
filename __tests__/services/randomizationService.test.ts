import { describe, expect, it } from "@jest/globals";

import { BUNDLED_DARES } from "../../data/bundledDares";
import {
  buildEligibleDarePool,
  selectDare,
  selectPlayer,
} from "../../services/randomizationService";
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

function makeHistory(entries: { playerId: string; dareId?: string }[]): HistoryEntry[] {
  return entries.map((e, i) => ({
    roundNumber: i + 1,
    playerId: e.playerId,
    playerNameSnapshot: "test",
    dareId: e.dareId ?? "dare-1",
    dareTextSnapshot: "test dare",
    difficulty: "Mild" as const,
    result: "Completed" as const,
    timestamp: new Date().toISOString(),
  }));
}

/**
 * Creates a seeded random function for deterministic tests.
 * Uses a simple LCG (Linear Congruential Generator).
 */
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// ─── Player Selection Tests ────────────────────────────────────────────────────

describe("selectPlayer", () => {
  const rules = { noRepeatPlayers: false, noRepeatDares: false, allowPasses: false };

  it("returns the only player if there is exactly one", () => {
    const players = makePlayers(1);
    const result = selectPlayer(players, [], rules);
    expect(result.id).toBe("player-1");
  });

  it("throws on empty player pool", () => {
    expect(() => selectPlayer([], [], rules)).toThrow();
  });

  it("avoids immediate repeat (soft preference)", () => {
    const players = makePlayers(3);
    const randomFn = seededRandom(42);
    const history = makeHistory([{ playerId: "player-1" }]);

    // Run 100 selections — "player-1" should never appear because soft preference avoids it
    const results = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const p = selectPlayer(players, history, rules, seededRandom(i));
      results.add(p.id);
    }
    // player-1 should NOT be selected as it's avoided via soft preference
    expect(results.has("player-1")).toBe(false);
  });

  it("selects all players with equal distribution over many rounds", () => {
    const players = makePlayers(4);
    const counts: Record<string, number> = {};
    const randomFn = seededRandom(7);

    for (let i = 0; i < 1000; i++) {
      const p = selectPlayer(players, [], rules, randomFn);
      counts[p.id] = (counts[p.id] || 0) + 1;
    }

    // Each player should appear roughly 250 times (±100 for randomness)
    for (const player of players) {
      expect(counts[player.id]).toBeGreaterThan(100);
      expect(counts[player.id]).toBeLessThan(400);
    }
  });

  describe("noRepeatPlayers", () => {
    const noRepeatRules = { ...rules, noRepeatPlayers: true };

    it("enforces full cycle before repeating any player", () => {
      const players = makePlayers(3);
      const selected: string[] = [];

      let history: HistoryEntry[] = [];
      for (let i = 0; i < 9; i++) {
        const p = selectPlayer(players, history, noRepeatRules, seededRandom(i * 31));
        selected.push(p.id);
        history = [...history, ...makeHistory([{ playerId: p.id }])];
      }

      // In each cycle of 3, all 3 players should appear
      for (let cycle = 0; cycle < 3; cycle++) {
        const cycleSlice = selected.slice(cycle * 3, (cycle + 1) * 3);
        const unique = new Set(cycleSlice);
        expect(unique.size).toBe(3);
      }
    });

    it("resets cycle when all players have been selected", () => {
      const players = makePlayers(2);
      const history = makeHistory([
        { playerId: "player-1" },
        { playerId: "player-2" },
      ]);

      // After a full cycle, both players should be eligible again
      const result = selectPlayer(players, history, noRepeatRules, seededRandom(1));
      expect(["player-1", "player-2"]).toContain(result.id);
    });
  });
});

// ─── Dare Pool Building ────────────────────────────────────────────────────────

describe("buildEligibleDarePool", () => {
  it("filters by selected packs", () => {
    const result = buildEligibleDarePool(
      BUNDLED_DARES,
      ["pack-mild"],
      ["Mild", "Spicy", "Extreme"],
    );
    expect(result.length).toBe(15);
    expect(result.every((d) => d.packId === "pack-mild")).toBe(true);
  });

  it("filters by enabled difficulties", () => {
    const result = buildEligibleDarePool(
      BUNDLED_DARES,
      ["pack-mild", "pack-spicy", "pack-extreme"],
      ["Extreme"],
    );
    expect(result.length).toBe(15);
    expect(result.every((d) => d.difficulty === "Extreme")).toBe(true);
  });

  it("returns empty array when no packs match", () => {
    const result = buildEligibleDarePool(BUNDLED_DARES, ["nonexistent"], ["Mild"]);
    expect(result.length).toBe(0);
  });

  it("returns all dares when all packs and difficulties selected", () => {
    const result = buildEligibleDarePool(
      BUNDLED_DARES,
      ["pack-mild", "pack-spicy", "pack-extreme"],
      ["Mild", "Spicy", "Extreme"],
    );
    expect(result.length).toBe(45);
  });
});

// ─── Dare Selection Tests ──────────────────────────────────────────────────────

describe("selectDare", () => {
  const mildDares = BUNDLED_DARES.filter((d) => d.difficulty === "Mild");
  const rules = { noRepeatPlayers: false, noRepeatDares: false, allowPasses: false };

  it("throws on empty dare pool", () => {
    expect(() => selectDare([], new Set(), null, rules)).toThrow();
  });

  it("returns the only dare when pool size is 1", () => {
    const result = selectDare([mildDares[0]], new Set(), null, rules);
    expect(result.id).toBe(mildDares[0].id);
  });

  it("avoids immediate repeat (soft preference)", () => {
    const lastId = mildDares[0].id;
    const results = new Set<string>();
    for (let i = 0; i < 50; i++) {
      const d = selectDare(mildDares, new Set(), lastId, rules, seededRandom(i));
      results.add(d.id);
    }
    expect(results.has(lastId)).toBe(false);
  });

  describe("noRepeatDares", () => {
    const noRepeatRules = { ...rules, noRepeatDares: true };

    it("does not repeat dares until all have been used", () => {
      const pool = mildDares.slice(0, 3); // 3 dares
      const used = new Set<string>();
      const selected: string[] = [];

      for (let i = 0; i < 3; i++) {
        const d = selectDare(pool, used, null, noRepeatRules, seededRandom(i * 17));
        selected.push(d.id);
        used.add(d.id);
      }

      // All 3 should be unique
      expect(new Set(selected).size).toBe(3);
    });

    it("resets when all dares used", () => {
      const pool = mildDares.slice(0, 2);
      const used = new Set(pool.map((d) => d.id)); // all used

      // Should still return a dare (pool resets)
      const result = selectDare(pool, used, null, noRepeatRules, seededRandom(5));
      expect(pool.map((d) => d.id)).toContain(result.id);
    });
  });
});
