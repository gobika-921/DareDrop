import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';

import { theme } from '@/theme';

import { AppButton } from '../AppButton';
import { AppText } from '../AppText';

export interface AppModalAction {
  label: string;
  onPress: () => void;
  role?: 'primary' | 'danger' | 'secondary' | 'tertiary';
}

export interface AppModalProps {
  /** Whether the modal is visible */
  visible: boolean;
  /** Optional callback to dismiss the modal when tapping outside. If not provided, backdrop tap does nothing. */
  onDismiss?: () => void;
  /** The dialog title */
  title: string;
  /** The dialog body text */
  body: string;
  /** The primary action button (rendered on the right or top) */
  primaryAction: AppModalAction;
  /** The optional secondary action button (rendered on the left or bottom) */
  secondaryAction?: AppModalAction;
  /** Force the buttons to stack vertically instead of side-by-side */
  stackedButtons?: boolean;
}

/**
 * AppModal
 * 
 * Standard dialog component matching A.9 spec.
 */
export const AppModal = ({
  visible,
  onDismiss,
  title,
  body,
  primaryAction,
  secondaryAction,
  stackedButtons = false,
}: AppModalProps) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const { width } = useWindowDimensions();
  
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalVisible(true);
      // Backdrop: rgba(0,0,0,0.4), fade 150ms
      opacity.value = withTiming(1, { duration: 150 });
      scale.value = withSpring(1, { damping: 20, stiffness: 300 });
    } else {
      opacity.value = withTiming(0, { duration: 150 }, (finished) => {
        if (finished) {
          runOnJS(setModalVisible)(false);
        }
      });
      scale.value = withTiming(0.95, { duration: 150 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const dialogStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  if (!modalVisible) return null;

  // Width: min(320px, screen width - 48px)
  const dialogWidth = Math.min(320, width - 48);

  const handleBackdropPress = () => {
    if (onDismiss) onDismiss();
  };

  return (
    <Modal transparent visible={modalVisible} animationType="none" onRequestClose={onDismiss}>
      <View style={styles.root}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View style={[styles.overlay, overlayStyle]} />
        </TouchableWithoutFeedback>
        
        <Animated.View style={[styles.dialog, { width: dialogWidth }, dialogStyle]} pointerEvents="box-none">
          <AppText variant="heading" color="textPrimary" style={styles.title}>
            {title}
          </AppText>
          <AppText variant="body" color="textSecondary" style={styles.body}>
            {body}
          </AppText>

          <View style={[styles.buttonContainer, stackedButtons ? styles.buttonContainerStacked : styles.buttonContainerRow]}>
            {secondaryAction && (
              <View style={[styles.buttonWrapper, !stackedButtons && styles.buttonFlex]}>
                <AppButton
                  onPress={secondaryAction.onPress}
                  variant={secondaryAction.role || 'tertiary'}
                >
                  {secondaryAction.label}
                </AppButton>
              </View>
            )}
            <View style={[styles.buttonWrapper, !stackedButtons && styles.buttonFlex]}>
              <AppButton
                onPress={primaryAction.onPress}
                variant={primaryAction.role || 'primary'}
              >
                {primaryAction.label}
              </AppButton>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', // A.9 Backdrop
  },
  dialog: {
    backgroundColor: theme.colors.surface.default, // A.9 Background
    borderRadius: theme.radius.xl, // 28px
    padding: theme.spacing.xxl, // 24px all sides
    ...theme.shadows.elevated,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  body: {
    marginBottom: theme.spacing.xl, // Add spacing before buttons
  },
  buttonContainer: {
    // Layout logic handled dynamically
  },
  buttonContainerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12, // 12px gap
  },
  buttonContainerStacked: {
    flexDirection: 'column-reverse', // Primary action on top per A.9
    gap: 12,
  },
  buttonWrapper: {
    // Wrapper for buttons
  },
  buttonFlex: {
    flex: 1,
  }
});
