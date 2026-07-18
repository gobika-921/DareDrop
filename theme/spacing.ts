export const spacing = {
  xs: 0,
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  '2xl': 16,
  '3xl': 20,
  '4xl': 24,
  '5xl': 32,
  '6xl': 40,
  '7xl': 48,
  '8xl': 56,
  '9xl': 64,
  '10xl': 80,
  '11xl': 96,
} as const;

export type AppSpacing = keyof typeof spacing;

