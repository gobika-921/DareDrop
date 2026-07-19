/**
 * Spacing tokens — single source of truth.
 *
 * 4px-based scale matching PROJECT_CONTEXT.md Section 5.4 exactly.
 * Every margin, padding, and gap in the app must resolve to one of these tokens.
 */

const baseSpacing = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 20px */
  xl: 20,
  /** 24px */
  xxl: 24,
  /** 32px */
  xxxl: 32,
  /** 48px */
  huge: 48,
} as const;

export const spacing = Object.freeze({
  ...baseSpacing,

  /** Horizontal inset for screen content — 24px (UI Spec Section 3.5). */
  screenHorizontal: baseSpacing.xxl,

  /** Vertical inset below safe area — 16px (UI Spec Section 3.5). */
  screenVertical: baseSpacing.lg,

  /** Padding applied to cards and similar surfaces — 24px. */
  cardPadding: baseSpacing.xxl,

  /** Horizontal padding for standard buttons — 16px. */
  buttonPaddingHorizontal: baseSpacing.lg,

  /** Vertical padding for standard buttons — 8px. */
  buttonPaddingVertical: baseSpacing.sm,

  /** Gap between items in a compact list — 8px. */
  listItemGap: baseSpacing.sm,

  /** Gap between major sections — 24px (UI Spec Section 3.5). */
  sectionGap: baseSpacing.xxl,

  /**
   * @deprecated Use `huge` (48px) instead.
   */
  "3xl": baseSpacing.huge,
} as const);

export type AppSpacing = keyof typeof spacing;
