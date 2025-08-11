import { useEffect, useRef } from 'react';
import { ScrollView, View, findNodeHandle, UIManager } from 'react-native';

export function useScrollToVerse(verse: number, chapterData?: string[]) {
  const scrollViewRef = useRef<ScrollView>(null);
  const verseRefs = useRef<(View | null)[]>([]);

  useEffect(() => {
    if (!chapterData || !verse) return;

    const verseIndex = verse - 1;
    const targetRef = verseRefs.current[verseIndex];
    const scrollRef = scrollViewRef.current;

    if (!targetRef || !scrollRef) return;

    const targetNode = findNodeHandle(targetRef);
    const scrollNode = findNodeHandle(scrollRef);

    if (targetNode && scrollNode) {
      UIManager.measureLayout(
        targetNode,
        scrollNode,
        () => console.warn('Erro ao medir layout'),
        (_, y) => {
          scrollRef.scrollTo({ y: y - 120, animated: true });
        }
      );
    }
  }, [chapterData, verse]);

  return { scrollViewRef, verseRefs };
}
