import React from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');
const SLIDER_WIDTH = width - 60;
const THUMB_SIZE = 60;

export default function SlideToOrder() {
  const translateX = useSharedValue(0);

  const confirmOrder = () => {
    Alert.alert(
      '✅ Order Confirmed!',
      'Your order has been placed successfully.',
    );
  };

  const pan = Gesture.Pan()
    .onChange(event => {
      // Move thumb but not outside track
      translateX.value = Math.min(
        Math.max(0, translateX.value + event.changeX),
        SLIDER_WIDTH - THUMB_SIZE,
      );
    })
    .onEnd(() => {
      if (translateX.value > SLIDER_WIDTH - THUMB_SIZE - 10) {
        // Trigger order confirmation
        runOnJS(confirmOrder)();
        translateX.value = withTiming(0, { duration: 500 }); // Reset slider
      } else {
        // Reset position smoothly
        translateX.value = withSpring(0);
      }
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: translateX.value + THUMB_SIZE / 2,
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.title}>🛒 Slide to Order</Text>

      <View style={styles.sliderTrack}>
        <Animated.View style={[styles.progress, progressStyle]} />
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.thumb, thumbStyle]}>
            <Text style={styles.thumbText}>👉</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  sliderTrack: {
    width: SLIDER_WIDTH,
    height: THUMB_SIZE,
    backgroundColor: '#333',
    borderRadius: THUMB_SIZE / 2,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(121, 255, 121, 0.5)',
    // borderRadius: THUMB_SIZE / 2,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: '#ff8c00',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  thumbText: {
    fontSize: 24,
    color: '#fff',
  },
});
