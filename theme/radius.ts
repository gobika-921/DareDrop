/**
 * Radius tokens — single source of truth.
 *
 * Values match PROJECT_CONTEXT.md Section 5.5 exactly.
 */

export const radius = Object.freeze({
  /** 12px — small inline elements */
  sm: 12,

  /** 18px — buttons, inputs */
  md: 18,

  /** 24px — cards */
  lg: 24,

  /** 28px — dialogs, bottom sheets */
  xl: 28,

  /** 999px — chips, difficulty badges, pill buttons */
  pill: 999,

  // ── Practical extensions (not in canonical spec but required by components) ──

  /** 0px — flat corners for elements that should not be rounded */
  none: 0,

  /** 9999px — avatars, FABs, and circular controls */
  circle: 9999,

  // ── Deprecated aliases (kept for component compatibility) ──

  /**
   * @deprecated Use `sm` instead.
   */
  small: 12,

  /**
   * @deprecated Use `md` instead.
   */
  medium: 18,

  /**
   * @deprecated Use `lg` instead.
   */
  large: 24,

  /**
   * @deprecated Use `lg` instead. Legacy alias for feature cards.
   */
  card: 24,

  /**
   * @deprecated Use `xl` instead. Legacy alias for sheet-like surfaces.
   */
  bottomSheet: 28,

  /**
   * @deprecated Use `md` instead. Legacy alias for compact buttons.
   */
  button: 18,
} as const);

export type AppRadius = keyof typeof radius;
