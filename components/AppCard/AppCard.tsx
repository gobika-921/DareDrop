import React, { forwardRef, memo, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewProps,
  type ViewStyle,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import {
  animations,
  colors,
  radius,
  shadows,
  spacing,
} from "@/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type AppCardVariant = "default" | "elevated" | "outlined" | "filled" | "interactive";
export type AppCardPadding = "none" | "small" | "medium" | "large" | "xl" | "xxl";
export type AppCardElevation = "none" | "resting" | "elevated";

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
    padding = "xxl",
    elevation = "resting",
    style,
    onPress,
    disabled = false,
    accessibilityRole,
    accessibilityLabel,
    accessible = true,
    testID,
    ...rest
  } = props;

  const scale = useSharedValue(1);

  const paddingValue = useMemo(() => {
    switch (padding) {
      case "none":
        return 0;
      case "small":
        return spacing.sm; // 8px
      case "medium":
        return spacing.md; // 12px
      case "large":
        return spacing.lg; // 16px
      case "xl":
        return spacing.xl; // 20px
      case "xxl":
      default:
        return spacing.xxl; // 24px (canonical card padding)
    }
  }, [padding]);

  const shadowValue = useMemo(() => {
    switch (elevation) {
      case "none":
        return shadows.none;
      case "elevated":
        return shadows.elevated;
      case "resting":
      default:
        return shadows.resting;
    }
  }, [elevation]);

  const resolvedVariantStyle = useMemo(() => {
    switch (variant) {
      case "elevated":
        return {
          backgroundColor: colors.surface.default,
          borderColor: colors.transparent,
          borderWidth: 0,
          shadow: shadows.elevated,
        };
      case "outlined":
        return {
          backgroundColor: colors.surface.default,
          borderColor: colors.border.default,
          borderWidth: 1,
          shadow: shadows.none,
        };
      case "filled":
        return {
          backgroundColor: colors.surface.elevated,
          borderColor: colors.transparent,
          borderWidth: 0,
          shadow: shadows.none,
        };
      case "interactive":
        return {
          backgroundColor: colors.surface.default,
          borderColor: colors.transparent,
          borderWidth: 0,
          shadow: shadowValue,
        };
      case "default":
      default:
        return {
          backgroundColor: colors.surface.default,
          borderColor: colors.transparent,
          borderWidth: 0,
          shadow: shadowValue,
        };
    }
  }, [variant, shadowValue]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const baseStyle = useMemo<StyleProp<ViewStyle>>(() => {
    const isElevatedVariant = variant === "elevated";
    const resolvedShadow = isElevatedVariant ? shadows.elevated : resolvedVariantStyle.shadow;

    return [
      styles.card,
      {
        backgroundColor: resolvedVariantStyle.backgroundColor,
        borderColor: resolvedVariantStyle.borderColor,
        borderRadius: radius.lg, // Use canonical radius.lg (24px)
        borderWidth: resolvedVariantStyle.borderWidth,
        padding: paddingValue,
        shadowColor: resolvedShadow.shadowColor,
        shadowOffset: resolvedShadow.shadowOffset,
        shadowOpacity: resolvedShadow.shadowOpacity,
        shadowRadius: resolvedShadow.shadowRadius,
        elevation: resolvedShadow.elevation,
      },
      disabled ? styles.disabled : null,
      style,
    ];
  }, [disabled, paddingValue, resolvedVariantStyle, variant, style]);

  const handlePressIn = () => {
    if (!disabled && variant === "interactive") {
      scale.value = withTiming(animations.pressScale, {
        duration: animations.duration.pressScale,
      });
    }
  };

  const handlePressOut = () => {
    if (!disabled && variant === "interactive") {
      scale.value = withTiming(1, {
        duration: animations.duration.pressScale,
      });
    }
  };

  const isPressable = onPress && !disabled;

  if (isPressable || variant === "interactive") {
    return (
      <AnimatedPressable
        ref={ref as React.ForwardedRef<React.ElementRef<typeof Pressable>>}
        accessibilityRole={accessibilityRole ?? "button"}
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        accessible={accessible}
        disabled={disabled}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[baseStyle, animatedStyle]}
        testID={testID}
        {...rest}
      >
        {children}
      </AnimatedPressable>
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
  disabled: {
    opacity: 0.6,
  },
});
