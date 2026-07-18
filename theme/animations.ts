const baseDurations = {
  fast: 80,
  normal: 200,
  slow: 250,
} as const;

export const animations = Object.freeze({
  /** Timing values for short feedback and transition-driven interactions. */
  durations: {
    fast: baseDurations.fast,
    normal: baseDurations.normal,
    slow: baseDurations.slow,
    buttonPress: 80,
    cardReveal: 180,
    screenTransition: 220,
    spin: 1000,
    confetti: 1200,
  },

  /** Scale tokens for pressed, resting, and focused surface states. */
  scale: {
    buttonPressed: 0.96,
    buttonDefault: 1,
    cardDefault: 1,
    cardFocused: 1.02,
  },

  /** Stagger timings for sequential element appearance. */
  stagger: {
    fast: 80,
    normal: 120,
  },

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
} as const);

export type AppAnimationDuration = keyof typeof animations.durations;
export type AppAnimationScale = keyof typeof animations.scale;
export type AppAnimationStagger = keyof typeof animations.stagger;
export type AppAnimationSpring = keyof typeof animations.spring;

