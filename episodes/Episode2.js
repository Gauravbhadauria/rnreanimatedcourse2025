import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const Episode2 = () => {
  const animatedValue = useSharedValue(0);

  const animatedStyled = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedValue.value,
      [0, 50, 100, 150],
      [1, 0.7, 0.4, 0.1],
    );

    return {
      transform: [{ translateX: animatedValue.value }],
      opacity,
      backgroundColor: interpolateColor(
        animatedValue.value,
        [0, 50, 100, 150],
        ['red', 'orange', 'yellow', 'green'],
      ),
    };
  });
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 100,
      }}
    >
      <Animated.View
        style={[
          { width: 100, height: 100, backgroundColor: 'red' },
          animatedStyled,
        ]}
      ></Animated.View>
      <TouchableOpacity
        style={{ padding: 10, borderWidth: 1 }}
        onPress={() => {
          if (animatedValue.value == 150) {
            animatedValue.value = withTiming(0, { duration: 1000 });
          } else {
            animatedValue.value = withTiming(150, { duration: 1000 });
          }
        }}
      >
        <Text>Start Interpolation</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Episode2;
