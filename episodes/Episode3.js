import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolateColor,
} from 'react-native-reanimated';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';

export default function PanGestureStayExample() {
  const animatedValue = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const contextX = useSharedValue(translateX.value);
  const contextY = useSharedValue(translateY.value);
  const animatedStyle = useAnimatedStyle(() => {
    // const backgroundColor=interpolateColor(animatedValue.value,[1,.5],['orange','green'])
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  });
  // const gesture = Gesture.Tap()
  //   .onBegin(() => {
  //     animatedValue.value = withSpring(0.5);
  //   })
  //   .onEnd(() => {
  //     animatedValue.value = withSpring(1);
  //   });

  const gesture = Gesture.Pan()
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
    })
    .onUpdate(event => {
      translateX.value = event.translationX + contextX.value;
      translateY.value = event.translationY + contextY.value;
    })
    .onEnd(() => {
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    });
  return (
    <GestureHandlerRootView
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
    >
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            { width: 100, height: 100, backgroundColor: 'orange' },
            animatedStyle,
          ]}
        />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  box: {
    width: 120,
    height: 120,
    borderRadius: 16,
    backgroundColor: '#00ADB5',
  },
});
