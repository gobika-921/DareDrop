import { Stack } from "expo-router";
import React from "react";

import { colors } from "@/theme";

export default function GameLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Prevent accidental swipe back during gameplay
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
