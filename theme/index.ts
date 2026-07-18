import { animations } from "./animations";
import { colors } from "./colors";
import { fonts } from "./fonts";
import { opacity } from "./opacity";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { sizes } from "./sizes";
import { spacing } from "./spacing";
import { typography } from "./typography";
import { zIndex } from "./zIndex";

export { animations } from "./animations";
export type { AppAnimationDuration, AppAnimationScale, AppAnimationSpring, AppAnimationStagger } from "./animations";

export { colors } from "./colors";
export type { Colors } from "./colors";

export { fonts } from "./fonts";
export type { AppFont } from "./fonts";

export { opacity } from "./opacity";
export type { AppOpacity } from "./opacity";

export { radius } from "./radius";
export type { AppRadius } from "./radius";

export { shadows } from "./shadows";
export type { AppShadow } from "./shadows";

export { sizes } from "./sizes";
export type { AppSize } from "./sizes";

export { spacing } from "./spacing";
export type { AppSpacing } from "./spacing";

export { typography } from "./typography";
export type { Typography } from "./typography";

export { zIndex } from "./zIndex";
export type { AppZIndex } from "./zIndex";

export const theme = {
  animations,
  colors,
  fonts,
  opacity,
  radius,
  shadows,
  sizes,
  spacing,
  typography,
  zIndex,
} as const;

export type AppTheme = typeof theme;

