import {
  Dare,
  HistoryEntry,
  Player,
  Round,
  RoundResult,
} from "../types";

/**
 * Creates an immutable HistoryEntry from a resolved Round.
 *
 * Denormalizes playerNameSnapshot and dareTextSnapshot at write time
 * so that history remains accurate even if the source entities are
 * later modified (DATA_MODEL.md §17.7).
 *
 * @param round  The resolved Round (must have state === "Resolved" and a result).
 * @param player The Player referenced by round.playerId.
 * @param dare   The Dare referenced by round.dareId.
 * @returns A fully populated HistoryEntry.
 */
export function createHistoryEntry(
  round: Round,
  player: Player,
  dare: Dare,
): HistoryEntry {
  if (round.result === undefined) {
    throw new Error("[HistoryService] Cannot create history entry from unresolved round.");
  }

  return {
    roundNumber: round.roundNumber,
    playerId: player.id,
    playerNameSnapshot: player.name,
    dareId: dare.id,
    dareTextSnapshot: dare.text,
    difficulty: dare.difficulty,
    result: round.result as RoundResult,
    timestamp: new Date().toISOString(),
  };
}
