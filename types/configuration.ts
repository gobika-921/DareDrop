import { Difficulty } from "./enums";

export interface GameRules {
  noRepeatPlayers: boolean;
  noRepeatDares: boolean;
  allowPasses: boolean;
}

export interface GameConfiguration {
  difficulty: Difficulty[];        // at least one required
  rounds: number;                  // 5–100
  skipLimit: number;               // 0–rounds
  selectedPackIds: string[];       // at least one pack with ≥1 eligible dare
  allowCustomDares: boolean;
  rules: GameRules;
}
