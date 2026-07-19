import React, { memo, useEffect } from "react";
import { StyleSheet, type StyleProp, type ViewStyle, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { colors, radius } from "@/theme";

export interface AppProgressBarProps {
  /** Progress value between 0 and 1 */
  progress: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const AppProgressBarComponent = ({ progress, style, testID }: AppProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const progressValue = useSharedValue(clampedProgress);

  useEffect(() => {
    progressValue.value = withTiming(clampedProgress, {
      duration: 200,
      easing: Easing.out(Easing.quad),
    });
  }, [clampedProgress, progressValue]);

  // Reanimated style for width scale transition
  const animatedFillStyle = useAnimatedStyle(() => {
    return {
      width: `${progressValue.value * 100}%`,
    };
  });

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 0,
        max: 100,
        now: Math.round(clampedProgress * 100),
      }}
      accessible
      style={[styles.container, style]}
      testID={testID}
    >
      <Animated.View style={[styles.fill, animatedFillStyle]} />
    </View>
  );
};

export const AppProgressBar = memo(AppProgressBarComponent);

const styles = StyleSheet.create({
  container: {
    height: 4, // Spec height: 4px
    backgroundColor: colors.primary.container, // Spec track: primaryContainer (#EFE2D6)
    borderRadius: radius.pill, // Spec: fully rounded ends
    overflow: "hidden",
    width: "100%",
  },
  fill: {
    height: "100%",
    backgroundColor: colors.accent.primary, // Spec fill: accent (#E8825C)
    borderRadius: radius.pill,
  },
});
