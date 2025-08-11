import { useRef } from 'react';
import { PanResponder } from 'react-native';
import { useRouter } from 'expo-router';
import { NviService } from 'services/nvi-service';
import { BibleBook } from 'interfaces/BibleBook';

export function useSwipeChapterNavigation(book: string, chapter: number) {
  const router = useRouter();
  const service = new NviService();
  const bookInfo: BibleBook = service.getBookInfoByAbbrev(book);

  const goToNextChapter = () => {
    const totalChapters = service.getNumberOfChapters(book);
    if (chapter < totalChapters) {
      router.replace(`/read/nvi/${book}/${chapter + 1}`);
    } else {
      const nextBookInfo = service.getBookInfoByIndex(bookInfo.index! + 1);
      if (nextBookInfo) {
        router.replace(`/read/nvi/${nextBookInfo.abbrev}/1`);
      }
    }
  };

  const goToPreviousChapter = () => {
    if (chapter > 1) {
      router.replace(`/read/nvi/${book}/${chapter - 1}`);
    } else {
      const prevBookInfo = service.getBookInfoByIndex(bookInfo.index! - 1);
      if (prevBookInfo) {
        const lastChapter = service.getNumberOfChapters(prevBookInfo.abbrev);
        router.replace(`/read/nvi/${prevBookInfo.abbrev}/${lastChapter}`);
      }
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) =>
        Math.abs(gesture.dx) > Math.abs(gesture.dy) && Math.abs(gesture.dx) > 20,
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -50) goToNextChapter();
        else if (gesture.dx > 50) goToPreviousChapter();
      },
    })
  ).current;

  return panResponder;
}
