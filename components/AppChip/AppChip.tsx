import React, { forwardRef, memo, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  View,
} from "react-native";

import { AppText } from "@/components/AppText";
import { animations, colors, radius, shadows, spacing, typography } from "@/theme";

export type AppChipVariant = "filled" | "outlined" | "tonal" | "difficulty";
export type AppChipSize = "small" | "medium" | "large";
export type AppChipDifficulty = "mild" | "spicy" | "extreme";

export interface AppChipProps extends Omit<PressableProps, "children" | "style"> {
  label: string;
  variant?: AppChipVariant;
  size?: AppChipSize;
  selected?: boolean;
  disabled?: boolean;
  leadingIcon?: React.ReactNode;
  avatarColor?: string;
  removable?: boolean;
  onRemove?: () => void;
  difficulty?: AppChipDifficulty;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const AppChipComponent = forwardRef<React.ElementRef<typeof Pressable>, AppChipProps>((props, ref) => {
  const {
    label,
    variant = "outlined",
    size = "medium",
    selected = false,
    disabled = false,
    leadingIcon,
    avatarColor,
    removable = false,
    onRemove,
    difficulty = "spicy",
    style,
    onPress,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessible = true,
    accessibilityRole,
    accessibilityState,
    ...rest
  } = props;

  const [pressed, setPressed] = useState(false);

  const sizeConfig = useMemo(() => {
    switch (size) {
      case "small":
        return {
          height: 36,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.xs,
          textVariant: "caption" as const,
          iconSize: 14,
        };
      case "large":
        return {
          height: 44,
          paddingHorizontal: spacing.lg,
          paddingVertical: spacing.sm,
          textVariant: "bodyMedium" as const,
          iconSize: 16,
        };
      case "medium":
      default:
        return {
          height: 40,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs,
          textVariant: "body" as const,
          iconSize: 15,
        };
    }
  }, [size]);

  const resolvedVariantStyles = useMemo(() => {
    const baseBorder = colors.border.default;

    if (variant === "filled") {
      return {
        backgroundColor: selected ? colors.primary.container : colors.surface.elevated,
        borderColor: selected ? colors.accent.primary : baseBorder,
        textColor: colors.primary.DEFAULT,
        iconColor: colors.primary.DEFAULT,
        borderWidth: 1,
        shadow: selected ? shadows.small : shadows.none,
      };
    }

    if (variant === "tonal") {
      return {
        backgroundColor: colors.surface.elevated,
        borderColor: baseBorder,
        textColor: colors.text.primary,
        iconColor: colors.text.secondary,
        borderWidth: 1,
        shadow: shadows.none,
      };
    }

    if (variant === "difficulty") {
      const tintColor = {
        mild: colors.difficulty.mild,
        spicy: colors.difficulty.spicy,
        extreme: colors.difficulty.extreme,
      }[difficulty];

      return {
        backgroundColor: colors.surface.default,
        borderColor: tintColor,
        textColor: tintColor,
        iconColor: tintColor,
        borderWidth: 1,
        shadow: shadows.none,
      };
    }

    return {
      backgroundColor: colors.surface.default,
      borderColor: selected ? colors.accent.primary : baseBorder,
      textColor: selected ? colors.accent.primary : colors.text.primary,
      iconColor: selected ? colors.accent.primary : colors.text.secondary,
      borderWidth: 1,
      shadow: shadows.none,
    };
  }, [difficulty, selected, variant]);

  const chipStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return [
      styles.chip,
      {
        backgroundColor: resolvedVariantStyles.backgroundColor,
        borderColor: resolvedVariantStyles.borderColor,
        borderWidth: resolvedVariantStyles.borderWidth,
        borderRadius: radius.pill,
        minHeight: Math.max(sizeConfig.height, 44),
        paddingHorizontal: sizeConfig.paddingHorizontal,
        paddingVertical: sizeConfig.paddingVertical,
        shadowColor: resolvedVariantStyles.shadow.shadowColor,
        shadowOffset: resolvedVariantStyles.shadow.shadowOffset,
        shadowOpacity: resolvedVariantStyles.shadow.shadowOpacity,
        shadowRadius: resolvedVariantStyles.shadow.shadowRadius,
        elevation: resolvedVariantStyles.shadow.elevation,
      },
      disabled ? styles.disabled : null,
      pressed && onPress && !disabled ? styles.pressed : null,
      style,
    ];
  }, [disabled, onPress, pressed, resolvedVariantStyles.backgroundColor, resolvedVariantStyles.borderColor, resolvedVariantStyles.borderWidth, resolvedVariantStyles.shadow, sizeConfig.height, sizeConfig.paddingHorizontal, sizeConfig.paddingVertical, style]);

  const handleRemove = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemove?.();
  };

  return (
    <Pressable
      ref={ref}
      accessibilityRole={accessibilityRole ?? (onPress ? "button" : "text")}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled,
        selected,
        ...accessibilityState,
      }}
      accessible={accessible}
      disabled={disabled}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={chipStyle}
      testID={testID}
      {...rest}
    >
      <View style={styles.content}>
        {avatarColor ? <View style={[styles.avatarDot, { backgroundColor: avatarColor }]} /> : null}
        {leadingIcon ? <View style={styles.leadingIcon}>{leadingIcon}</View> : null}

        <AppText
          variant={sizeConfig.textVariant}
          color="primary"
          style={[styles.labelText, { color: resolvedVariantStyles.textColor }]}
        >
          {label}
        </AppText>

        {removable && onRemove ? (
          <Pressable
            accessibilityLabel={`Remove ${label}`}
            accessibilityRole="button"
            disabled={disabled}
            onPress={handleRemove}
            style={styles.removeButton}
          >
            <AppText variant="caption" style={[styles.removeText, { color: resolvedVariantStyles.iconColor }]}>
              ×
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </Pressable>
  );
});

AppChipComponent.displayName = "AppChip";

export const AppChip = memo(AppChipComponent);

const styles = StyleSheet.create({
  chip: {
    alignSelf: "flex-start",
    justifyContent: "center",
    borderWidth: 1,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  labelText: {
    includeFontPadding: false,
  },
  avatarDot: {
    width: spacing.sm,
    height: spacing.sm,
    borderRadius: radius.pill,
  },
  leadingIcon: {
    justifyContent: "center",
    alignItems: "center",
  },
  removeButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.xs,
  },
  removeText: {
    lineHeight: typography.caption.lineHeight,
  },
  disabled: {
    opacity: 0.65,
  },
  pressed: {
    transform: [{ scale: animations.scale.buttonPressed }],
    opacity: 0.95,
  },
});
