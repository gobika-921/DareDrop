import React, { forwardRef, memo, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import {
  animations,
  colors,
  radius,
  shadows,
  spacing,
} from "@/theme";

import { AppText } from "../AppText";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type AppButtonVariant = "primary" | "accent" | "secondary" | "tertiary" | "danger";
export type AppButtonSize = "small" | "medium" | "large";

export interface AppButtonProps extends Omit<PressableProps, "children" | "style"> {
  children?: React.ReactNode;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  pulse?: boolean;
  circular?: boolean;
  floating?: boolean;
  style?: StyleProp<ViewStyle>;
}

const AppButtonComponent = forwardRef<React.ElementRef<typeof Pressable>, AppButtonProps>(
  (props, ref) => {
    const {
      children,
      variant = "primary",
      size,
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      pulse = false,
      circular = false,
      floating = false,
      style,
      onPressIn,
      onPressOut,
      accessibilityRole = "button",
      accessibilityLabel,
      accessibilityHint,
      testID,
      ...rest
    } = props;

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const isDisabled = disabled || loading;

    // Breathing pulse animation for hero buttons (Start Game / Spin)
    React.useEffect(() => {
      if (pulse && !isDisabled) {
        opacity.value = withRepeat(
          withSequence(
            withTiming(0.85, { duration: 800 }),
            withTiming(1.0, { duration: 800 })
          ),
          -1,
          true
        );
      } else {
        opacity.value = 1;
      }
    }, [pulse, isDisabled, opacity]);

    // Height calculations per spec guidelines (A.1 AppButton table)
    const specHeight = useMemo(() => {
      if (size === "small") return 36;
      if (size === "medium") return 48;
      if (size === "large") return 56;

      switch (variant) {
        case "primary":
        case "accent":
        case "danger":
          return 56;
        case "secondary":
          return 48;
        case "tertiary":
          return 44;
        default:
          return 56;
      }
    }, [variant, size]);

    // Styles for variants
    const variantStyles = useMemo(() => {
      switch (variant) {
        case "accent":
          return {
            backgroundColor: isDisabled ? colors.disabled.accent : colors.accent.primary,
            borderColor: colors.transparent,
            borderWidth: 0,
            textColor: "inverse",
            iconColor: colors.text.inverse,
            shadow: floating || circular ? shadows.elevated : shadows.none,
          };
        case "secondary":
          return {
            backgroundColor: colors.transparent,
            borderColor: isDisabled
              ? `${colors.text.secondary}99` // 60% opacity of textSecondary in hex roughly
              : colors.primary.DEFAULT,
            borderWidth: 1.5,
            textColor: isDisabled ? "secondary" : "primary",
            iconColor: isDisabled
              ? colors.text.secondary
              : colors.primary.DEFAULT,
            shadow: shadows.none,
          };
        case "tertiary":
          return {
            backgroundColor: colors.transparent,
            borderColor: colors.transparent,
            borderWidth: 0,
            textColor: isDisabled ? "secondary" : "primary",
            iconColor: isDisabled ? colors.text.secondary : colors.primary.DEFAULT,
            shadow: shadows.none,
          };
        case "danger":
          return {
            backgroundColor: isDisabled ? colors.disabled.destructive : colors.status.danger,
            borderColor: colors.transparent,
            borderWidth: 0,
            textColor: "inverse",
            iconColor: colors.text.inverse,
            shadow: shadows.none,
          };
        case "primary":
        default:
          return {
            backgroundColor: isDisabled ? colors.disabled.primary : colors.primary.DEFAULT,
            borderColor: colors.transparent,
            borderWidth: 0,
            textColor: "inverse",
            iconColor: colors.text.inverse,
            shadow: shadows.none,
          };
      }
    }, [variant, isDisabled, floating, circular]);

    const animatedStyles = useAnimatedStyle(() => {
      return {
        opacity: opacity.value,
        transform: [{ scale: scale.value }],
      };
    });

    const containerStyle = useMemo<StyleProp<ViewStyle>>(() => {
      const isTertiary = variant === "tertiary";
      const heightVal = isTertiary ? undefined : specHeight;

      const baseStyle: ViewStyle = {
        alignItems: "center",
        backgroundColor: variantStyles.backgroundColor,
        borderColor: variantStyles.borderColor,
        borderRadius: circular ? 9999 : radius.md,
        borderWidth: variantStyles.borderWidth,
        flexDirection: "row",
        height: heightVal,
        justifyContent: "center",
        minHeight: isTertiary ? 44 : heightVal,
        paddingHorizontal: isTertiary ? spacing.sm : circular ? 0 : spacing.lg,
        width: circular ? specHeight : "100%",
        shadowColor: variantStyles.shadow.shadowColor,
        shadowOffset: variantStyles.shadow.shadowOffset,
        shadowOpacity: variantStyles.shadow.shadowOpacity,
        shadowRadius: variantStyles.shadow.shadowRadius,
        elevation: variantStyles.shadow.elevation,
      };

      return [baseStyle, style];
    }, [variant, specHeight, variantStyles, circular, style]);

    const handlePressIn: PressableProps["onPressIn"] = (event) => {
      if (!isDisabled) {
        scale.value = withTiming(animations.pressScale, {
          duration: animations.duration.pressScale,
        });
      }
      onPressIn?.(event);
    };

    const handlePressOut: PressableProps["onPressOut"] = (event) => {
      if (!isDisabled) {
        scale.value = withTiming(1, {
          duration: animations.duration.pressScale,
        });
      }
      onPressOut?.(event);
    };

    // Calculate hitSlop to ensure min touch target of 44x44
    const resolvedHitSlop = useMemo(() => {
      if (circular && specHeight < 44) {
        const diff = (44 - specHeight) / 2;
        return { top: diff, bottom: diff, left: diff, right: diff };
      }
      if (variant === "tertiary") {
        return { top: 8, bottom: 8, left: 8, right: 8 };
      }
      return 0;
    }, [circular, specHeight, variant]);

    return (
      <AnimatedPressable
        ref={ref}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled }}
        accessible
        disabled={isDisabled}
        hitSlop={resolvedHitSlop}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[containerStyle, animatedStyles]}
        testID={testID}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator
            color={variantStyles.iconColor}
            size="small"
            style={styles.spinner}
          />
        ) : (
          <>
            {leftIcon ? <React.Fragment>{leftIcon}</React.Fragment> : null}
            {children ? (
              <AppText
                variant="button"
                color={variantStyles.textColor}
                style={[
                  leftIcon || rightIcon ? styles.labelWithIcon : styles.label,
                  isDisabled && variant === "secondary" && { opacity: 0.6 },
                ]}
              >
                {children}
              </AppText>
            ) : null}
            {rightIcon ? <React.Fragment>{rightIcon}</React.Fragment> : null}
          </>
        )}
      </AnimatedPressable>
    );
  }
);

AppButtonComponent.displayName = "AppButton";

export const AppButton = memo(AppButtonComponent);

const styles = StyleSheet.create({
  label: {
    marginHorizontal: 0,
    textAlign: "center",
  },
  labelWithIcon: {
    marginHorizontal: spacing.sm,
    textAlign: "center",
  },
  spinner: {
    alignSelf: "center",
  },
});
