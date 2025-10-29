import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const App = () => {
  const animatedValue = useSharedValue(1);
  const animatedHeight = useSharedValue(100);
  const animatedWidth = useSharedValue(100);
  // useAnimatedStyle==> provides animated Style

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: animatedValue.value,
      height: animatedHeight.value,
      width: animatedWidth.value,
    };
  });
  console.log('rerender again ');
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
        onPress={() => {
          if (animatedHeight.value == 100) {
            animatedHeight.value = withRepeat(withSpring(50), -1, true);
            animatedWidth.value = withRepeat(withSpring(50), -1, true);
          } else {
            cancelAnimation(animatedHeight);
            cancelAnimation(animatedWidth);
          }
        }}
      >
        <Text>Change opacity</Text>
      </TouchableOpacity>
    </View>
  );
};

export default App;
