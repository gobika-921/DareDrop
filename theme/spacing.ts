const baseSpacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  "2xl": 40,
  "3xl": 48,
} as const;

export const spacing = Object.freeze({
  ...baseSpacing,

  /** Horizontal inset used for primary screen content. */
  screenHorizontal: baseSpacing.lg,

  /** Vertical inset used for primary screen content. */
  screenVertical: baseSpacing.lg,

  /** Padding applied to cards and similar surfaces. */
  cardPadding: baseSpacing.lg,

  /** Horizontal padding for standard buttons. */
  buttonPaddingHorizontal: baseSpacing.md,

  /** Vertical padding for standard buttons. */
  buttonPaddingVertical: baseSpacing.sm,

  /** Gap between items in a compact list. */
  listItemGap: baseSpacing.sm,

  /** Gap between sections in a layout. */
  sectionGap: baseSpacing.lg,
} as const);

export type AppSpacing = keyof typeof spacing;

