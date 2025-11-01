import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
  Extrapolation,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');
const SHEET_HEIGHT = height;

export default function SpotifyGestureConnected() {
  const translateY = useSharedValue(SHEET_HEIGHT);
  const context = useSharedValue({ y: 0 });

  // Shared Gesture (for mini + full player)
  const gesture = Gesture.Pan()
    .onStart(() => {
      context.value = { y: translateY.value };
    })
    .onUpdate(event => {
      translateY.value = context.value.y + event.translationY;
      translateY.value = Math.min(Math.max(translateY.value, 0), SHEET_HEIGHT);
    })
    .onEnd(() => {
      if (translateY.value > SHEET_HEIGHT / 2) {
        translateY.value = withSpring(SHEET_HEIGHT, {
          damping: 25,
          stiffness: 120,
          overshootClamping: true,
        });
      } else {
        translateY.value = withSpring(0, {
          damping: 25,
          stiffness: 120,
          overshootClamping: true,
        });
      }
    });

  // Full player style
  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    borderTopLeftRadius: interpolate(
      translateY.value,
      [0, SHEET_HEIGHT],
      [20, 25],
      Extrapolate.CLAMP,
    ),
    borderTopRightRadius: interpolate(
      translateY.value,
      [0, SHEET_HEIGHT],
      [20, 25],
      Extrapolate.CLAMP,
    ),
  }));

  // Mini player fade
  const miniPlayerStyle = useAnimatedStyle(() => {
    console.log(' translateY.value', translateY.value);
    const opacity = interpolate(
      translateY.value,
      [
        SHEET_HEIGHT - 200,
        SHEET_HEIGHT - 180,
        SHEET_HEIGHT - 150,
        SHEET_HEIGHT - 100,
      ],
      [0, 0.5, 0.6, 1], // full opacity when player near closed
      // Extrapolate.CLAMP,
    );

    return {
      opacity, // fade out earlier
    };
  });

  // Bottom nav slide
  const bottomNavStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          translateY.value,
          [0, SHEET_HEIGHT / 1.5],
          [100, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
    opacity: interpolate(
      translateY.value,
      [0, SHEET_HEIGHT / 2],
      [0, 1],
      Extrapolate.CLAMP,
    ),
  }));

  return (
    // inside render section

    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <GestureDetector gesture={gesture}>
          <Animated.View style={{ flex: 1, width: '100%' }}>
            {/* Full Player Behind Mini */}
            <Animated.View style={[styles.sheet, sheetStyle, { zIndex: 1 }]}>
              <View style={styles.handle} />
              <Text style={styles.sheetTitle}>Full Player</Text>
              <Text style={styles.sheetText}>Drag down to minimize</Text>
            </Animated.View>

            {/* Mini Player (on top) */}
            <Animated.View
              style={[styles.miniPlayer, miniPlayerStyle, { zIndex: 2 }]}
            >
              <Text style={styles.miniText}>🎵 Now Playing...</Text>
              <Text style={styles.miniSubText}>Drag up to open</Text>
            </Animated.View>
          </Animated.View>
        </GestureDetector>

        {/* Bottom Navigation */}
        <Animated.View style={[styles.bottomNav, bottomNavStyle]}>
          <View style={styles.navItem}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text style={styles.navLabel}>Home</Text>
          </View>

          <View style={styles.navItem}>
            <Text style={styles.navIcon}>🔍</Text>
            <Text style={styles.navLabel}>Search</Text>
          </View>

          <View style={styles.navItem}>
            <Text style={styles.navIcon}>📁</Text>
            <Text style={styles.navLabel}>Library</Text>
          </View>
        </Animated.View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(60, 36, 36, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
  },

  miniPlayer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'rgba(0,0,0,.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  miniSubText: { color: '#ccc', fontSize: 13, marginTop: 4 },

  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: SHEET_HEIGHT,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    paddingTop: 20,
  },
  handle: {
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  sheetTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  sheetText: { color: '#eee', marginTop: 10, fontSize: 14 },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#222',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  navText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 22,
    color: '#fff',
  },
  navLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});
