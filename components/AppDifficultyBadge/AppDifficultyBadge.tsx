import React, { memo } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Difficulty } from "@/types";

import { AppText } from "../AppText";

export interface AppDifficultyBadgeProps {
  difficulty: Difficulty;
  style?: StyleProp<ViewStyle>;
}

const BADGE_CONFIG: Record<Difficulty, { color: string; label: string; icon: string }> = {
  Mild: { color: colors.difficulty.mild, label: "Mild", icon: "🟢" },
  Spicy: { color: colors.difficulty.spicy, label: "Spicy", icon: "🟠" },
  Extreme: { color: colors.difficulty.extreme, label: "Extreme", icon: "🔴" },
};

const AppDifficultyBadgeComponent = ({ difficulty, style }: AppDifficultyBadgeProps) => {
  const config = BADGE_CONFIG[difficulty];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: config.color },
        style,
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Difficulty: ${config.label}`}
    >
      <AppText
        variant="caption"
        style={styles.text}
        numberOfLines={1}
      >
        {config.icon} {config.label}
      </AppText>
    </View>
  );
};

export const AppDifficultyBadge = memo(AppDifficultyBadgeComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
  },
  text: {
    color: colors.text.inverse,
    fontWeight: "600",
  },
});
