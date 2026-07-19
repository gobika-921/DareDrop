import { AwardTitle } from "./enums";

export interface Award {
  playerId: string;
  title: AwardTitle;
  description: string;
}
