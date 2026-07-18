export const radius = {
  none: 0,
  small: 4,
  medium: 8,
  large: 12,
  xl: 16,
  card: 16,
  button: 12,
  bottomSheet: 16,
  pill: 999,
  circle: 999,
} as const;

export type AppRadius = keyof typeof radius;

