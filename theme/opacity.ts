export const opacity = {
  disabled: 0.5,
  pressed: 0.85,
  overlay: 0.32,
  muted: 0.7,
  invisible: 0,
  visible: 1,
} as const;

export type AppOpacity = keyof typeof opacity;

