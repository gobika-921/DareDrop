export const typography = {
  // Display
  displayLargeTitle: {
    fontFamily: "Poppins",
    fontWeight: "600" as const,
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.5,
  },

  // Title
  titleHeading: {
    fontFamily: "Poppins",
    fontWeight: "600" as const,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },

  // Heading
  heading: {
    fontFamily: "Poppins",
    fontWeight: "600" as const,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: -0.2,
  },

  // Subheading
  subheading: {
    fontFamily: "Poppins",
    fontWeight: "500" as const,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: -0.1,
  },

  // Body
  body: {
    fontFamily: "Inter",
    fontWeight: "400" as const,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Body Medium
  bodyMedium: {
    fontFamily: "Inter",
    fontWeight: "500" as const,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },

  // Caption
  caption: {
    fontFamily: "Inter",
    fontWeight: "400" as const,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },

  // Label
  label: {
    fontFamily: "Inter",
    fontWeight: "500" as const,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
  },

  // Button
  button: {
    fontFamily: "Inter",
    fontWeight: "600" as const,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: 0,
  },

  // Input
  input: {
    fontFamily: "Inter",
    fontWeight: "400" as const,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
  },
} as const;

export type Typography = typeof typography;




