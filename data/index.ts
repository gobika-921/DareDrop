import { Dare, DarePack } from "../types";

import { BUNDLED_DARES } from "./bundledDares";
import { BUNDLED_PACKS } from "./bundledPacks";

export { BUNDLED_DARES, MILD_DARES, SPICY_DARES, EXTREME_DARES } from "./bundledDares";
export { BUNDLED_PACKS, MILD_PACK, SPICY_PACK, EXTREME_PACK } from "./bundledPacks";

/**
 * Merges bundled dares with user-created custom dares.
 * Bundled dares always come first. Custom dares are appended.
 */
export function getAllDares(customDares: Dare[]): Dare[] {
  return [...BUNDLED_DARES, ...customDares];
}

/**
 * Merges bundled packs with user-created custom packs.
 * Bundled packs always come first. Custom packs are appended.
 */
export function getAllPacks(customPacks: DarePack[]): DarePack[] {
  return [...BUNDLED_PACKS, ...customPacks];
}
