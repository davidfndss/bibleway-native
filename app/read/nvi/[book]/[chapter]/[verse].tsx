import { Animated, View, Text, TouchableOpacity, ActivityIndicator, ScrollView, findNodeHandle, UIManager, PanResponder } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { NviService } from 'services/nvi-service';
import DynamicHeader from 'components/Header/DynamicHeader';
import { BibleBook } from 'interfaces/BibleBook';
import { useFonts } from 'expo-font';
import { useSwipeChapterNavigation } from 'hooks/useSwipeChapterNavigation';
import { useScrollToVerse } from 'hooks/useScrollToVerse';

export default function ReadChapter() {
  const { book, chapter, verse } = useLocalSearchParams<{
    book: string;
    chapter: string;
    verse: string;
  }>();
  const service = new NviService();

  const [chapterData, setChapterData] = useState<string[]>();
  const [fontsLoaded] = useFonts({
    'Nowy-Regular': require('../../../../../assets/fonts/PoltawskiNowy-Regular.ttf'),
    'Nowy-Bold': require('../../../../../assets/fonts/PoltawskiNowy-Bold.ttf'),
  });

  const { scrollViewRef, verseRefs } = useScrollToVerse(Number(verse), chapterData);
  const panResponder = useSwipeChapterNavigation(book, Number(chapter));

  const bookInfo: BibleBook = service.getBookInfoByAbbrev(book);

  useEffect(() => {
    setChapterData(service.getChapter(book, Number(chapter)));
  }, [book, chapter]);

  const scrollY = new Animated.Value(0);

  if (!fontsLoaded || !chapterData) {
    return (
      <View className="w-full h-full items-center justify-center bg-zinc-900">
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  const isChapterOne = Number(chapter) === 1;

  console.log(book, chapter, verse)

  return (
    <View className="bg-zinc-900 flex-1" {...panResponder.panHandlers}>
      <DynamicHeader
        bookIndex={bookInfo.index!}
        bookName={bookInfo.name}
        chapter={Number(chapter)}
        scrollY={scrollY}
      />

      <Animated.ScrollView
        ref={scrollViewRef}
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

          {chapterData.map((v, index) => (
            <TouchableOpacity key={index} className="mb-2" onPress={() => {}}>
              <View
                ref={(ref) => {
                  verseRefs.current[index] = ref;
                }}
              >
                <Text
                  className="text-white text-[20px] rounded-lg leading-tight font-nowy"
                  style={{
                    backgroundColor:
                      index === Number(verse) - 1 ? '#3F3F47' : 'transparent',
                  }}
                >
                  {index + 1}. {v}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}