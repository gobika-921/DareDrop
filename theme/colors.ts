// NOTE: This file contains *only* semantic design tokens.
// Components must import colors from "@/theme/colors" and never hardcode color values.

const ACCENT_PRIMARY = "#E8825C" as const;
const TEXT_PRIMARY = "#241F1C" as const;
const TEXT_SECONDARY = "#8A7F76" as const;

/**
 * Semantic color system (single source of truth).
 *
 * Intended to be the only file that changes for future theming.
 */
export const colors = Object.freeze({
  /**
   * Background colors used behind most screen content.
   */
  background: "#FAF8F5",

  /**
   * Surface colors used for cards, sheets, and UI blocks.
   */
  surface: {
    /** Standard surface */
    default: "#FFFFFF",
    /** Raised surface for layering */
    elevated: "#F1ECE6",
  },

  /**
   * Brand/primary colors (typically used for primary UI states).
   */
  primary: {
    /** Default primary ink/text color */
    DEFAULT: "#3A332F",
    /** Primary container/emphasis background */
    container: "#EFE2D6",
  },

  /**
   * Accent colors for highlights, CTAs, and emphasized actions.
   */
  accent: {
    /** Primary accent (CTA/highlight) */
    primary: ACCENT_PRIMARY,
  },

  /**
   * Text colors.
   */
  text: {
    /** Primary text */
    primary: TEXT_PRIMARY,
    /** Secondary text (helper/captions/secondary labels) */
    secondary: TEXT_SECONDARY,
    /** Text displayed over dark/colored surfaces */
    inverse: "#FFFFFF",
  },

  /**
   * Status colors communicate outcomes and system messages.
   */
  status: {
    /** Success confirmations */
    success: "#4C9A5C",
    /** Warning/high-attention confirmations (uses accent primary) */
    warning: ACCENT_PRIMARY,
    /** Error/critical confirmations */
    danger: "#E05353",
  },

  /**
   * Difficulty colors represent domain intensity levels.
   */
  difficulty: {
    /** Mild difficulty */
    mild: "#7FB37A",
    /** Spicy difficulty (uses accent primary) */
    spicy: ACCENT_PRIMARY,
    /** Extreme difficulty */
    extreme: "#D65B5B",
  },

  /**
   * Border colors.
   *
   * Extend this group in future phases (e.g., focus, selected, danger).
   */
  border: {
    /** Default border */
    default: "rgba(0,0,0,0.08)",
    /** Focus ring/border (placeholder value, keeps semantics future-proof) */
    focus: "rgba(0,0,0,0.08)",
  },

  /**
   * Divider colors (lines between sections).
   */
  divider: {
    /** Default divider */
    default: "rgba(0,0,0,0.05)",
  },

  /**
   * Overlay colors for scrims.
   *
   * Extend this group in future phases (e.g., scrim/backdrop variants).
   */
  overlay: {
    /** Background scrim */
    scrim: "rgba(0,0,0,0.32)",
    /** Backdrop overlay */
    backdrop: "rgba(0,0,0,0.32)",
  },

  /**
   * Disabled state colors.
   */
  disabled: {
    /** Disabled UI elements */
    default: "#D8D2CC",
  },

  /** Explicit transparent token for UI consistency. */
  transparent: "transparent",
} as const);

export type Colors = typeof colors;

