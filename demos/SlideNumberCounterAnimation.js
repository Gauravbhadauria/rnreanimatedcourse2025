// TranslateCounter.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

export default function TranslateCounter() {
  const [count, setCount] = useState(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const animateChange = (newCount, direction = 1) => {
    // direction = 1 → slide up, -1 → slide down
    translateY.value = 0;
    opacity.value = 1;

    translateY.value = withSequence(
      withTiming(-40 * direction, {
        duration: 180,
        easing: Easing.out(Easing.quad),
      }),
      withTiming(40 * direction, { duration: 0 }), // jump to other side
      withTiming(0, { duration: 180, easing: Easing.out(Easing.quad) }),
    );

    opacity.value = withSequence(
      withTiming(0, { duration: 150 }),
      withTiming(1, { duration: 150 }),
    );

    // Update state halfway through animation
    setTimeout(() => setCount(newCount), 150);
  };

  const handleIncrease = () => animateChange(count + 1, 1);
  const handleDecrease = () => animateChange(count - 1, -1);

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔢 Slide Counter (Text Only)</Text>

      <View style={styles.numberBox}>
        <Animated.Text style={[styles.numberText, animatedTextStyle]}>
          {count}
        </Animated.Text>
      </View>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          onPress={handleDecrease}
          style={[styles.btn, { backgroundColor: '#e74c3c' }]}
        >
          <Text style={styles.btnText}>–</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleIncrease}
          style={[styles.btn, { backgroundColor: '#4CAF50' }]}
        >
          <Text style={styles.btnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- STYLES ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: '#f9d423',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 40,
  },
  numberBox: {
    width: 140,
    height: 160,
    borderRadius: 20,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    marginBottom: 60,
    overflow: 'hidden', // important: hides sliding text overflow
  },
  numberText: {
    color: '#fff',
    fontSize: 100,
    fontWeight: '900',
    position: 'absolute', // make sure text can move freely
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  btn: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '800',
  },
});
