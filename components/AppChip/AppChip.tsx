import React, { forwardRef, memo, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  type GestureResponderEvent,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { AppText } from "@/components/AppText";
import { animations, colors, radius, spacing } from "@/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type AppChipVariant = "filled" | "outlined" | "tonal" | "difficulty";
export type AppChipSize = "small" | "medium" | "large";
export type AppChipDifficulty = "mild" | "spicy" | "extreme";

export interface AppChipProps extends Omit<PressableProps, "children" | "style"> {
  label: string;
  variant?: AppChipVariant;
  size?: AppChipSize; // Kept for API compatibility, but defaults to spec layout
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

  const scale = useSharedValue(1);

  const resolvedVariantStyles = useMemo(() => {
    const baseBorder = colors.border.default;

    if (variant === "filled") {
      return {
        backgroundColor: selected ? colors.primary.container : colors.surface.elevated,
        borderColor: selected ? "rgba(58, 51, 47, 0.2)" : baseBorder,
        textColor: colors.primary.DEFAULT,
        iconColor: colors.primary.DEFAULT,
        borderWidth: 1,
      };
    }

    if (variant === "tonal") {
      return {
        backgroundColor: colors.surface.elevated,
        borderColor: baseBorder,
        textColor: colors.text.primary,
        iconColor: colors.text.secondary,
        borderWidth: 1,
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
      };
    }

    // Default: outlined
    return {
      backgroundColor: selected ? colors.primary.container : colors.surface.default,
      borderColor: selected ? "rgba(58, 51, 47, 0.2)" : baseBorder,
      textColor: colors.text.primary,
      iconColor: colors.text.secondary,
      borderWidth: 1,
    };
  }, [difficulty, selected, variant]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Strict layout measurements per A.2 Chip specifications
  const chipStyle = useMemo<StyleProp<ViewStyle>>(() => {
    const hasAvatar = Boolean(avatarColor);
    const leftPad = hasAvatar ? 12 : 16;
    const rightPad = removable ? 8 : 16;

    return [
      styles.chip,
      {
        backgroundColor: resolvedVariantStyles.backgroundColor,
        borderColor: resolvedVariantStyles.borderColor,
        borderWidth: resolvedVariantStyles.borderWidth,
        borderRadius: radius.pill,
        height: 36, // Exact spec height
        paddingLeft: leftPad,
        paddingRight: rightPad,
      },
      disabled ? styles.disabled : null,
      style,
    ];
  }, [avatarColor, disabled, removable, resolvedVariantStyles, style]);

  const handlePressIn = () => {
    if (!disabled && onPress) {
      scale.value = withTiming(animations.pressScale, {
        duration: animations.duration.pressScale,
      });
    }
  };

  const handlePressOut = () => {
    if (!disabled && onPress) {
      scale.value = withTiming(1, {
        duration: animations.duration.pressScale,
      });
    }
  };

  const handleRemove = (event: GestureResponderEvent) => {
    event.stopPropagation();
    onRemove?.();
  };

  return (
    <AnimatedPressable
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
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[chipStyle, animatedStyle]}
      hitSlop={{ top: 4, bottom: 4, left: 0, right: 0 }} // Expand touch target to 44px
      testID={testID}
      {...rest}
    >
      <View style={styles.content}>
        {avatarColor ? <View style={[styles.avatarDot, { backgroundColor: avatarColor }]} /> : null}
        {leadingIcon ? <View style={styles.leadingIcon}>{leadingIcon}</View> : null}

        {/* 14px Medium Inter: deliberate exception per spec */}
        <AppText
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
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }} // Tap target 24x24px
          >
            <AppText style={[styles.removeText, { color: resolvedVariantStyles.iconColor }]}>
              ×
            </AppText>
          </Pressable>
        ) : null}
      </View>
    </AnimatedPressable>
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
  },
  labelText: {
    fontFamily: "Inter",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 18,
    includeFontPadding: false,
  },
  avatarDot: {
    width: 8, // Spec: 8px diameter circle
    height: 8,
    borderRadius: 4,
    marginRight: 8, // Spec: 8px gap before the label
  },
  leadingIcon: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.xs,
  },
  removeButton: {
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    width: 16,
    height: 16,
  },
  removeText: {
    fontFamily: "Inter",
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "bold",
    textAlign: "center",
    includeFontPadding: false,
  },
  disabled: {
    opacity: 0.65,
  },
});
