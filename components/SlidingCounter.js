import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";

const ICON_SIZE = 20;

const SlidingCounter = () => {
  const translateX = useSharedValue(0);

  const onPanGestureEvent = useAnimatedGestureHandler({
    onActive: (event) => {
      console.log(event.translationX);
      translateX.value = event.translationX;
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  }, []);

  return (
    <View style={styles.button}>
      <AntDesign name="minus" color={"white"} size={ICON_SIZE} />
      <AntDesign name="close" color={"white"} size={ICON_SIZE} />
      <AntDesign name="plus" color={"white"} size={ICON_SIZE} />
      <View
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PanGestureHandler onGestureEvent={onPanGestureEvent}>
          <Animated.View style={[styles.circle, rStyle]} />
        </PanGestureHandler>
      </View>
    </View>
  );
};

export default SlidingCounter;

const styles = StyleSheet.create({
  button: {
    height: 70,
    width: 170,
    backgroundColor: "#111111",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#232323",
    position: "absolute",
  },
});
