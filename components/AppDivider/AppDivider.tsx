import React, { memo, useMemo } from "react";
import { StyleSheet, type StyleProp, type ViewStyle, View } from "react-native";

import { colors, spacing } from "@/theme";

export type AppDividerOrientation = "horizontal" | "vertical";
export type AppDividerVariant = "full" | "inset" | "middleInset";
export type AppDividerThickness = "hairline" | "thin" | "thick";
export type AppDividerColor = "default" | "primary" | "secondary" | "accent";

export interface AppDividerProps {
  orientation?: AppDividerOrientation;
  variant?: AppDividerVariant;
  thickness?: AppDividerThickness;
  color?: AppDividerColor;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const AppDividerComponent = ({
  orientation = "horizontal",
  variant = "full",
  thickness = "hairline",
  color = "default",
  style,
  testID,
}: AppDividerProps) => {
  const resolvedColor = useMemo(() => {
    switch (color) {
      case "primary":
        return colors.primary.DEFAULT;
      case "secondary":
        return colors.text.secondary;
      case "accent":
        return colors.accent.primary;
      case "default":
      default:
        return colors.divider.default;
    }
  }, [color]);

  const resolvedThickness = useMemo(() => {
    switch (thickness) {
      case "thin":
        return 1;
      case "thick":
        return 2;
      case "hairline":
      default:
        return StyleSheet.hairlineWidth;
    }
  }, [thickness]);

  const resolvedInset = useMemo(() => {
    switch (variant) {
      case "inset":
        return spacing.md;
      case "middleInset":
        return spacing.md;
      case "full":
      default:
        return 0;
    }
  }, [variant]);

  const resolvedStyle = useMemo<StyleProp<ViewStyle>>(() => {
    if (orientation === "vertical") {
      return [
        styles.vertical,
        {
          backgroundColor: resolvedColor,
          width: resolvedThickness,
          marginHorizontal: resolvedInset / 2,
        },
        style,
      ];
    }

    return [
      styles.horizontal,
      {
        backgroundColor: resolvedColor,
        height: resolvedThickness,
        marginLeft: variant === "full" ? 0 : resolvedInset,
        marginRight: variant === "full" ? 0 : resolvedInset,
      },
      style,
    ];
  }, [orientation, resolvedColor, resolvedInset, resolvedThickness, style, variant]);

  return <View accessible={false} testID={testID} style={resolvedStyle} />;
};

export const AppDivider = memo(AppDividerComponent);

const styles = StyleSheet.create({
  horizontal: {
    alignSelf: "stretch",
  },
  vertical: {
    alignSelf: "stretch",
  },
});
