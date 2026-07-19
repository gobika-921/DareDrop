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
import { animations, colors, radius, shadows } from "@/theme";

export type AppAvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AppAvatarColor = "coral" | "green" | "blue" | "purple" | "amber" | "teal" | "rose";
export type AppAvatarStatus = "active" | "waiting" | "completed" | "skipped" | "passed" | "none";

export interface AppAvatarProps extends Omit<PressableProps, "children" | "style"> {
  name: string;
  size?: AppAvatarSize;
  color?: AppAvatarColor;
  selected?: boolean;
  status?: AppAvatarStatus;
  onPress?: PressableProps["onPress"];
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

const AppAvatarComponent = forwardRef<React.ElementRef<typeof Pressable>, AppAvatarProps>((props, ref) => {
  const {
    name,
    size = "md",
    color = "coral",
    selected = false,
    status = "none",
    onPress,
    style,
    testID,
    accessibilityLabel,
    accessibilityHint,
    accessible = true,
    accessibilityRole,
    ...rest
  } = props;

  const [pressed, setPressed] = useState(false);

  const initials = useMemo(() => {
    const normalized = name.trim().replace(/\s+/g, " ");
    if (!normalized) {
      return "?";
    }

    const parts = normalized.split(" ").filter(Boolean);
    if (parts.length === 1) {
      return parts[0].slice(0, 1).toUpperCase();
    }

    return `${parts[0].slice(0, 1)}${parts[parts.length - 1].slice(0, 1)}`.toUpperCase();
  }, [name]);

  const sizeConfig = useMemo(() => {
    switch (size) {
      case "xs":
        return { diameter: 28, fontVariant: "caption" as const, badgeSize: 8, borderWidth: 1 };
      case "sm":
        return { diameter: 36, fontVariant: "caption" as const, badgeSize: 10, borderWidth: 1 };
      case "lg":
        return { diameter: 56, fontVariant: "heading" as const, badgeSize: 14, borderWidth: 2 };
      case "xl":
        return { diameter: 72, fontVariant: "titleHeading" as const, badgeSize: 16, borderWidth: 2 };
      case "md":
      default:
        return { diameter: 44, fontVariant: "bodyMedium" as const, badgeSize: 12, borderWidth: 2 };
    }
  }, [size]);

  const colorStyle = useMemo(() => {
    switch (color) {
      case "green":
        return { backgroundColor: colors.difficulty.mild, borderColor: colors.difficulty.mild };
      case "blue":
        return { backgroundColor: colors.primary.container, borderColor: colors.accent.primary };
      case "purple":
        return { backgroundColor: colors.surface.elevated, borderColor: colors.primary.DEFAULT };
      case "amber":
        return { backgroundColor: colors.status.warning, borderColor: colors.status.warning };
      case "teal":
        return { backgroundColor: colors.status.success, borderColor: colors.status.success };
      case "rose":
        return { backgroundColor: colors.status.danger, borderColor: colors.status.danger };
      case "coral":
      default:
        return { backgroundColor: colors.accent.primary, borderColor: colors.accent.primary };
    }
  }, [color]);

  const statusColor = useMemo(() => {
    switch (status) {
      case "active":
        return colors.status.success;
      case "waiting":
        return colors.status.warning;
      case "completed":
        return colors.status.success;
      case "skipped":
        return colors.status.danger;
      case "passed":
        return colors.status.success;
      case "none":
      default:
        return colors.transparent;
    }
  }, [status]);

  const avatarStyle = useMemo<StyleProp<ViewStyle>>(() => {
    return [
      styles.avatar,
      {
        width: sizeConfig.diameter,
        height: sizeConfig.diameter,
        borderRadius: radius.circle,
        backgroundColor: colorStyle.backgroundColor,
        borderColor: selected ? colors.accent.primary : colorStyle.borderColor,
        borderWidth: selected ? sizeConfig.borderWidth + 1 : sizeConfig.borderWidth,
        shadowColor: selected ? colors.accent.primary : shadows.small.shadowColor,
        shadowOffset: selected ? { width: 0, height: 2 } : shadows.small.shadowOffset,
        shadowOpacity: selected ? 0.2 : shadows.small.shadowOpacity,
        shadowRadius: selected ? 4 : shadows.small.shadowRadius,
        elevation: selected ? 3 : shadows.small.elevation,
      },
      pressed && onPress ? styles.pressed : null,
      style,
    ];
  }, [colorStyle.backgroundColor, colorStyle.borderColor, onPress, pressed, selected, sizeConfig.borderWidth, sizeConfig.diameter, style]);

  const content = (
    <View style={styles.avatarContent}>
      <AppText variant={sizeConfig.fontVariant} style={styles.initialsText}>
        {initials}
      </AppText>
      {status !== "none" ? (
        <View
          style={[
            styles.statusBadge,
            {
              width: sizeConfig.badgeSize,
              height: sizeConfig.badgeSize,
              backgroundColor: statusColor,
            },
          ]}
        />
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        ref={ref}
        accessibilityRole={accessibilityRole ?? "button"}
        accessibilityLabel={accessibilityLabel ?? `${name}, Player Avatar`}
        accessibilityHint={accessibilityHint}
        accessible={accessible}
        onPress={onPress}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}
        style={avatarStyle}
        testID={testID}
        {...rest}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel ?? `${name}, Player Avatar`}
      accessibilityRole={accessibilityRole}
      accessible={accessible}
      style={avatarStyle}
      testID={testID}
    >
      {content}
    </View>
  );
});

AppAvatarComponent.displayName = "AppAvatar";

export const AppAvatar = memo(AppAvatarComponent);

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  avatarContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  initialsText: {
    color: colors.text.inverse,
    includeFontPadding: false,
  },
  statusBadge: {
    position: "absolute",
    bottom: 1,
    right: 1,
    borderRadius: radius.circle,
    borderWidth: 1,
    borderColor: colors.surface.default,
  },
  pressed: {
    transform: [{ scale: animations.scale.buttonPressed }],
    opacity: 0.95,
  },
});
