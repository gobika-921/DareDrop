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

export interface AppTextProps extends TextProps {
  children?: React.ReactNode;
  variant?: AppTextVariant;
  color?: keyof typeof colors.text | string;
  align?: TextStyle["textAlign"];
  style?: StyleProp<TextStyle>;
}

const AppTextComponent = forwardRef<Text, AppTextProps>((props, ref) => {
  const {
    children,
    variant = "body",
    color,
    align = "left",
    style,
    ...rest
  } = props;

  const variantStyle = typography[variant];

  const resolvedColor = color
    ? color in colors.text
      ? colors.text[color as keyof typeof colors.text]
      : color
    : variant === "caption" || variant === "label"
      ? colors.text.secondary
      : colors.text.primary;

  return (
    <Text
      ref={ref}
      accessibilityRole="text"
      style={[
        styles.base,
        {
          color: resolvedColor,
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
