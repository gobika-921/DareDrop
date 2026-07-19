import React, { forwardRef, memo, useMemo } from "react";
import {
  Image,
  type ImageSourcePropType,
  Pressable,
  type PressableProps,
  StyleSheet,
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
import { animations, colors, radius, shadows } from "@/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type AppAvatarSize = "small" | "medium" | "large" | "xs" | "sm" | "md" | "lg" | "xl";
export type AppAvatarStatus = "active" | "waiting" | "completed" | "skipped" | "passed" | "none";

export interface AppAvatarProps extends Omit<PressableProps, "children" | "style"> {
  name: string;
  source?: ImageSourcePropType;
  size?: AppAvatarSize;
  color?: string;
  selected?: boolean;
  hasBorder?: boolean;
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
    source,
    size = "medium",
    color,
    selected = false,
    hasBorder = false,
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

  const scale = useSharedValue(1);

  // Fallback initials: strictly first character, uppercase per spec A.3
  const initials = useMemo(() => {
    const trimmed = name?.trim();
    if (!trimmed) {
      return "?";
    }
    return trimmed.charAt(0).toUpperCase();
  }, [name]);

  // Size configuration per spec guidelines A.3 PlayerAvatar
  const sizeConfig = useMemo(() => {
    // Standardize the props sizes to the 3 canonical categories: small, medium, large
    const normSize = size.toLowerCase();
    if (normSize === "small" || normSize === "xs" || normSize === "sm") {
      return { diameter: 32, fontSize: 14, badgeSize: 10 };
    }
    if (normSize === "large" || normSize === "lg" || normSize === "xl") {
      return { diameter: 72, fontSize: 28, badgeSize: 18 };
    }
    // Default to medium
    return { diameter: 48, fontSize: 18, badgeSize: 14 };
  }, [size]);

  // Resolve player color: supports hex, standard React Native colors, or defaults to accent
  const avatarBgColor = useMemo(() => {
    if (!color) {
      return colors.accent.primary;
    }
    if (color in colors.difficulty) {
      return colors.difficulty[color as keyof typeof colors.difficulty];
    }
    return color;
  }, [color]);

  const statusColor = useMemo(() => {
    switch (status) {
      case "active":
      case "completed":
      case "passed":
        return colors.status.success;
      case "waiting":
        return colors.status.warning; // Matches warning alias mapping to accent.primary
      case "skipped":
        return colors.status.danger;
      case "none":
      default:
        return colors.transparent;
    }
  }, [status]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const avatarStyle = useMemo<StyleProp<ViewStyle>>(() => {
    const diameter = sizeConfig.diameter;
    const borderSpacing = hasBorder ? 2 : 0;

    return [
      styles.avatar,
      {
        width: diameter,
        height: diameter,
        borderRadius: radius.circle,
        backgroundColor: avatarBgColor,
        borderColor: selected ? colors.accent.primary : "#FFFFFF",
        borderWidth: selected ? 3 : borderSpacing,
        // Apply resting shadow when selected or as basic elevation
        shadowColor: selected ? colors.accent.primary : shadows.resting.shadowColor,
        shadowOffset: selected ? { width: 0, height: 2 } : shadows.resting.shadowOffset,
        shadowOpacity: selected ? 0.2 : shadows.resting.shadowOpacity,
        shadowRadius: selected ? 4 : shadows.resting.shadowRadius,
        elevation: selected ? 3 : shadows.resting.elevation,
      },
      style,
    ];
  }, [avatarBgColor, hasBorder, selected, sizeConfig.diameter, style]);

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withTiming(animations.pressScale, {
        duration: animations.duration.pressScale,
      });
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withTiming(1, {
        duration: animations.duration.pressScale,
      });
    }
  };

  // Expand hitSlop for smaller avatars to reach 44x44px target
  const resolvedHitSlop = useMemo(() => {
    const diameter = sizeConfig.diameter;
    if (diameter < 44) {
      const padding = (44 - diameter) / 2;
      return { top: padding, bottom: padding, left: padding, right: padding };
    }
    return 0;
  }, [sizeConfig.diameter]);

  const avatarContent = (
    <View style={styles.content}>
      {source ? (
        <Image
          source={source}
          style={[
            styles.image,
            { borderRadius: radius.circle },
          ]}
          resizeMode="cover"
        />
      ) : (
        <AppText
          style={[
            styles.initialsText,
            {
              fontSize: sizeConfig.fontSize,
              lineHeight: sizeConfig.fontSize * 1.25,
            },
          ]}
        >
          {initials}
        </AppText>
      )}

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
      <AnimatedPressable
        ref={ref}
        accessibilityRole={accessibilityRole ?? "button"}
        accessibilityLabel={accessibilityLabel ?? `${name}, Player Avatar`}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ selected }}
        accessible={accessible}
        disabled={false}
        hitSlop={resolvedHitSlop}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[avatarStyle, animatedStyle]}
        testID={testID}
        {...rest}
      >
        {avatarContent}
      </AnimatedPressable>
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
      {avatarContent}
    </View>
  );
});

AppAvatarComponent.displayName = "AppAvatar";

export const AppAvatar = memo(AppAvatarComponent);

const styles = StyleSheet.create({
  avatar: {
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  initialsText: {
    fontFamily: "Poppins",
    fontWeight: "600",
    color: colors.text.inverse,
    textAlign: "center",
    includeFontPadding: false,
  },
  statusBadge: {
    position: "absolute",
    bottom: -1,
    right: -1,
    borderRadius: radius.circle,
    borderWidth: 1.5,
    borderColor: colors.surface.default,
  },
});
