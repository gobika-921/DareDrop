const baseRadius = {
  /** Small rounded corners for compact controls such as inputs and chips. */
  small: 8,

  /** Medium rounded corners for list items, cards, and secondary buttons. */
  medium: 12,

  /** Large rounded corners for primary buttons, dialogs, and bottom sheets. */
  large: 16,

  /** Extra-large radius for feature cards and prominent surface containers. */
  card: 24,

  /** Fully rounded radius for pills, tags, and compact status badges. */
  pill: 999,

  /** Fully rounded radius for avatars, FABs, and circular controls. */
  circle: 9999,
} as const;

export const radius = Object.freeze({
  ...baseRadius,

  /** Flat corners used for elements that should not be rounded. */
  none: 0,

  /** Legacy alias for compact buttons; intentionally matches small. */
  button: baseRadius.small,

  /** Legacy alias for sheet-like surfaces; intentionally matches large. */
  bottomSheet: baseRadius.large,

  /** Legacy alias for large surfaces; intentionally matches large. */
  xl: baseRadius.large,
} as const);

export type AppRadius = keyof typeof radius;

