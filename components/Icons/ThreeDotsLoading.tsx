import React, { useEffect, useRef } from "react";
import { View, Animated } from "react-native";

export default function ThreeDotsLoading() {
  const animations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  useEffect(() => {
    const sequence = Animated.sequence(
      animations.map(anim =>
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }),
        ])
      )
    );

    const loop = Animated.loop(sequence);
    loop.start();

    return () => loop.stop();
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
      }}
    >
      {animations.map((anim, i) => {
        const height = anim.interpolate({
          inputRange: [0, 1],
          outputRange: [8, 24],
        });

        return (
          <Animated.View
            key={i}
            style={{
              width: 8,
              height,
              borderRadius: 200,
              backgroundColor: "gray",
            }}
          />
        );
      })}
    </View>
  );
}
