import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useDerivedValue,
  runOnJS,
} from 'react-native-reanimated';

const BUTTON_WIDTH = 80;
const LEFT_BUTTONS = 2;
const RIGHT_BUTTONS = 2;
const LEFT_ACTION_WIDTH = LEFT_BUTTONS * BUTTON_WIDTH;
const RIGHT_ACTION_WIDTH = RIGHT_BUTTONS * BUTTON_WIDTH;

const data = [
  { id: '1', title: 'Engineer Codewala Group' },
  { id: '2', title: 'React Dev Chat' },
  { id: '3', title: 'Firebase Testers' },
  { id: '4', title: 'UI/UX Feedback' },
];

export default function ChatList() {
  const openRowId = useSharedValue(null);

  const renderItem = ({ item }) => (
    <SwipeRow item={item} openRowId={openRowId} />
  );

  return (
    <GestureHandlerRootView style={styles.root}>
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 20, marginTop: 50 }}
      />
    </GestureHandlerRootView>
  );
}

function SwipeRow({ item, openRowId }) {
  const translateX = useSharedValue(0);

  // 🧠 Auto-close logic: React to openRowId changes
  useDerivedValue(() => {
    if (openRowId.value !== item.id && translateX.value !== 0) {
      translateX.value = withTiming(0, { duration: 300 });
    }
  });

  const closeRow = () => {
    translateX.value = withTiming(0, { duration: 300 });
    openRowId.value = null;
  };

  const pan = Gesture.Pan()
    .onBegin(() => {
      // Close previously open row immediately
      if (openRowId.value && openRowId.value !== item.id) {
        openRowId.value = null;
      }
    })
    .onUpdate(event => {
      translateX.value = event.translationX;
    })
    .onEnd(() => {
      if (translateX.value < -80) {
        translateX.value = withSpring(-RIGHT_ACTION_WIDTH);
        openRowId.value = item.id;
      } else if (translateX.value > 80) {
        translateX.value = withSpring(LEFT_ACTION_WIDTH);
        openRowId.value = item.id;
      } else {
        translateX.value = withSpring(0);
        openRowId.value = null;
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    zIndex: 2,
  }));

  return (
    <View style={styles.outerRow}>
      <View style={styles.rowContainer}>
        {/* BACKGROUND BUTTONS */}
        <View style={styles.backgroundContainer}>
          {/* RIGHT SWIPE (Unread + Pin) */}
          <View style={styles.leftActions}>
            <ActionButton
              color="#22c55e"
              icon="💬"
              label="Unread"
              onPress={() => {
                Alert.alert('Marked Unread', item.title);
                runOnJS(closeRow)();
              }}
            />
            <ActionButton
              color="#555"
              icon="📌"
              label="Pin"
              onPress={() => {
                Alert.alert('Pinned', item.title);
                runOnJS(closeRow)();
              }}
            />
          </View>

          {/* LEFT SWIPE (More + Archive) */}
          <View style={styles.rightActions}>
            <ActionButton
              color="#555"
              icon="•••"
              label="More"
              onPress={() => {
                Alert.alert('More', item.title);
                runOnJS(closeRow)();
              }}
            />
            <ActionButton
              color="#22c55e"
              icon="📦"
              label="Archive"
              onPress={() => {
                Alert.alert('Archived', item.title);
                runOnJS(closeRow)();
              }}
            />
          </View>
        </View>

        {/* FOREGROUND CARD */}
        <GestureDetector gesture={pan}>
          <Animated.View style={[styles.card, cardStyle]}>
            <Text style={styles.chatTitle}>{item.title}</Text>
            <Text style={styles.chatSubtitle}>You: Hello 👋</Text>
          </Animated.View>
        </GestureDetector>
      </View>
    </View>
  );
}

const ActionButton = ({ color, icon, label, onPress }) => (
  <TouchableOpacity
    style={[styles.actionBtn, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={styles.iconText}>{icon}</Text>
    <Text style={styles.labelText}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  outerRow: { width: '100%', alignItems: 'center' },
  rowContainer: {
    width: '90%',
    height: 70,
    marginVertical: 6,
    overflow: 'hidden',
    borderRadius: 12,
    position: 'relative',
    justifyContent: 'center',
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 0,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 15,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  actionBtn: {
    width: BUTTON_WIDTH,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: { color: '#fff', fontSize: 20, marginBottom: 3 },
  labelText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  card: {
    backgroundColor: '#121212',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    paddingHorizontal: 15,
    zIndex: 2,
    elevation: 2,
  },
  chatTitle: { color: '#fff', fontSize: 16, fontWeight: '700' },
  chatSubtitle: { color: '#999', fontSize: 13, marginTop: 2 },
});
