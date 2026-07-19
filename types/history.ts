import { Difficulty, RoundResult } from "./enums";

export interface HistoryEntry {
  roundNumber: number;
  playerId: string;
  playerNameSnapshot: string;   // denormalized at write time — see rationale below
  dareId: string;
  dareTextSnapshot: string;     // denormalized at write time
  difficulty: Difficulty;
  result: RoundResult;
  timestamp: string;
}
