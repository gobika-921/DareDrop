export const sizes = {
  icon: 24,
  avatar: 40,
  buttonHeight: 48,
  inputHeight: 44,
  bottomSheetHandle: 6,
  switch: 54,
  chipHeight: 32,
  cardWidth: 320,
  roundIndicator: 10,
} as const;

export type AppSize = keyof typeof sizes;

