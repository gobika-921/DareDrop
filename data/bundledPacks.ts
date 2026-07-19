import { DarePack } from "../types";

import { EXTREME_DARES, MILD_DARES, SPICY_DARES } from "./bundledDares";

/**
 * Bundled dare packs — static, immutable, never persisted.
 * IDs are stable so that GameConfiguration.selectedPackIds references remain valid.
 */

export const MILD_PACK: DarePack = {
  id: "pack-mild",
  name: "Mild",
  type: "BuiltIn",
  description: "Funny, awkward, and lighthearted dares safe for most groups.",
  dareIds: MILD_DARES.map((d) => d.id),
};

export const SPICY_PACK: DarePack = {
  id: "pack-spicy",
  name: "Spicy",
  type: "BuiltIn",
  description: "Embarrassing, cringe-worthy, and performance-based challenges.",
  dareIds: SPICY_DARES.map((d) => d.id),
};

export const EXTREME_PACK: DarePack = {
  id: "pack-extreme",
  name: "Extreme",
  type: "BuiltIn",
  description: "High commitment, maximum cringe, and peak group entertainment.",
  dareIds: EXTREME_DARES.map((d) => d.id),
};

/** All bundled packs. */
export const BUNDLED_PACKS: readonly DarePack[] = [
  MILD_PACK,
  SPICY_PACK,
  EXTREME_PACK,
];
