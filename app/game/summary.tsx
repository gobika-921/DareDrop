import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppAvatar } from "@/components/AppAvatar";
import { AppButton } from "@/components/AppButton";
import { AppCard } from "@/components/AppCard";
import { AppEmptyState } from "@/components/AppEmptyState";
import { AppText } from "@/components/AppText";
import { useGameSessionStore } from "@/store/gameSessionStore";
import { colors, spacing } from "@/theme";

export default function SummaryScreen() {
  const session = useGameSessionStore((s) => s.session);
  const playAgain = useGameSessionStore((s) => s.playAgain);
  const newGame = useGameSessionStore((s) => s.newGame);
  
  const [loading, setLoading] = useState(false);

  if (!session || session.state !== "Completed" || !session.summary) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <AppEmptyState
          title="Summary Unavailable"
          subtitle="The game session is either not complete or could not be found."
          ctaText="Return Home"
          onCtaPress={() => router.replace("/")}
        />
      </SafeAreaView>
    );
  }

  const summary = session.summary;
  const players = session.players;

  const handlePlayAgain = async () => {
    if (loading) return;
    setLoading(true);
    await playAgain();
    router.replace("/game/spin");
  };

  const handleNewGame = async () => {
    if (loading) return;
    setLoading(true);
    await newGame();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <AppText variant="display" style={styles.title}>
            Game Over!
          </AppText>
        </View>

        {/* Stats Section */}
        <View style={styles.section}>
          <AppText variant="title" style={styles.sectionTitle}>
            Session Stats
          </AppText>
          <View style={styles.statsGrid}>
            <AppCard variant="filled" padding="medium" style={styles.statCard}>
              <AppText variant="heading" style={styles.statValue}>
                {summary.completed}
              </AppText>
              <AppText variant="caption" style={styles.statLabel}>
                Completed
              </AppText>
            </AppCard>
            
            <AppCard variant="filled" padding="medium" style={styles.statCard}>
              <AppText variant="heading" style={styles.statValue}>
                {summary.skipped}
              </AppText>
              <AppText variant="caption" style={styles.statLabel}>
                Skipped
              </AppText>
            </AppCard>

            <AppCard variant="filled" padding="medium" style={styles.statCard}>
              <AppText variant="heading" style={styles.statValue}>
                {Math.round(summary.completionRate * 100)}%
              </AppText>
              <AppText variant="caption" style={styles.statLabel}>
                Completion
              </AppText>
            </AppCard>
          </View>
        </View>

        {/* Awards Section */}
        {summary.awards.length > 0 && (
          <View style={styles.section}>
            <AppText variant="title" style={styles.sectionTitle}>
              Awards
            </AppText>
            <View style={styles.awardsList}>
              {summary.awards.map((award, idx) => {
                const player = players.find((p) => p.id === award.playerId);
                if (!player) return null;
                return (
                  <AppCard key={idx} padding="medium" style={styles.awardCard}>
                    <View style={styles.awardHeader}>
                      <AppAvatar name={player.name} color={player.avatarColor} size="sm" />
                      <AppText variant="body" style={styles.awardPlayerName}>
                        {player.name}
                      </AppText>
                    </View>
                    <AppText variant="heading" style={styles.awardTitle}>
                      🏆 {award.title}
                    </AppText>
                    <AppText variant="body" style={styles.awardDescription}>
                      {award.description}
                    </AppText>
                  </AppCard>
                );
              })}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Action Footer */}
      <View style={styles.footer}>
        <AppButton
          onPress={handlePlayAgain}
          disabled={loading}
          style={styles.actionButton}
        >
          Play Again
        </AppButton>
        <AppButton
          variant="secondary"
          onPress={handleNewGame}
          disabled={loading}
          style={styles.actionButton}
        >
          New Game
        </AppButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  title: {
    color: colors.text.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: colors.text.primary,
  },
  statsGrid: {
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
  },
  statCard: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: colors.accent.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    color: colors.text.secondary,
  },
  awardsList: {
    gap: spacing.md,
  },
  awardCard: {
    marginBottom: spacing.xs,
  },
  awardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  awardPlayerName: {
    marginLeft: spacing.sm,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  awardTitle: {
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  awardDescription: {
    color: colors.text.secondary,
  },
  footer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.border.default,
  },
  actionButton: {
    marginBottom: spacing.md,
  },
});
