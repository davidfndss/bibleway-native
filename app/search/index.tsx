import { View, Text, TouchableOpacity, TouchableHighlight } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import nvi from 'assets/json/nvi.json';
import { BibleBook } from 'interfaces/BibleBook';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { NviService } from 'services/nvi-service';
import { useRouter } from 'expo-router';
import truncateString from 'utils/truncateStringWithElipsis';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThreeDotsLoading from 'components/Icons/ThreeDotsLoading';

export default function SearchBooksPage() {
  const [currentText, setCurrentText] = useState<string>('');
  const [isBookSelectionActive, setIsBookSelectionActive] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BibleBook>();
  const [isChapterSelectionActive, setIsChapterSelectionActive] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState();
  const [isVerseSelectionActive, setIsVerseSelectionActive] = useState(false);
  // const [selectedVerse, setSelectedVerse] = useState<number>();
  const [numberOfChapters, setNumberOfChapters] = useState(0);
  const [chaptersArray, setChaptersArray] = useState<number[]>([]);
  const [numberOfVerses, setNumberOfVerses] = useState(0);
  const [versesArray, setVersesArray] = useState<number[]>([]);
  const [searchingBooks, setSearchingBooks] = useState<BibleBook[]>(nvi);
  const [inputError, setInputError] = useState(false);

  const service = new NviService();
  const router = useRouter();

  function handleSearchString(str: String) {
    const [searchTerm, bookName] = str.toLocaleLowerCase().split(' ');
    if (str.length > 0) {
      // Se ainda não tiver livro selecionado, vai tentar pesquisar um livro correspondente com base na string
      if (!selectedBook) {
        setIsBookSelectionActive(true);
        const singleBookFound = searchBook(searchTerm, bookName);

        if (!singleBookFound) {
          setSearchingBooks(nvi.filter((book) => book.name.toLowerCase().includes(searchTerm)));
        } else {
          handleBookSelection(singleBookFound);
        }
      } else {
        // Se ja tiver livro selecionado, vai tentar pesquisar um capitulo com base na string
        if (!selectedChapter) {
          searchChapter(searchTerm);
        } else {
          console.log('chegou aqui');
          searchVerse(searchTerm);
        }
      }
    } else {
      if (selectedBook) {
        setChaptersArray(Array.from({ length: numberOfChapters }, (_, index) => index + 1));
      }
      if (selectedChapter) {
        setVersesArray(Array.from({ length: numberOfVerses }, (_, index) => index + 1));
      }
    }
  }

  // Lida com pesquisas como ex: "Tessa", "2Tessa", "2 Tessa"
  function searchBook(searchTerm: string, bookName: string): BibleBook | null {
    const findBook = (term: string): BibleBook | null => {
      const booksFound = nvi.filter((book) => book.name.toLowerCase().includes(term.toLowerCase()));
      return booksFound.length === 1 ? booksFound[0] : null;
    };

    let result = findBook(searchTerm);
    if (result) return result;

    result = findBook(`${searchTerm} ${bookName}`.trim());
    if (result) return result;

    if (searchTerm.trim().length > 1) {
      result = findBook(`${searchTerm.slice(0, 1)} ${searchTerm.slice(1)}`);
      if (result) return result;
    }

    return null;
  }

  let timeout: NodeJS.Timeout;

  function searchChapter(searchTerm: string) {
    if (Number.isNaN(Number(searchTerm)) || searchTerm.length > 3) {
      setInputError(true);
      return;
    } else {
      setInputError(false);
    }

    const filteredChapters = Array.from(
      { length: numberOfChapters },
      (_, index) => index + 1
    ).filter((c) => c.toString().includes(searchTerm));

    setChaptersArray(filteredChapters);

    // só seleciona se for exatamente igual E não puder continuar digitando
    const exactMatch = filteredChapters.find((c) => {
      const strC = c.toString();
      return strC === searchTerm || strC.padStart(3, '0') === searchTerm;
    });

    if (exactMatch) {
      // só confirma se não houver outros matches que começam igual
      const moreMatchesPossible = filteredChapters.some(
        (c) => c.toString().startsWith(searchTerm) && c.toString() !== searchTerm
      );

      if (!moreMatchesPossible) {
        handleChapterSelection(exactMatch);
      }
    }
  }

  function searchVerse(searchTerm: string) {
    if (Number.isNaN(Number(searchTerm)) || searchTerm.length > 3) {
      setInputError(true);
      return;
    } else {
      setInputError(false);
    }

    const filteredVerses = Array.from({ length: numberOfVerses }, (_, index) => index + 1).filter(
      (c) => c.toString().includes(searchTerm)
    );

    setVersesArray(filteredVerses);

    const exactMatch = filteredVerses.find((c) => {
      const strC = c.toString();
      return strC === searchTerm || strC.padStart(3, '0') === searchTerm;
    });

    if (exactMatch) {
      const moreMatchesPossible = filteredVerses.some(
        (c) => c.toString().startsWith(searchTerm) && c.toString() !== searchTerm
      );

      if (!moreMatchesPossible) {
        handleVerseSelection(exactMatch);
      }
    }
  }

  function handleBookSelection(book: BibleBook) {
    setSelectedBook(book);
    setIsChapterSelectionActive(true);
    setIsBookSelectionActive(false);
    setIsVerseSelectionActive(false);
    setNumberOfChapters(service.getNumberOfChapters(book.abbrev));
    setCurrentText('');
  }

  function handleChapterSelection(chapter: number) {
    setSelectedChapter(chapter);
    setIsVerseSelectionActive(true);
    setIsBookSelectionActive(false);
    setIsChapterSelectionActive(false);
    setNumberOfVerses(service.getNumberOfVerses(selectedBook.abbrev, chapter));
    setCurrentText('');
  }

  const saveSelection = async (book: BibleBook, chapter: number, verse: number) => {
    try {
      await AsyncStorage.setItem('@last_selection', JSON.stringify({ book, chapter, verse }));
    } catch (e) {
      console.error('Erro ao salvar seleção:', e);
    }
  };

  function handleVerseSelection(verse: number) {
    saveSelection(selectedBook, selectedChapter, verse);
    router.push(`/read/nvi/${selectedBook.abbrev}/${selectedChapter}/${verse}`);
  }

  function resetBookSelection() {
    setSelectedBook(undefined);
    setSelectedChapter(undefined);
    setIsChapterSelectionActive(false);
    setIsVerseSelectionActive(false);
    setIsBookSelectionActive(true);
    setSearchingBooks(nvi);
    setChaptersArray(Array.from({ length: numberOfChapters }, (_, index) => index + 1))
  }

  function resetChapterSelection() {
    setSelectedChapter(undefined);
    setIsVerseSelectionActive(false);
    setIsChapterSelectionActive(true);
    setChaptersArray(Array.from({ length: numberOfChapters }, (_, index) => index + 1));
  }

  useEffect(() => {
    handleSearchString(currentText);
  }, [currentText]);

  useEffect(() => {
    setChaptersArray(Array.from({ length: numberOfChapters }, (_, index) => index + 1));
  }, [selectedBook]);

  useEffect(() => {
    setVersesArray(Array.from({ length: numberOfVerses }, (_, index) => index + 1));
  }, [selectedChapter]);

  return (
    <>
      <ScrollView className="h-full w-full bg-c1">
        <View className="mb-10 h-full w-full flex-col items-center justify-start bg-c1 px-6 pb-[10vh] pt-[6vh]">
          {/* <Text className='absolute top-[7vh] w-full z-10 text-zinc-500 font-nowy'>Digite um livro para pesquisar...</Text> */}
          <View className="mb-4 flex w-full flex-row items-center gap-[2vw]">
            <TouchableOpacity
              className="flex h-[12vw] w-[12vw] items-center justify-center rounded-full bg-zinc-900"
              onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={32} color="gray" />
            </TouchableOpacity>
            <View
              className={`w-[75vw] rounded-full border border-zinc-800 ${inputError ? 'bg-red-900' : 'bg-zinc-950'} px-6`}>
              <View className="flex-row items-center justify-between gap-4">
                <TextInput
                  placeholder="Pesquisar"
                  placeholderTextColor="#71717a"
                  className="flex-1 font-nowy text-2xl text-zinc-200 placeholder:text-zinc-700"
                  autoFocus={true}
                  value={currentText}
                  onChange={(e) => setCurrentText(e.nativeEvent.text)}
                />
                <Ionicons name="search" size={24} color="gray" />
              </View>
            </View>
          </View>

          <View className="w-full rounded-full bg-zinc-900 px-4 py-3">
            <View className="flex-row items-center justify-between gap-2">
              <View className="flex-row items-center gap-2">
                {selectedBook && (
                  <TouchableOpacity
                    className="h-[40px] flex-row rounded-full bg-c1 pl-4 pr-6"
                    onPress={() => resetBookSelection()}>
                    <View className="flex-row items-center justify-center gap-2">
                      <Ionicons name="close-circle-outline" size={20} color="gray" />
                      <Text className="text-md font-nowy" style={{ color: '#EEE2CE' }}>
                        {truncateString(selectedBook?.name, 16)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                {selectedChapter && (
                  <TouchableOpacity
                    className="h-[40px] flex-row rounded-full bg-c1 pl-4 pr-6"
                    onPress={() => resetChapterSelection()}>
                    <View className="flex-row items-center justify-center gap-2">
                      <Ionicons name="close-circle-outline" size={20} color="gray" />
                      <Text className="text-md font-nowy" style={{ color: '#EEE2CE' }}>
                        {selectedChapter}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}
                <View
                  className={`h-[40px] flex-row items-center justify-center gap-2 rounded-full bg-c1 ${!selectedBook ? 'px-10' : 'px-4'}`}>
                  <Text className="text-md font-nowy" style={{ color: '#EEE2CE' }}>
                    <ThreeDotsLoading />
                  </Text>
                </View>
                {!selectedBook ? (
                  <>
                    <View className="h-[40px] flex-row items-center justify-center gap-2 rounded-full bg-c1/30 pl-4 pr-6">
                      <Ionicons name="close-circle-outline" size={20} color="transparent" />
                      <Text className="text-md font-nowy" style={{ color: '#EEE2CE' }}></Text>
                    </View>
                    <View className="h-[40px] flex-row items-center justify-center gap-2 rounded-full bg-c1/30 pl-4 pr-6">
                      <Ionicons name="close-circle-outline" size={20} color="transparent" />
                      <Text className="text-md font-nowy" style={{ color: '#EEE2CE' }}></Text>
                    </View>
                  </>
                ) : !selectedChapter ? (
                  <View className="h-[40px] flex-row items-center justify-center gap-2 rounded-full bg-c1/30 pl-4 pr-6">
                    <Ionicons name="close-circle-outline" size={20} color="transparent" />
                    <Text className="text-md font-nowy" style={{ color: '#EEE2CE' }}></Text>
                  </View>
                ) : null}
              </View>
            </View>
          </View>

          {isBookSelectionActive && (
            <View className="mt-4 w-full gap-y-2 px-4 py-4" style={{ borderRadius: 30 }}>
              {searchingBooks.map((book: BibleBook, index: number) => (
                <TouchableOpacity
                  className="flex-row items-center gap-4 rounded-full"
                  key={index}
                  onPress={() => handleBookSelection(book)}>
                  <View className="flex-row items-center gap-4">
                    <Text className="w-[45px] rounded-full bg-zinc-900 py-3 text-center text-lg text-white">
                      {book.abbrev}
                    </Text>
                    <Text className="text-2xl text-white">{book.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {isChapterSelectionActive && (
            <View
              className="mt-4 flex w-full flex-row flex-wrap items-start justify-between gap-y-4 px-4 py-4"
              style={{ borderRadius: 30 }}>
              {numberOfChapters > 0 &&
                chaptersArray.map((chapter) => (
                  <TouchableOpacity
                    className="w-[22%] rounded-full"
                    key={chapter}
                    onPress={() => handleChapterSelection(chapter)}>
                    <Text className="rounded-full bg-zinc-900 py-3 text-center text-2xl text-white">
                      {chapter}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}

          {isVerseSelectionActive && (
            <View
              className="mt-4 flex w-full flex-row flex-wrap items-start justify-between gap-y-4 px-4 py-4"
              style={{ borderRadius: 30 }}>
              {numberOfVerses > 0 &&
                versesArray.map((verse) => (
                  <TouchableOpacity
                    className="w-[22%] rounded-full"
                    key={verse}
                    onPress={() => handleVerseSelection(verse)}>
                    <Text className="rounded-full bg-zinc-900 py-3 text-center text-2xl text-white">
                      {verse}
                    </Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}
