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

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedValue.value, [0, 50, 100], [1, 0.5, 1]);
    const backgroundColor = interpolateColor(
      animatedValue.value,
      [0, 50, 100],
      ['red', 'orange', 'red'],
    );

    const width = interpolate(
      animatedValue.value,
      [0, 50, 100],
      [100, 50, 100],
    );
    const height = interpolate(
      animatedValue.value,
      [0, 50, 100],
      [100, 50, 100],
    );

    return {
      transform: [{ translateX: animatedValue.value }],
      opacity,
      backgroundColor,
      width,
      height,
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
          animatedStyle,
        ]}
      ></Animated.View>
      <TouchableOpacity
        style={{ padding: 10, borderWidth: 1 }}
        onPress={() => {
          if (animatedValue.value == 0) {
            animatedValue.value = withTiming(100, { duration: 1000 });
          } else {
            animatedValue.value = withTiming(0, { duration: 1000 });
          }
        }}
      >
        <Text>Start Animation</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Episode2;

//[ 0---->100]
//[ 1---->.5]
