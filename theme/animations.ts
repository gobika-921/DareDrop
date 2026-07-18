export const animations = {
  duration: {
    fast: 120,
    normal: 220,
    slow: 350,
    extraSlow: 500,
  },

  timing: {
    buttonPressScale: 0.96,
    cardLiftScale: 1.02,
    modalScale: 0.95,
  },

  // Durations (ms). Kept as tokens so later UI/interaction code uses shared values.
  // Named as per spec.
  spinDuration: 220,
  revealDuration: 350,
  confettiDuration: 500,
} as const;

export type AppAnimationDuration = keyof typeof animations.duration;

