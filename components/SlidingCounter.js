import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import { useState } from "react";
import { useCallback } from "react";

const ICON_SIZE = 20;

const clamp = (value, min, max) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

const BUTTON_WIDTH = 170;
const MAX_SLIDE_OFFSET = BUTTON_WIDTH * 0.3;

const SlidingCounter = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const [count, setCount] = useState(0);

  const incrementCount = useCallback(() => {
    setCount((currentCount) => currentCount + 1);
  });
  const dicrementCount = useCallback(() => {
    setCount((currentCount) => currentCount - 1);
  });

  const onPanGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      console.log(event.translationX);
      translateX.value = clamp(
        event.translationX,
        -MAX_SLIDE_OFFSET,
        MAX_SLIDE_OFFSET
      );
      translateY.value = clamp(
        event.translationY,
        -MAX_SLIDE_OFFSET,
        MAX_SLIDE_OFFSET
      );
    },
    onEnd: () => {
      if (translateX.value === MAX_SLIDE_OFFSET) {
        runOnJS(incrementCount)();
      } else if (translateX.value === -MAX_SLIDE_OFFSET) {
        runOnJS(dicrementCount)();
      }
      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  }, []);

  const rPlusMinusIconStyle = useAnimatedStyle(() => {
    const opacityX = interpolate(
      translateX.value,
      [-MAX_SLIDE_OFFSET, 0, MAX_SLIDE_OFFSET],
      [0.4, 0.8, 0.4]
    );

    const opacityY = interpolate(
      translateY.value,
      [0, MAX_SLIDE_OFFSET],
      [1, 0]
    );

    return {
      opacity: opacityX * opacityY,
    };
  }, []);

  const rCloseIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MAX_SLIDE_OFFSET],
      [0, 0.8]
    );
    return {
      opacity,
    };
  }, []);

  return (
    <View style={styles.button}>
      <Animated.View style={rPlusMinusIconStyle}>
        <AntDesign name="minus" color={"white"} size={ICON_SIZE} />
      </Animated.View>

      <Animated.View style={rCloseIconStyle}>
        <AntDesign name="close" color={"white"} size={ICON_SIZE} />
      </Animated.View>

      <Animated.View style={rPlusMinusIconStyle}>
        <AntDesign name="plus" color={"white"} size={ICON_SIZE} />
      </Animated.View>

      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <Animated.View style={[styles.circle, rStyle]}>
            <Text style={styles.countText}>{count}</Text>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

export default SlidingCounter;

const styles = StyleSheet.create({
  button: {
    height: 70,
    width: BUTTON_WIDTH,
    backgroundColor: "#111111",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  countText: {
    fontSize: 25,
    color: "white",
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#232323",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
});
