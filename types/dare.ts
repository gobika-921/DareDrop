import { Difficulty, DareSource } from "./enums";

export interface Dare {
  id: string;
  text: string;              // 5–300 chars (custom); pre-validated (bundled)
  difficulty: Difficulty;
  source: DareSource;
  packId: string | null;     // owning pack; null = unassigned custom dare
  createdAt?: string;        // required for custom, absent for bundled
  updatedAt?: string;        // present only if edited at least once
}
