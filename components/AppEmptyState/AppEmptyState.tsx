import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

import { theme } from '@/theme';

import { AppButton } from '../AppButton';
import { AppText } from '../AppText';

export interface AppEmptyStateProps {
  /** The icon or illustration to display above the title. Should be 96px. */
  icon?: React.ReactNode;
  /** The main title text (heading 18 SemiBold). */
  title: string;
  /** The subtitle text (body 16 Medium), max width 280px. */
  subtitle?: string;
  /** Text for the CTA button, if present. */
  ctaText?: string;
  /** Action for the CTA button, if present. */
  onCtaPress?: () => void;
  /** Button role for the CTA. A.13 specifies Accent CTA or Primary. Defaults to 'accent'. */
  ctaRole?: 'primary' | 'accent';
  /** Optional container style. */
  style?: ViewStyle;
}

/**
 * AppEmptyState
 * 
 * Standard empty state component matching A.13 spec.
 * Centered layout with an optional 96px icon, title, subtitle, and CTA.
 */
export const AppEmptyState = React.memo(
  ({
    icon,
    title,
    subtitle,
    ctaText,
    onCtaPress,
    ctaRole = 'accent',
    style,
  }: AppEmptyStateProps) => {
    return (
      <View style={[styles.container, style]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <AppText variant="heading" color="textPrimary" align="center" style={styles.title}>
          {title}
        </AppText>
        {subtitle && (
          <AppText variant="body" color="textSecondary" align="center" style={styles.subtitle}>
            {subtitle}
          </AppText>
        )}
        {ctaText && onCtaPress && (
          <View style={styles.ctaContainer}>
            <AppButton
              onPress={onCtaPress}
              variant={ctaRole}
            >
              {ctaText}
            </AppButton>
          </View>
        )}
      </View>
    );
  }
);

AppEmptyState.displayName = 'AppEmptyState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.xxl,
  },
  iconContainer: {
    marginBottom: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    // The spec notes 96px, the parent providing the icon should size it, 
    // but we ensure centering here.
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    maxWidth: 280,
  },
  ctaContainer: {
    marginTop: theme.spacing.xxl, // 24px gap below subtitle per A.13
    width: '100%',
  },
});
