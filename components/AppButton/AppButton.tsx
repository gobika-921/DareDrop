import React, { forwardRef, memo, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import {
  animations,
  colors,
  radius,
  shadows,
  spacing,
} from "@/theme";

import { AppText } from "../AppText";

export type AppButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type AppButtonSize = "small" | "medium" | "large";

export interface AppButtonProps extends Omit<PressableProps, "children"> {
  children?: React.ReactNode;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

const AppButtonComponent = forwardRef<React.ElementRef<typeof Pressable>, AppButtonProps>(
  (props, ref) => {
    const {
      children,
      variant = "primary",
      size = "medium",
      loading = false,
      disabled = false,
      leftIcon,
      rightIcon,
      style,
      onPressIn,
      onPressOut,
      accessibilityRole = "button",
      accessibilityLabel,
      accessibilityHint,
      testID,
      ...rest
    } = props;

    const [pressed, setPressed] = useState(false);

    const sizeConfig = useMemo(() => {
      switch (size) {
        case "small":
          return {
            height: 36,
            paddingHorizontal: spacing.md,
            fontVariant: "button" as const,
          };
        case "large":
          return {
            height: 52,
            paddingHorizontal: spacing.xl,
            fontVariant: "button" as const,
          };
        case "medium":
        default:
          return {
            height: 44,
            paddingHorizontal: spacing.lg,
            fontVariant: "button" as const,
          };
      }
    }, [size]);

    const variantStyles = useMemo(() => {
      const isDisabled = disabled || loading;

      switch (variant) {
        case "secondary":
          return {
            backgroundColor: isDisabled ? colors.disabled.default : colors.surface.default,
            borderColor: isDisabled ? colors.border.default : colors.border.default,
            borderWidth: 1,
            textColor: isDisabled ? colors.text.secondary : colors.text.primary,
            iconColor: isDisabled ? colors.text.secondary : colors.text.primary,
            shadow: shadows.none,
          };
        case "outline":
          return {
            backgroundColor: isDisabled ? colors.transparent : colors.transparent,
            borderColor: isDisabled ? colors.disabled.default : colors.primary.DEFAULT,
            borderWidth: 1,
            textColor: isDisabled ? colors.text.secondary : colors.primary.DEFAULT,
            iconColor: isDisabled ? colors.text.secondary : colors.primary.DEFAULT,
            shadow: shadows.none,
          };
        case "ghost":
          return {
            backgroundColor: isDisabled ? colors.transparent : colors.transparent,
            borderColor: colors.transparent,
            borderWidth: 0,
            textColor: isDisabled ? colors.text.secondary : colors.primary.DEFAULT,
            iconColor: isDisabled ? colors.text.secondary : colors.primary.DEFAULT,
            shadow: shadows.none,
          };
        case "danger":
          return {
            backgroundColor: isDisabled ? colors.disabled.default : colors.status.danger,
            borderColor: colors.transparent,
            borderWidth: 0,
            textColor: colors.text.inverse,
            iconColor: colors.text.inverse,
            shadow: shadows.small,
          };
        case "primary":
        default:
          return {
            backgroundColor: isDisabled ? colors.disabled.default : colors.primary.DEFAULT,
            borderColor: colors.transparent,
            borderWidth: 0,
            textColor: colors.text.inverse,
            iconColor: colors.text.inverse,
            shadow: shadows.small,
          };
      }
    }, [disabled, loading, variant]);

    const resolvedStyle = useMemo(() => {
      const baseStyle: ViewStyle = {
        alignItems: "center",
        backgroundColor: variantStyles.backgroundColor,
        borderColor: variantStyles.borderColor,
        borderRadius: radius.large,
        borderWidth: variantStyles.borderWidth,
        flexDirection: "row",
        height: sizeConfig.height,
        justifyContent: "center",
        minHeight: sizeConfig.height,
        opacity: disabled || loading ? 0.8 : 1,
        paddingHorizontal: sizeConfig.paddingHorizontal,
        shadowColor: variantStyles.shadow.shadowColor,
        shadowOffset: variantStyles.shadow.shadowOffset,
        shadowOpacity: variantStyles.shadow.shadowOpacity,
        shadowRadius: variantStyles.shadow.shadowRadius,
        elevation: variantStyles.shadow.elevation,
      };

      return [baseStyle, pressed && !disabled && !loading ? styles.pressed : null, style];
    }, [disabled, loading, pressed, sizeConfig.height, sizeConfig.paddingHorizontal, style, variantStyles]);

    return (
      <Pressable
        ref={ref}
        accessibilityRole={accessibilityRole}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessible
        disabled={disabled || loading}
        hitSlop={8}
        onPressIn={(event) => {
          setPressed(true);
          onPressIn?.(event);
        }}
        onPressOut={(event) => {
          setPressed(false);
          onPressOut?.(event);
        }}
        style={resolvedStyle}
        testID={testID}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator
            color={variantStyles.iconColor}
            size="small"
          />
        ) : (
          <>
            {leftIcon ? <>{leftIcon}</> : null}
            {children ? (
              <AppText
                variant={sizeConfig.fontVariant}
                color={variantStyles.textColor as keyof typeof colors.text}
                style={leftIcon || rightIcon ? styles.labelWithIcon : styles.label}
              >
                {children}
              </AppText>
            ) : null}
            {rightIcon ? <>{rightIcon}</> : null}
          </>
        )}
      </Pressable>
    );
  },
);

AppButtonComponent.displayName = "AppButton";

export const AppButton = memo(AppButtonComponent);

const styles = StyleSheet.create({
  label: {
    marginHorizontal: 0,
  },
  labelWithIcon: {
    marginHorizontal: spacing.sm,
  },
  pressed: {
    transform: [{ scale: animations.scale.buttonPressed }],
  },
});
