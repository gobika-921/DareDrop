import { Award } from "./award";

export interface Summary {
  totalRounds: number;
  completed: number;
  skipped: number;
  passed: number;
  completionRate: number;   // completed / totalRounds, computed at generation time
  awards: Award[];
}
