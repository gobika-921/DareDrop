import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppAvatar } from "@/components/AppAvatar";
import { AppBottomSheet } from "@/components/AppBottomSheet";
import { AppButton } from "@/components/AppButton";
import { AppDareCard } from "@/components/AppDareCard";
import { AppEmptyState } from "@/components/AppEmptyState";
import { AppModal } from "@/components/AppModal";
import { AppText } from "@/components/AppText";
import { useAllDares } from "@/hooks/useAllDares";
import {
  useGameSessionStore,
  selectCurrentPlayer,
  selectCurrentRound,
  selectSkipsRemaining,
  selectCanPass,
  selectCanSkip,
} from "@/store/gameSessionStore";
import { colors, spacing } from "@/theme";
import { RoundResult } from "@/types";

export default function RevealScreen() {
  const { dares, loading } = useAllDares();
  
  const session = useGameSessionStore((s) => s.session);
  const player = useGameSessionStore(selectCurrentPlayer);
  const round = useGameSessionStore(selectCurrentRound);
  const skipsRemaining = useGameSessionStore(selectSkipsRemaining);
  const canSkip = useGameSessionStore(selectCanSkip);
  const canPass = useGameSessionStore(selectCanPass);
  
  const resolveCurrentRound = useGameSessionStore((s) => s.resolveCurrentRound);
  const nextRound = useGameSessionStore((s) => s.nextRound);

  const [isSkipSheetVisible, setIsSkipSheetVisible] = useState(false);
  const [isPassModalVisible, setIsPassModalVisible] = useState(false);
  const [resolving, setResolving] = useState(false);

  // Fallback states
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          <AppText>Loading dare...</AppText>
        </View>
      </SafeAreaView>
    );
  }

  if (!session || !player || !round) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppEmptyState
          title="Game Error"
          subtitle="Could not load the current round."
          ctaText="Exit Game"
          onCtaPress={() => router.replace("/")}
        />
      </SafeAreaView>
    );
  }

  const currentDare = dares.find((d) => d.id === round.dareId);

  if (!currentDare) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppEmptyState
          title="Dare Not Found"
          subtitle="The dare for this round could not be found."
          ctaText="Exit Game"
          onCtaPress={() => router.replace("/")}
        />
      </SafeAreaView>
    );
  }

  const handleResolve = async (result: RoundResult) => {
    if (resolving) return;
    setResolving(true);
    
    setIsSkipSheetVisible(false);
    setIsPassModalVisible(false);

    await resolveCurrentRound(result);

    const currentState = useGameSessionStore.getState().session?.state;
    if (currentState === "Completed") {
      router.replace("/game/summary");
    } else {
      await nextRound();
      router.replace("/game/spin");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        {/* Player Section */}
        <Animated.View style={styles.playerSection} entering={FadeIn.duration(400)}>
          <AppAvatar color={player.avatarColor} name={player.name} size="lg" />
          <AppText variant="title" style={styles.playerName}>
            {player.name}
          </AppText>
        </Animated.View>

        {/* Dare Card */}
        <Animated.View style={styles.cardSection} entering={ZoomIn.duration(400).delay(200)}>
          <AppDareCard dare={currentDare} />
        </Animated.View>

        <View style={styles.skipCounterSection}>
          <AppText variant="caption" style={styles.skipCounterText}>
            {skipsRemaining} skip{skipsRemaining !== 1 ? "s" : ""} remaining
          </AppText>
        </View>

        {/* Action Buttons */}
        <Animated.View style={styles.actionSection} entering={FadeIn.duration(400).delay(400)}>
          <AppButton
            onPress={() => handleResolve("Completed")}
            disabled={resolving}
            style={styles.actionButton}
          >
            Completed
          </AppButton>
          
          <AppButton
            variant="secondary"
            onPress={() => setIsSkipSheetVisible(true)}
            disabled={resolving || !canSkip}
            style={styles.actionButton}
          >
            Skip
          </AppButton>
          
          {canPass && (
            <AppButton
              variant="tertiary"
              onPress={() => setIsPassModalVisible(true)}
              disabled={resolving}
              style={styles.actionButton}
            >
              Pass
            </AppButton>
          )}
        </Animated.View>
      </View>

      {/* Skip Bottom Sheet */}
      <AppBottomSheet
        visible={isSkipSheetVisible}
        onDismiss={() => setIsSkipSheetVisible(false)}
      >
        <AppText variant="heading" style={styles.sheetText}>Use a Skip?</AppText>
        <AppText style={styles.sheetText}>
          You have {skipsRemaining} skip{skipsRemaining !== 1 ? "s" : ""} left. Are you sure you want to skip this dare?
        </AppText>
        <View style={styles.sheetActions}>
          <AppButton
            variant="danger"
            onPress={() => handleResolve("Skipped")}
            disabled={resolving}
            style={styles.sheetButton}
          >
            Yes, Skip Dare
          </AppButton>
          <AppButton
            variant="secondary"
            onPress={() => setIsSkipSheetVisible(false)}
            disabled={resolving}
            style={styles.sheetButton}
          >
            Cancel
          </AppButton>
        </View>
      </AppBottomSheet>

      {/* Pass Modal */}
      <AppModal
        visible={isPassModalVisible}
        onDismiss={() => setIsPassModalVisible(false)}
        title="Pass this dare?"
        body="Passing a dare will not cost a skip, but it will affect your final awards."
        primaryAction={{
          label: "Yes, Pass",
          onPress: () => handleResolve("Passed"),
        }}
        secondaryAction={{
          label: "Cancel",
          onPress: () => setIsPassModalVisible(false),
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  playerSection: {
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  playerName: {
    marginTop: spacing.sm,
    color: colors.text.primary,
  },
  cardSection: {
    marginBottom: spacing.xl,
  },
  skipCounterSection: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  skipCounterText: {
    color: colors.text.secondary,
  },
  actionSection: {
    marginTop: "auto",
    paddingBottom: spacing.lg,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
  sheetText: {
    color: colors.text.primary,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  sheetActions: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  sheetButton: {
    width: "100%",
  },
});
