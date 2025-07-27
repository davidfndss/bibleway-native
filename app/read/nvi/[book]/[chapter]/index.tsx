import { Animated, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { NviService } from 'services/nvi-service';
import { Ionicons } from '@expo/vector-icons';
import DynamicHeader from 'components/Header/DynamicHeader';
import { BibleBook } from 'interfaces/BibleBook';
import { useFonts } from 'expo-font';

export default function ReadChapter() {
  const { book, chapter, verse } = useLocalSearchParams<{ book: string; chapter: string; verse: string }>();
  const [chapterData, setChapterData] = useState<string[]>();
  const scrollY = useRef(new Animated.Value(0)).current;

  const service = new NviService();
  const bookInfo: BibleBook = service.getBookInfoByAbbrev(book);

  const [fontsLoaded] = useFonts({
    'Nowy-Regular': require('../../../../../assets/fonts/PoltawskiNowy-Regular.ttf'),
    'Nowy-Bold': require('../../../../../assets/fonts/PoltawskiNowy-Bold.ttf'),
  });

  useEffect(() => {
    setChapterData(service.getChapter(book, Number(chapter)));
  }, []);

  if (!fontsLoaded || !chapterData) {
    return (
      <View className="w-full h-full items-center justify-center bg-zinc-900">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  const isChapterOne = Number(chapter) === 1;

  return (
    <View className="bg-zinc-900 flex-1">
      <DynamicHeader
        bookIndex={bookInfo.index!}
        bookName={bookInfo.name}
        chapter={Number(chapter)}
        scrollY={scrollY}
      />

      <Animated.ScrollView
        className="w-full h-full bg-c1"
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View
          className="w-full flex flex-col items-start justify-start px-4 mb-20"
          style={{ marginTop: isChapterOne ? 330 : 140 }}
        >
          <Text className="text-white text-5xl mb-10 font-nowyb">
            {bookInfo.name} {chapter}
          </Text>
          {chapterData.map((verse, index) => (
            <TouchableOpacity key={index} className="mb-2" onPress={() => {}}>
              <Text className="text-white text-[20px] leading-tight font-nowy">
                {index + 1}. {verse}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}