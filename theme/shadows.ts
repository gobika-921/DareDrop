import { colors } from "./colors";

export const shadows = Object.freeze({
  /** Flat backgrounds, chips, and simple containers. */
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },

  /** Very soft lift for buttons, input fields, player chips, and segmented controls. */
  small: {
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },

  /** Primary resting elevation for cards, dare cards, player cards, and floating controls. */
  medium: {
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  /** Highest elevation for bottom sheets, dialogs, floating modals, and overlay panels. */
  large: {
    shadowColor: colors.text.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
} as const);

export type AppShadow = keyof typeof shadows;

