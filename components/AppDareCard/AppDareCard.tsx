import React, { memo } from "react";
import { StyleSheet, View, ViewStyle, StyleProp } from "react-native";

import { colors, radius, spacing, shadows } from "@/theme";
import { Dare } from "@/types";

import { AppDifficultyBadge } from "../AppDifficultyBadge";
import { AppText } from "../AppText";

export interface AppDareCardProps {
  dare: Dare;
  style?: StyleProp<ViewStyle>;
}

const TINT_OPACITY = "1A"; // 10% opacity

const AppDareCardComponent = ({ dare, style }: AppDareCardProps) => {
  const getBackgroundColor = () => {
    switch (dare.difficulty) {
      case "Mild":
        return `${colors.difficulty.mild}${TINT_OPACITY}`;
      case "Spicy":
        return `${colors.difficulty.spicy}${TINT_OPACITY}`;
      case "Extreme":
        return `${colors.difficulty.extreme}${TINT_OPACITY}`;
      default:
        return colors.surface.default;
    }
  };

  const getBorderColor = () => {
    switch (dare.difficulty) {
      case "Mild":
        return colors.difficulty.mild;
      case "Spicy":
        return colors.difficulty.spicy;
      case "Extreme":
        return colors.difficulty.extreme;
      default:
        return colors.border.default;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
        },
        style,
      ]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`Dare: ${dare.text}. Difficulty: ${dare.difficulty}`}
    >
      <View style={styles.header}>
        <AppDifficultyBadge difficulty={dare.difficulty} />
      </View>

      <View style={styles.content}>
        <AppText variant="title" style={styles.dareText} align="center">
          {dare.text}
        </AppText>
      </View>
    </View>
  );
};

export const AppDareCard = memo(AppDareCardComponent);

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1, // Hairline border per specs
    padding: spacing.lg,
    minHeight: 200,
    ...shadows.resting,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end", // Top right corner
    marginBottom: spacing.md,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dareText: {
    color: colors.text.primary,
  },
});
