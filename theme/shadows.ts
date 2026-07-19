/**
 * Shadow / elevation tokens — single source of truth.
 *
 * Exactly two canonical tiers per PROJECT_CONTEXT.md Section 5.6.
 * Shadow color uses the primary text color (#241F1C) for warm tonal consistency.
 */

const SHADOW_COLOR = "#241F1C" as const;

const _none = {
  shadowColor: "transparent" as const,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0,
  shadowRadius: 0,
  elevation: 0,
} as const;

/** Cards, chips — subtle resting elevation. */
const _resting = {
  shadowColor: SHADOW_COLOR,
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.06,
  shadowRadius: 4,
  elevation: 2,
} as const;

/** Bottom sheets, dialogs, Start button — prominent elevation. */
const _elevated = {
  shadowColor: SHADOW_COLOR,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.12,
  shadowRadius: 12,
  elevation: 8,
} as const;

export const shadows = Object.freeze({
  /** No elevation — flat backgrounds, inline elements. */
  none: _none,

  /** Cards, chips — subtle resting elevation. */
  resting: _resting,

  /** Bottom sheets, dialogs, Start button — prominent elevation. */
  elevated: _elevated,

  // ── Deprecated aliases (kept for component compatibility) ──

  /** @deprecated Use `resting` instead. */
  small: _resting,

  /** @deprecated Use `elevated` instead. */
  medium: _elevated,

  /** @deprecated Use `elevated` instead. Three-tier system is no longer canonical. */
  large: _elevated,
} as const);

export type AppShadow = keyof typeof shadows;
