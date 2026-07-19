import { PackType } from "./enums";

export interface DarePack {
  id: string;
  name: string;
  type: PackType;
  description?: string;
  icon?: string;
  dareIds: string[];    // references only — never embedded Dare objects
  createdAt?: string;   // custom packs only
}
