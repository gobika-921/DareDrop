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

export const theme = {
  colors,
  fonts,
  radius,
  spacing,
  typography,
  shadows,
  animations,
  sizes,
  opacity,
  zIndex,
} as const;

export type AppTheme = typeof theme;

