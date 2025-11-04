import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  Directions,
} from 'react-native-gesture-handler';

const { width } = Dimensions.get('window');

export default function AllGesturesDemo() {
  /* ---------------- LONG PRESS ---------------- */
  const lpScale = useSharedValue(1);
  const lpColor = useSharedValue('orange');

  const longPress = Gesture.LongPress()
    .minDuration(600)
    .onStart(() => {
      lpScale.value = withSpring(1.3);
      lpColor.value = 'red';
    })
    .onEnd(() => {
      lpScale.value = withSpring(1);
      lpColor.value = 'orange';
    });

  const longPressStyle = useAnimatedStyle(() => ({
    transform: [{ scale: lpScale.value }],
    backgroundColor: lpColor.value,
  }));

  /* ---------------- FLING ---------------- */
  const translateX = useSharedValue(0);
  const MAX_OFFSET = width / 2 - 60;

  const flingRight = Gesture.Fling()
    .direction(Directions.RIGHT)
    .onEnd(() => {
      translateX.value = withSpring(
        Math.min(translateX.value + 100, MAX_OFFSET),
      );
    });

  const flingLeft = Gesture.Fling()
    .direction(Directions.LEFT)
    .onEnd(() => {
      translateX.value = withSpring(
        Math.max(translateX.value - 100, -MAX_OFFSET),
      );
    });

  const flingGesture = Gesture.Simultaneous(flingLeft, flingRight);

  const flingStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  /* ---------------- PINCH ---------------- */
  const pinchScale = useSharedValue(1);

  const pinch = Gesture.Pinch()
    .onUpdate(event => {
      pinchScale.value = event.scale;
    })
    .onEnd(() => {
      pinchScale.value = withSpring(1);
    });

  const pinchStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pinchScale.value }],
  }));

  /* ---------------- ROTATION ---------------- */
  const rotation = useSharedValue(0);

  const rotateGesture = Gesture.Rotation()
    .onUpdate(event => {
      rotation.value = event.rotation;
    })
    .onEnd(() => {
      rotation.value = withSpring(0);
    });

  const rotateStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}rad` }],
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ---- Long Press ---- */}
        <Text style={styles.sectionTitle}>🟠 Long Press Gesture</Text>
        <GestureDetector gesture={longPress}>
          <Animated.View style={[styles.box, longPressStyle]}>
            <Text style={styles.text}>Hold Me 🔥</Text>
          </Animated.View>
        </GestureDetector>

        {/* ---- Fling ---- */}
        <Text style={styles.sectionTitle}>🟣 Fling Gesture (Left / Right)</Text>
        <GestureDetector gesture={flingGesture}>
          <Animated.View style={[styles.box, styles.flingBox, flingStyle]}>
            <Text style={styles.text}>👈 Fling 👉</Text>
          </Animated.View>
        </GestureDetector>

        {/* ---- Pinch ---- */}
        <Text style={styles.sectionTitle}>🟢 Pinch Gesture (Zoom In/Out)</Text>
        <GestureDetector gesture={pinch}>
          <Animated.Image
            source={require('../src/cube.png')}
            style={[styles.image, pinchStyle]}
          />
        </GestureDetector>

        {/* ---- Rotation ---- */}
        <Text style={styles.sectionTitle}>🔵 Rotation Gesture</Text>
        <GestureDetector gesture={rotateGesture}>
          <Animated.View style={[styles.box, styles.rotateBox, rotateStyle]}>
            <Text style={styles.text}>🔄 Rotate</Text>
          </Animated.View>
        </GestureDetector>
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 50,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  box: {
    width: 150,
    height: 150,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flingBox: {
    backgroundColor: '#ff8c00',
    shadowColor: '#ff8c00',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  rotateBox: {
    backgroundColor: '#9c27b0',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
