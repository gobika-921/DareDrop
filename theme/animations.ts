/**
 * Motion / animation tokens — single source of truth.
 *
 * Canonical tokens per PROJECT_CONTEXT.md Section 5.7.
 * Only exported motion constants — no animation implementations.
 */

export const animations = Object.freeze({
  /** Timing durations in milliseconds. */
  duration: {
    /** 200ms — screen transitions, fades (spec: 200–250ms). */
    standard: 200,
    /** 80ms — button press feedback. */
    pressScale: 80,
  },

  /** Easing curves. */
  easing: {
    /** Default for all transitions. */
    standard: "ease-out" as const,
  },

  /** 0.96 — button press target scale. */
  pressScale: 0.96,

  // ── Practical extensions (spring configs for Reanimated worklets) ──

  /** Reusable spring configuration values for motion systems. */
  spring: {
    gentle: {
      damping: 18,
      stiffness: 180,
      mass: 1,
    },
    default: {
      damping: 16,
      stiffness: 220,
      mass: 1,
    },
    snappy: {
      damping: 14,
      stiffness: 260,
      mass: 1,
    },
  },

  // ── Deprecated aliases (kept for component compatibility) ──

  /**
   * @deprecated Use `animations.pressScale` directly instead of `animations.scale.buttonPressed`.
   */
  scale: {
    buttonPressed: 0.96,
    buttonDefault: 1,
  },
} as const);

export type Animations = typeof animations;
