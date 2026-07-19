/**
 * Typography tokens — single source of truth.
 *
 * Values match PROJECT_CONTEXT.md Section 5.3 exactly.
 * Only the six canonical variants are exported as primary tokens.
 */

export const typography = {
  /** Poppins 28 Bold — screen titles, hero text */
  display: {
    fontFamily: "Poppins",
    fontWeight: "700" as const,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },

  /** Poppins 20 SemiBold — section titles */
  title: {
    fontFamily: "Poppins",
    fontWeight: "600" as const,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
  },

  /** Poppins 18 SemiBold — subsection headings */
  heading: {
    fontFamily: "Poppins",
    fontWeight: "600" as const,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.1,
  },

  /** Inter 16 Medium — body text */
  body: {
    fontFamily: "Inter",
    fontWeight: "500" as const,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },

  /** Inter 16 SemiBold — button labels */
  button: {
    fontFamily: "Inter",
    fontWeight: "600" as const,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },

  /** Inter 13 Regular — captions, helper text */
  caption: {
    fontFamily: "Inter",
    fontWeight: "400" as const,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },

  /**
   * @deprecated Use `body` instead. Kept for backward compatibility with AppInput.
   * Maps to body values (Inter 16 Medium).
   */
  input: {
    fontFamily: "Inter",
    fontWeight: "500" as const,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },

  /**
   * @deprecated Use `title` instead.
   */
  titleHeading: {
    fontFamily: "Poppins",
    fontWeight: "600" as const,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.2,
  },

  /**
   * @deprecated Use `body` instead.
   */
  bodyMedium: {
    fontFamily: "Inter",
    fontWeight: "500" as const,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0,
  },

  /**
   * @deprecated Use `caption` instead.
   */
  label: {
    fontFamily: "Inter",
    fontWeight: "400" as const,
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0,
  },
} as const;

export type Typography = typeof typography;
