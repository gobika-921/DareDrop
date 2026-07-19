import { RoundState, RoundResult } from "./enums";

export interface Round {
  roundNumber: number;      // sequential, gapless, starts at 1
  state: RoundState;
  playerId: string;         // → Player.id
  dareId: string;           // → Dare.id
  result?: RoundResult;     // present only once state === "Resolved"
  startedAt: string;
  completedAt?: string;
}
