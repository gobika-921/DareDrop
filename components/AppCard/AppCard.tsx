import React, { forwardRef, memo, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
  View,
} from "react-native";

import {
  animations,
  colors,
  radius,
  shadows,
  spacing,
} from "@/theme";

export type AppCardVariant = "default" | "elevated" | "outlined" | "filled" | "interactive";
export type AppCardPadding = "none" | "small" | "medium" | "large";
export type AppCardElevation = "none" | "small" | "medium" | "large";

export interface AppCardProps extends Omit<ViewProps, "children"> {
  children?: React.ReactNode;
  variant?: AppCardVariant;
  padding?: AppCardPadding;
  elevation?: AppCardElevation;
  style?: StyleProp<ViewStyle>;
  onPress?: PressableProps["onPress"];
  disabled?: boolean;
}

const AppCardComponent = forwardRef<React.ElementRef<typeof View>, AppCardProps>((props, ref) => {
  const {
    children,
    variant = "default",
    padding = "medium",
    elevation = "medium",
    style,
    onPress,
    disabled = false,
    accessibilityRole,
    accessibilityLabel,
    accessible = true,
    testID,
    ...rest
  } = props;

  const [pressed, setPressed] = useState(false);

  const paddingValue = useMemo(() => {
    switch (padding) {
      case "none":
        return 0;
      case "small":
        return spacing.sm;
      case "large":
        return spacing.xl;
      case "medium":
      default:
        return spacing.lg;
    }
  }, [padding]);

  const shadowValue = useMemo(() => {
    switch (elevation) {
      case "none":
        return shadows.none;
      case "small":
        return shadows.small;
      case "large":
        return shadows.large;
      case "medium":
      default:
        return shadows.medium;
    }
  }, [elevation]);

  const resolvedVariantStyle = useMemo(() => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: colors.surface.default,
          borderColor: colors.transparent,
          borderWidth: 0,
        };
      case "outlined":
        return {
          backgroundColor: colors.surface.default,
          borderColor: colors.border.default,
          borderWidth: 1,
        };
      case "filled":
        return {
          backgroundColor: colors.surface.elevated,
          borderColor: colors.transparent,
          borderWidth: 0,
        };
      case "interactive":
        return {
          backgroundColor: colors.surface.default,
          borderColor: colors.transparent,
          borderWidth: 0,
        };
      case "default":
      default:
        return {
          backgroundColor: colors.surface.default,
          borderColor: colors.transparent,
          borderWidth: 0,
        };
    }
  }, [variant]);

  const baseStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return [
      styles.card,
      {
        backgroundColor: resolvedVariantStyle.backgroundColor,
        borderColor: resolvedVariantStyle.borderColor,
        borderRadius: radius.large,
        borderWidth: resolvedVariantStyle.borderWidth,
        padding: paddingValue,
        shadowColor: shadowValue.shadowColor,
        shadowOffset: shadowValue.shadowOffset,
        shadowOpacity: shadowValue.shadowOpacity,
        shadowRadius: shadowValue.shadowRadius,
        elevation: shadowValue.elevation,
      },
      pressed && onPress && !disabled ? styles.pressed : null,
      style,
    ];
  }, [disabled, onPress, paddingValue, pressed, resolvedVariantStyle.backgroundColor, resolvedVariantStyle.borderColor, resolvedVariantStyle.borderWidth, shadowValue, style]);

  if (onPress) {
    return (
      <Pressable
        ref={ref as React.ForwardedRef<React.ElementRef<typeof Pressable>>}
        accessibilityRole={accessibilityRole ?? "button"}
        accessibilityLabel={accessibilityLabel}
        accessible={accessible}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={baseStyle}
        testID={testID}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View
      ref={ref as React.ForwardedRef<React.ElementRef<typeof View>>}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessible={accessible}
      style={baseStyle}
      testID={testID}
      {...rest}
    >
      {children}
    </View>
  );
});

AppCardComponent.displayName = "AppCard";

export const AppCard = memo(AppCardComponent);

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
  },
  pressed: {
    transform: [{ scale: animations.scale.buttonPressed }],
    opacity: 0.95,
  },
});
