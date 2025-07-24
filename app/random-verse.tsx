import { Verse } from 'interfaces/Verse';
import React, { useEffect, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import getRandomVerse from 'utils/random-verse';

const { width } = Dimensions.get('window');

function getRandomColor() {
  const r = Math.floor(Math.random() * 200);
  const g = Math.floor(Math.random() * 200);
  const b = Math.floor(Math.random() * 200);
  return `rgb(${r}, ${g}, ${b})`;
}

export default function InfiniteScreens() {
  const [screens, setScreens] = useState([{ color: getRandomColor() }]);
  const [index, setIndex] = useState(0);
  const [randomVerse, setRandomVerse] = useState<Verse>()
  const translateX = useSharedValue(0);

  useEffect(() => {
    setRandomVerse(getRandomVerse())
  }, [index])

  const goTo = (newIndex: number) => {
    if (newIndex < 0) return;

    if (newIndex >= screens.length) {
      setScreens([...screens, { color: getRandomColor() }]);
    }

    translateX.value = withTiming(-newIndex * width, { duration: 300 });
    setIndex(newIndex);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onEnd: (event) => {
      const threshold = 50;
      let nextIndex = index;

      if (event.translationX < -threshold) {
        nextIndex = index + 1;
      } else if (event.translationX > threshold) {
        nextIndex = index - 1;
      }

      runOnJS(goTo)(nextIndex);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      flexDirection: 'row',
    };
  });

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View style={[{ flex: 1, flexDirection: 'row' }, animatedStyle]}>
        {screens.map((screen, i) => (
          <View
            key={i}
            style={{
              width,
              height: '100%',
              backgroundColor: screen.color,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Text className='px-4 text-white text-3xl'>{randomVerse?.verse}</Text>
            <View className='px-4 flex flex-row w-full gap-2 mt-2'>
                <Text className='text-white text-2xl'>{randomVerse?.book.name}</Text>
                <View className='flex flex-row w-full'>
                    <Text className='text-white text-2xl'>{randomVerse?.chapter}</Text>
                    <Text className='text-white text-2xl'>:</Text>
                    <Text className='text-white text-2xl'>{randomVerse?.index}</Text>
                </View>
            </View>
          </View>
        ))}
      </Animated.View>
    </PanGestureHandler>
  );
}