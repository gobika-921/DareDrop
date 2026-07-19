/**
 * Semantic color tokens — single source of truth.
 *
 * Every color in the application must reference this file.
 * Values match PROJECT_CONTEXT.md Section 5.2 exactly.
 *
 * Components must import from "@/theme", never from this file directly.
 */

const ACCENT_PRIMARY = "#E8825C" as const;
const TEXT_PRIMARY = "#241F1C" as const;
const TEXT_SECONDARY = "#8A7F76" as const;

export const colors = Object.freeze({
  /** Screen background — #FAF8F5 */
  background: "#FAF8F5",

  /**
   * Surface colors for cards, sheets, and UI blocks.
   */
  surface: {
    /** Cards, resting elements — #FFFFFF */
    default: "#FFFFFF",
    /** Sheets, modals — #F1ECE6 */
    elevated: "#F1ECE6",
  },

  /**
   * Primary brand colors.
   */
  primary: {
    /** Primary text, primary button fill — #3A332F */
    DEFAULT: "#3A332F",
    /** Selected chip/toggle fill — #EFE2D6 */
    container: "#EFE2D6",
  },

  /**
   * Accent color for CTAs and highlights.
   */
  accent: {
    /** Primary CTA, Spicy difficulty — #E8825C */
    primary: ACCENT_PRIMARY,
  },

  /**
   * Text colors.
   */
  text: {
    /** Body/heading text — #241F1C */
    primary: TEXT_PRIMARY,
    /** Captions, helper text, disabled text — #8A7F76 */
    secondary: TEXT_SECONDARY,
    /** Text displayed over dark/colored surfaces — #FFFFFF */
    inverse: "#FFFFFF",
  },

  /**
   * Status colors for outcomes and system messages.
   */
  status: {
    /** Completed states — #4C9A5C */
    success: "#4C9A5C",
    /** Destructive actions, Extreme difficulty — #E05353 */
    danger: "#E05353",
    /**
     * @deprecated Use colors.accent.primary instead.
     */
    warning: ACCENT_PRIMARY,
  },

  /**
   * Difficulty colors for game intensity levels.
   */
  difficulty: {
    /** Mild badges/dots — #7FB37A */
    mild: "#7FB37A",
    /** Spicy badges/dots (same as accent, intentional) — #E8825C */
    spicy: ACCENT_PRIMARY,
    /** Extreme badges/dots — #D65B5B */
    extreme: "#D65B5B",
  },

  /**
   * Border colors.
   */
  border: {
    /** Default border — rgba(0,0,0,0.08) */
    default: "rgba(0,0,0,0.08)",
  },

  /**
   * Divider colors (lines between sections).
   */
  divider: {
    /** Default divider — rgba(0,0,0,0.05) */
    default: "rgba(0,0,0,0.05)",
  },

  /**
   * Overlay colors for scrims.
   */
  overlay: {
    /** Background scrim — rgba(0,0,0,0.32) */
    scrim: "rgba(0,0,0,0.32)",
  },

  /**
   * Disabled state colors.
   */
  disabled: {
    /** Disabled UI elements — #D8D2CC */
    default: "#D8D2CC",
  },

  /** Explicit transparent token for UI consistency. */
  transparent: "transparent",
} as const);

export type Colors = typeof colors;
