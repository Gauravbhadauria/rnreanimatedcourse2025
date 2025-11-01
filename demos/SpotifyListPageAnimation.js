import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

const DATA = Array.from({ length: 20 }).map((_, i) => ({
  id: i,
  title: `Playlist Item ${i + 1}`,
  subtitle: 'Best vibes • Chill Beats 🎧',
}));

const SpotifyListPageAnimation = () => {
  const scrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler({
    onScroll: e => {
      console.log(e.contentOffset.y);
      scrollY.value = e.contentOffset.y;
    },
  });

  const imageStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [80, 220],
      [1, 0],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [80, 220],
      [0, -20],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      scrollY.value,
      [80, 220],
      [1, 0.7],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }, { scale }],
    };
  });

  const headerStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [180, 260], // smoother transition
      [0, 1],
      Extrapolation.CLAMP,
    );

    return { opacity };
  });

  const titleStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      scrollY.value,
      [180, 260], // title slides same time header appears
      [30, 0], // 30px down → 0 px center
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }],
    };
  });
  const searchStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 120],
      [1, 0],
      Extrapolation.CLAMP,
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 120],
      [0, -30],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      {/* ANIMATED BANNER IMAGE */}
      {/* SEARCH BOX ON BANNER */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 55,
            alignSelf: 'center',
            width: '85%',
            height: 45,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 10,
            justifyContent: 'center',
            paddingHorizontal: 14,
            zIndex: 5,
          },
          searchStyle,
        ]}
      >
        <Text style={{ color: '#fff', opacity: 0.8 }}>Search</Text>
      </Animated.View>

      <Animated.Image
        source={require('../src/logo.jpg')}
        style={[styles.banner, imageStyle]}
      />

      {/* SCROLL LIST */}
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 420, paddingBottom: 40 }}
      >
        {DATA.map(item => (
          <View key={item.id} style={styles.row}>
            <View style={styles.thumb} />
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>
          </View>
        ))}
      </Animated.ScrollView>
      <Animated.View
        style={[
          {
            width: '100%',
            height: 100,
            backgroundColor: 'rgb(35, 18, 76)',
            position: 'absolute',
            top: 0,
            zIndex: 10,
            justifyContent: 'flex-end',
            paddingBottom: 10,
          },
          headerStyle,
        ]}
      >
        <View style={{ width: '100%', alignItems: 'center' }}>
          <Animated.Text
            style={[
              { color: '#fff', fontSize: 18, fontWeight: '700' },
              titleStyle,
            ]}
          >
            Playlist Name
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
};

export default SpotifyListPageAnimation;

const styles = StyleSheet.create({
  banner: {
    width: 280,
    height: 280,
    alignSelf: 'center',
    position: 'absolute',
    top: 120,
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 0.3,
    borderColor: '#222',
  },
  thumb: {
    width: 58,
    height: 58,
    backgroundColor: '#444',
    borderRadius: 8,
  },
  title: { color: '#fff', fontSize: 16, fontWeight: '700' },
  subtitle: { color: '#bbb', fontSize: 13, marginTop: 3 },
});
