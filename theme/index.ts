/**
 * Theme barrel — single public API for all design tokens.
 *
 * Canonical structure per PROJECT_CONTEXT.md Section 5.1.
 * Components must import from "@/theme", never from individual token files.
 */

import { animations } from "./animations";
import { colors } from "./colors";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { spacing } from "./spacing";
import { typography } from "./typography";

// ── Canonical token re-exports ──

export { animations } from "./animations";
export type { Animations } from "./animations";

export { colors } from "./colors";
export type { Colors } from "./colors";

export { radius } from "./radius";
export type { AppRadius } from "./radius";

export { shadows } from "./shadows";
export type { AppShadow } from "./shadows";

export { spacing } from "./spacing";
export type { AppSpacing } from "./spacing";

export { typography } from "./typography";
export type { Typography } from "./typography";

// ── Non-canonical utility re-exports (not part of the theme object) ──

export { fonts, fontAssets } from "./fonts";
export type { AppFont } from "./fonts";

export { opacity } from "./opacity";
export type { AppOpacity } from "./opacity";

export { sizes } from "./sizes";
export type { AppSize } from "./sizes";

export { zIndex } from "./zIndex";
export type { AppZIndex } from "./zIndex";

// ── Canonical theme object ──

export const theme = {
  colors,
  typography,
  spacing,
  radius,
  shadows,
  animations,
} as const;

export type AppTheme = typeof theme;
