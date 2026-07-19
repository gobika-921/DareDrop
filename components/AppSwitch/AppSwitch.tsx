import React, { forwardRef, memo, useEffect, useMemo } from "react";
import {
  Pressable,
  StyleSheet,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
  View,
} from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { AppText } from "@/components/AppText";
import { colors, radius, spacing } from "@/theme";

export type AppSwitchLabelPosition = "left" | "right";

export interface AppSwitchProps extends Omit<PressableProps, "children" | "style" | "onPress"> {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  labelPosition?: AppSwitchLabelPosition;
  comingSoon?: boolean; // Shows "Coming soon" tag if true
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const TRACK_OFF_COLOR = "#E0DAD3";
const TRACK_ON_COLOR = colors.primary.DEFAULT;

const AppSwitchComponent = forwardRef<React.ElementRef<typeof Pressable>, AppSwitchProps>((props, ref) => {
  const {
    value,
    onValueChange,
    disabled = false,
    label,
    description,
    labelPosition = "left",
    comingSoon = false,
    style,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessible = true,
    accessibilityRole = "switch",
    accessibilityState,
    ...rest
  } = props;

  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(value ? 1 : 0, { duration: 200 });
  }, [value, progress]);

  const handlePress = () => {
    if (!disabled && !comingSoon) {
      onValueChange?.(!value);
    }
  };

  // Reanimated style for track color transition
  const animatedTrackStyle = useAnimatedStyle(() => {
    const trackColor = interpolateColor(
      progress.value,
      [0, 1],
      [TRACK_OFF_COLOR, TRACK_ON_COLOR]
    );

    return {
      backgroundColor: trackColor,
      borderColor: trackColor,
      opacity: disabled ? 0.4 : 1, // Spec: 40% opacity when disabled
    };
  });

  // Reanimated style for smooth thumb sliding (exactly 20px travel: 44px track - 20px thumb - 4px total horizontal inset)
  const animatedThumbStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: progress.value * 20,
        },
      ],
    };
  });

  const labelContent = label ? (
    <View style={styles.labelContainer}>
      <View style={styles.labelTitleRow}>
        <AppText
          variant="body"
          style={[
            styles.labelText,
            disabled && { color: colors.text.secondary },
          ]}
        >
          {label}
        </AppText>
        {comingSoon ? (
          <AppText variant="caption" style={styles.comingSoonTag}>
            Coming soon
          </AppText>
        ) : null}
      </View>
      {description ? (
        <AppText variant="caption" style={styles.descriptionText}>
          {description}
        </AppText>
      ) : null}
    </View>
  ) : null;

  const switchWidget = (
    <Animated.View style={[styles.track, animatedTrackStyle]}>
      <Animated.View style={[styles.thumb, animatedThumbStyle]} />
    </Animated.View>
  );

  const isRow = Boolean(label);

  const rowStyle = useMemo<StyleProp<ViewStyle>>(() => {
    if (!isRow) {
      return style;
    }

    return [
      styles.rowContainer,
      {
        height: description ? 64 : 48,
        paddingHorizontal: 24, // Row horizontal padding matches screen padding (24px)
        opacity: disabled ? 0.6 : 1,
      },
      style,
    ];
  }, [isRow, description, disabled, style]);

  return (
    <Pressable
      ref={ref}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityHint={accessibilityHint}
      accessibilityState={{
        disabled,
        checked: value,
        ...accessibilityState,
      }}
      accessible={accessible}
      disabled={disabled || comingSoon}
      onPress={handlePress}
      style={rowStyle}
      testID={testID}
      {...rest}
    >
      {isRow ? (
        <React.Fragment>
          {labelPosition === "right" ? (
            <React.Fragment>
              {switchWidget}
              {labelContent}
            </React.Fragment>
          ) : (
            <React.Fragment>
              {labelContent}
              {switchWidget}
            </React.Fragment>
          )}
        </React.Fragment>
      ) : (
        switchWidget
      )}
    </Pressable>
  );
});

AppSwitchComponent.displayName = "AppSwitch";

export const AppSwitch = memo(AppSwitchComponent);

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  labelContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: spacing.md,
  },
  labelTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  labelText: {
    color: colors.text.primary,
    fontWeight: "500",
  },
  comingSoonTag: {
    fontSize: 11,
    color: colors.text.secondary,
    marginLeft: 8,
    includeFontPadding: false,
  },
  descriptionText: {
    color: colors.text.secondary,
    marginTop: 2,
  },
  track: {
    width: 44, // Spec switch track: 44x24px
    height: 24,
    borderRadius: radius.pill,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 1,
  },
  thumb: {
    width: 20, // Spec thumb: 20x20px circle, 2px inset (handled by padding/translateX)
    height: 20,
    borderRadius: radius.circle,
    backgroundColor: "#FFFFFF",
    shadowColor: colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.16,
    shadowRadius: 2,
    elevation: 2,
    left: 1, // 2px horizontal inset (1px padding + 1px left)
  },
});
