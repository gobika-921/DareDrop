import React, { forwardRef, memo } from "react";
import {
  StyleSheet,
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from "react-native";

import { colors, typography } from "@/theme";

export type AppTextVariant = keyof typeof typography;
export type AppTextColor = keyof typeof colors.text | string;

export interface AppTextProps extends TextProps {
  children?: React.ReactNode;
  variant?: AppTextVariant;
  color?: AppTextColor;
  align?: TextStyle["textAlign"];
  style?: StyleProp<TextStyle>;
}

const AppTextComponent = forwardRef<Text, AppTextProps>((props, ref) => {
  const {
    children,
    variant = "body",
    color = "primary",
    align = "left",
    style,
    allowFontScaling = true,
    ...rest
  } = props;

  const variantStyle = typography[variant];

  // Resolve color: check if it's a semantic key of colors.text, otherwise use it directly
  const colorValue = React.useMemo(() => {
    if (color && typeof color === "string" && color in colors.text) {
      return colors.text[color as keyof typeof colors.text];
    }
    return color || colors.text.primary;
  }, [color]);

  return (
    <Text
      ref={ref}
      accessibilityRole="text"
      accessible
      allowFontScaling={allowFontScaling}
      style={[
        styles.base,
        {
          color: colorValue,
          fontFamily: variantStyle.fontFamily,
          fontSize: variantStyle.fontSize,
          fontWeight: variantStyle.fontWeight as TextStyle["fontWeight"],
          letterSpacing: variantStyle.letterSpacing,
          lineHeight: variantStyle.lineHeight,
          textAlign: align,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </Text>
  );
});

AppTextComponent.displayName = "AppText";

export const AppText = memo(AppTextComponent);

const styles = StyleSheet.create({
  base: {
    includeFontPadding: false,
  },
});
