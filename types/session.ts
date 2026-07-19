import { GameConfiguration } from "./configuration";
import { GameSessionState } from "./enums";
import { HistoryEntry } from "./history";
import { Player } from "./player";
import { Round } from "./round";
import { Summary } from "./summary";

export interface GameSession {
  id: string;
  state: GameSessionState;
  configuration: GameConfiguration;
  players: Player[];              // snapshot, fixed at Active (Section 6.3)
  rounds: Round[];
  history: HistoryEntry[];
  summary?: Summary;               // present only once state === "Completed" | "Archived"
  startedAt?: string;              // set on entering Active
  endedAt?: string;                // set on entering Completed
}
