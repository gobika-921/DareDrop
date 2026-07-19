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
        return colors.divider.default; // Spec: 1px rgba(36,31,28,0.06) (theme colors.divider.default matches closely)
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

  const resolvedStyle = useMemo<StyleProp<ViewStyle>>(() => {
    const isVertical = orientation === "vertical";
    const insetVal = spacing.md; // Spec inset: spacing.md (12px)

    if (isVertical) {
      return [
        styles.vertical,
        {
          backgroundColor: resolvedColor,
          width: resolvedThickness,
          marginTop: variant === "full" ? 0 : insetVal,
          marginBottom: variant === "full" ? 0 : insetVal,
        },
        style,
      ];
    }

    return [
      styles.horizontal,
      {
        backgroundColor: resolvedColor,
        height: resolvedThickness,
        marginLeft: variant === "full" ? 0 : insetVal,
        marginRight: variant === "middleInset" ? insetVal : 0,
      },
      style,
    ];
  }, [orientation, resolvedColor, resolvedThickness, style, variant]);

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
