export const zIndex = {
  base: 0,
  card: 10,
  dropdown: 20,
  bottomSheet: 30,
  modal: 40,
  toast: 50,
  loading: 60,
  tooltip: 70,
} as const;

export type AppZIndex = keyof typeof zIndex;

