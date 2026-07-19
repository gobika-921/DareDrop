import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { StyleSheet, View, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  runOnJS,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppProgressBar } from "@/components/AppProgressBar";
import { AppText } from "@/components/AppText";
import { useGameSessionStore, selectRoundProgress } from "@/store/gameSessionStore";
import { colors, spacing, typography, shadows, radius } from "@/theme";

export default function SpinScreen() {
  const { current, total } = useGameSessionStore(selectRoundProgress);
  const revealCurrentRound = useGameSessionStore((s) => s.revealCurrentRound);

  // Button scaling animation for press
  const buttonScale = useSharedValue(1);

  // Continuous breathing animation for the button while idle
  const breathingScale = useSharedValue(1);

  useEffect(() => {
    breathingScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500 }),
        withTiming(1, { duration: 1500 })
      ),
      -1, // Infinite
      true // Reverse
    );
  }, [breathingScale]);

  const animatedButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: buttonScale.value * breathingScale.value }],
    };
  });

  // Card shuffle animation
  const card1Offset = useSharedValue(0);
  const card1Rotate = useSharedValue(-5);
  const card2Offset = useSharedValue(0);
  const card2Rotate = useSharedValue(5);
  const card3Offset = useSharedValue(0);

  const animatedCard1 = useAnimatedStyle(() => ({
    transform: [{ translateX: card1Offset.value }, { rotate: `${card1Rotate.value}deg` }],
  }));
  const animatedCard2 = useAnimatedStyle(() => ({
    transform: [{ translateX: card2Offset.value }, { rotate: `${card2Rotate.value}deg` }],
  }));
  const animatedCard3 = useAnimatedStyle(() => ({
    transform: [{ translateX: card3Offset.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withSpring(0.96);
  };

  const handlePressOut = () => {
    buttonScale.value = withSpring(1);
  };

  const navigateToReveal = useCallback(() => {
    revealCurrentRound();
    router.replace("/game/reveal");
  }, [revealCurrentRound]);

  const handleSpin = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Shuffle animation for cards
    // eslint-disable-next-line react-hooks/immutability
    card1Offset.value = withSequence(
      withTiming(-80, { duration: 200 }),
      withTiming(0, { duration: 300 })
    );
    // eslint-disable-next-line react-hooks/immutability
    card2Offset.value = withSequence(
      withTiming(80, { duration: 200 }),
      withTiming(0, { duration: 300 })
    );

    // eslint-disable-next-line react-hooks/immutability
    card1Rotate.value = withSequence(
      withTiming(-15, { duration: 200 }),
      withTiming(-5, { duration: 300 })
    );
    // eslint-disable-next-line react-hooks/immutability
    card2Rotate.value = withSequence(
      withTiming(15, { duration: 200 }),
      withTiming(5, { duration: 300 })
    );

    // Navigate after animation completes
    setTimeout(() => {
      runOnJS(navigateToReveal)();
    }, 600);
  }, [card1Offset, card1Rotate, card2Offset, card2Rotate, navigateToReveal]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <AppText variant="title" style={styles.roundText}>
          Round {current} of {total}
        </AppText>
        <AppProgressBar progress={current / total} style={styles.progressBar} />
      </View>

      <View style={styles.mainContent}>
        {/* Decorative card stack */}
        <View style={styles.cardStackContainer}>
          <Animated.View style={[styles.decorativeCard, styles.cardBack, animatedCard1]} />
          <Animated.View style={[styles.decorativeCard, styles.cardMiddle, animatedCard2]} />
          <Animated.View style={[styles.decorativeCard, styles.cardFront, animatedCard3]} />
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handleSpin}
          style={styles.spinButtonWrapper}
          accessibilityRole="button"
          accessibilityLabel="Spin to select the next player"
          accessibilityHint="Starts the next round"
        >
          <Animated.View style={[styles.spinButton, animatedButtonStyle]}>
            <AppText variant="heading" style={styles.spinButtonText}>
              SPIN
            </AppText>
          </Animated.View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    alignItems: "center",
  },
  roundText: {
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  progressBar: {
    width: "60%", // Make progress bar smaller to match designs
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardStackContainer: {
    width: 220,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  decorativeCard: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: colors.surface.elevated,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border.default,
    ...shadows.resting,
  },
  cardBack: {
    zIndex: 1,
  },
  cardMiddle: {
    zIndex: 2,
  },
  cardFront: {
    zIndex: 3,
    backgroundColor: colors.surface.default,
  },
  footer: {
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: "center",
  },
  spinButtonWrapper: {
    // This wrapper handles the touch events
  },
  spinButton: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.accent.primary,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.elevated, // Stronger shadow for the main button
  },
  spinButtonText: {
    color: colors.text.inverse,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
