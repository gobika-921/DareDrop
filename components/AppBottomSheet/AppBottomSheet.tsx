import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal, TouchableWithoutFeedback, useWindowDimensions } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { theme } from '@/theme';

export interface AppBottomSheetProps {
  /** Whether the sheet is currently open */
  visible: boolean;
  /** Callback fired when the user dismisses the sheet via gesture or overlay tap */
  onDismiss: () => void;
  /** Sheet content */
  children: React.ReactNode;
}

/**
 * AppBottomSheet
 * 
 * Standard bottom sheet component matching A.8 spec.
 * Uses React Native Modal and Reanimated for layout and animation.
 */
export const AppBottomSheet = ({ visible, onDismiss, children }: AppBottomSheetProps) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  
  const translateY = useSharedValue(height);
  const opacity = useSharedValue(0);

  // A.8: 24-32px bottom (respect device safe area, use the larger value)
  const bottomPadding = Math.max(32, insets.bottom); 

  useEffect(() => {
    if (visible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setModalVisible(true);
      translateY.value = height;
      // Overlay dim fades in/out over 200ms
      opacity.value = withTiming(1, { duration: 200 }); 
      // Open animation: slide up from bottom, spring, ~280ms
      translateY.value = withSpring(0, { damping: 20, stiffness: 200, mass: 1 });
    } else {
      opacity.value = withTiming(0, { duration: 200 });
      translateY.value = withTiming(height, { duration: 280 }, (finished) => {
        if (finished) {
          runOnJS(setModalVisible)(false);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, height]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      // Only allow dragging downwards
      if (event.translationY > 0) {
        // eslint-disable-next-line react-hooks/immutability
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      // Dismiss if dragged down more than 100px or fast enough
      if (event.translationY > 100 || event.velocityY > 500) {
        runOnJS(onDismiss)();
      } else {
        // Snap back to open
        // eslint-disable-next-line react-hooks/immutability
        translateY.value = withSpring(0, { damping: 20, stiffness: 200, mass: 1 });
      }
    });

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (!modalVisible) return null;

  return (
    <Modal transparent visible={modalVisible} animationType="none" onRequestClose={onDismiss}>
      <GestureHandlerRootView style={styles.root}>
        <TouchableWithoutFeedback onPress={onDismiss}>
          <Animated.View style={[styles.overlay, overlayStyle]} />
        </TouchableWithoutFeedback>
        
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.sheet, sheetStyle, { paddingBottom: bottomPadding }]}>
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>
            <View style={styles.content}>
              {children}
            </View>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.32)', // A.8: Overlay dim
  },
  sheet: {
    backgroundColor: theme.colors.surface.elevated,
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    // Bottom corners square flush with screen edge
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    ...theme.shadows.elevated,
    width: '100%',
    maxHeight: '90%', // Prevent it from going completely off top
  },
  handleContainer: {
    height: 24, // 8px from top edge + 4px handle + 12px below = 24px total area
    alignItems: 'center',
    paddingTop: 8,
  },
  handle: {
    width: 32,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(138,127,118,0.3)',
  },
  content: {
    paddingHorizontal: theme.spacing.xxl, // 24px horizontal
    paddingTop: 16 - 12, // 16px top below handle (handleContainer already provides 12px gap below handle, so add 4px)
    // paddingBottom is dynamic based on safe area
  },
});
