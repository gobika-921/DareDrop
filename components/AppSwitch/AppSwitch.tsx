import React, { forwardRef, memo, useMemo, useState } from "react";
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  View,
} from "react-native";

import { AppText } from "@/components/AppText";
import { animations, colors, radius, spacing } from "@/theme";

export type AppSwitchLabelPosition = "left" | "right";

export interface AppSwitchProps extends Omit<PressableProps, "children" | "style" | "onPress"> {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  labelPosition?: AppSwitchLabelPosition;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const AppSwitchComponent = forwardRef<React.ElementRef<typeof Pressable>, AppSwitchProps>((props, ref) => {
  const {
    value,
    onValueChange,
    disabled = false,
    label,
    description,
    labelPosition = "right",
    style,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessible = true,
    accessibilityRole = "switch",
    accessibilityState,
    ...rest
  } = props;

  const [pressed, setPressed] = useState(false);

  const isOn = value;
  const isPressed = pressed && !disabled;

  const trackStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return [
      styles.track,
      {
        backgroundColor: isOn
          ? colors.accent.primary
          : colors.surface.elevated,
        borderColor: isOn
          ? colors.accent.primary
          : colors.border.default,
      },
      disabled ? styles.trackDisabled : null,
      isPressed ? styles.trackPressed : null,
    ];
  }, [disabled, isOn, isPressed]);

  const thumbStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return [
      styles.thumb,
      {
        backgroundColor: isOn ? colors.surface.default : colors.surface.default,
        transform: [{ translateX: isOn ? spacing.md : 0 }],
      },
      disabled ? styles.thumbDisabled : null,
      isPressed ? styles.thumbPressed : null,
    ];
  }, [disabled, isOn, isPressed]);

  const handlePress = () => {
    if (!disabled) {
      onValueChange?.(!isOn);
    }
  };

  const labelContent = label ? (
    <View style={styles.labelContainer}>
      <AppText variant="bodyMedium" style={styles.labelText}>
        {label}
      </AppText>
      {description ? (
        <AppText variant="caption" style={styles.descriptionText}>
          {description}
        </AppText>
      ) : null}
    </View>
  ) : null;

  const switchControl = (
    <Pressable
      ref={ref}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled,
        checked: isOn,
        ...accessibilityState,
      }}
      accessible={accessible}
      disabled={disabled}
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={[styles.container, style]}
      testID={testID}
      {...rest}
    >
      {labelPosition === "left" ? labelContent : null}

      <View style={trackStyle}>
        <View style={thumbStyle} />
      </View>

      {labelPosition === "right" ? labelContent : null}
    </Pressable>
  );

  return switchControl;
});

AppSwitchComponent.displayName = "AppSwitch";

export const AppSwitch = memo(AppSwitchComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    minHeight: 44,
    gap: spacing.sm,
  },
  labelContainer: {
    flex: 1,
    justifyContent: "center",
  },
  labelText: {
    color: colors.text.primary,
  },
  descriptionText: {
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  trackDisabled: {
    opacity: 0.65,
  },
  trackPressed: {
    transform: [{ scale: animations.scale.buttonPressed }],
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: radius.circle,
    shadowColor: colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbDisabled: {
    opacity: 0.85,
  },
  thumbPressed: {
    transform: [{ scale: 0.96 }],
  },
});
