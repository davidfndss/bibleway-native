import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import nvi from 'assets/json/nvi.json'
import { BibleBook } from 'interfaces/BibleBook'
import { ScrollView } from 'react-native-gesture-handler'
import { NviService } from 'services/nvi-service'
import { useRouter } from 'expo-router'
import truncateString from 'utils/truncateStringWithElipsis'
import AsyncStorage from '@react-native-async-storage/async-storage'
import SearchBooks from 'components/SearchBooks/SearchBooks'

export default function Select() {
  const [isBookSelectionActive, setIsBookSelectionActive] = useState(false)
  const [selectedBook, setSelectedBook] = useState<BibleBook>(nvi[0])
  const [isChapterSelectionActive, setIsChapterSelectionActive] = useState(false)
  const [selectedChapter, setSelectedChapter] = useState(1)
  const [isVerseSelectionActive, setIsVerseSelectionActive] = useState(false)
  const [selectedVerse, setSelectedVerse] = useState(1)
  const [numberOfChapters, setNumberOfChapters] = useState(0)
  const [numberOfVerses, setNumberOfVerses] = useState(0)

  const service = new NviService()
  const router = useRouter()

  const saveSelection = async (book: BibleBook, chapter: number, verse: number) => {
    try {
      await AsyncStorage.setItem('@last_selection', JSON.stringify({ book, chapter, verse }))
    } catch (e) {
      console.error('Erro ao salvar seleção:', e)
    }
  }

  function handleBookSelection(book: BibleBook) {
    setSelectedBook(book)
    setIsChapterSelectionActive(true)
    setIsBookSelectionActive(false)
    setIsVerseSelectionActive(false)
    setNumberOfChapters(service.getNumberOfChapters(book.abbrev))
    saveSelection(book, 1, 1)
  }

  function handleChapterSelection(chapter: number) {
    setSelectedChapter(chapter)
    setIsVerseSelectionActive(true)
    setIsBookSelectionActive(false)
    setIsChapterSelectionActive(false)
    setNumberOfVerses(service.getNumberOfVerses(selectedBook.abbrev, chapter))
    saveSelection(selectedBook, chapter, 1)
  }

  function handleVerseSelection(verse: number) {
    setSelectedVerse(verse)
    setIsVerseSelectionActive(false)
    setIsChapterSelectionActive(false)
    setIsBookSelectionActive(false)
    saveSelection(selectedBook, selectedChapter, verse)
  }

  useEffect(() => {
    const loadSelection = async () => {
      try {
        const saved = await AsyncStorage.getItem('@last_selection')
        if (saved) {
          const { book, chapter, verse } = JSON.parse(saved)
          setSelectedBook(book)
          setSelectedChapter(chapter)
          setSelectedVerse(verse)
          setNumberOfChapters(service.getNumberOfChapters(book.abbrev))
          setNumberOfVerses(service.getNumberOfVerses(book.abbrev, chapter))
        } else {
          setSelectedBook(nvi[0])
          setSelectedChapter(1)
          setSelectedVerse(1)
          setNumberOfChapters(service.getNumberOfChapters(nvi[0].abbrev))
          setNumberOfVerses(service.getNumberOfVerses(nvi[0].abbrev, 1))
        }
      } catch (e) {
        console.error('Erro ao carregar seleção:', e)
      }
    }

    loadSelection()
  }, [])

  return (
    <>
      <ScrollView className="w-full h-full bg-c1">
        <View className="w-full h-full px-6 pb-[10vh] pt-[6vh] mb-10 flex-col items-center justify-start bg-c1">
          <SearchBooks />
          <TouchableOpacity
            className="w-full py-4 px-4 bg-zinc-900 rounded-full"
            onPress={() => {
              setIsBookSelectionActive(!isBookSelectionActive)
              setIsChapterSelectionActive(false)
              setIsVerseSelectionActive(false)
            }}
          >
            <View className="flex-row gap-4 items-center justify-between">
              <View className="flex-row gap-4 items-center">
                <View className="h-[40px] w-[60px] flex items-center justify-center rounded-full bg-c1">
                  <Text className="text-xl font-nowy" style={{ color: '#EEE2CE' }}>
                    {selectedBook?.abbrev.toUpperCase()}
                  </Text>
                </View>
                <Text className="text-white text-3xl font-nowy">{truncateString(selectedBook?.name, 16)}</Text>
              </View>
              <Ionicons name="chevron-down" size={24} color="white" />
            </View>
          </TouchableOpacity>

          {isBookSelectionActive && (
            <View className="w-full py-4 px-4 bg-zinc-900 gap-y-2 mt-4" style={{ borderRadius: 30 }}>
              {nvi.map((book: BibleBook, index: number) => (
                <TouchableOpacity
                  className="flex-row gap-4 items-center rounded-full"
                  key={index}
                  onPress={() => handleBookSelection(book)}
                >
                  <View className="flex-row gap-4 items-center">
                    <Text className="py-3 w-[45px] text-center text-white text-lg rounded-full bg-c1">
                      {book.abbrev}
                    </Text>
                    <Text className="text-white text-2xl">{book.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <TouchableOpacity
            className="w-full py-4 px-4 bg-zinc-900 rounded-full mt-6"
            onPress={() => {
              setIsChapterSelectionActive(!isChapterSelectionActive)
              setIsBookSelectionActive(false)
              setIsVerseSelectionActive(false)
            }}
          >
            <View className="flex-row gap-4 items-center justify-between">
              <View className="flex-row gap-4 items-center">
                <View className="h-[40px] w-[60px] flex items-center justify-center rounded-full bg-c1">
                  <Text className="text-xl font-nowy" style={{ color: '#EEE2CE' }}>
                    {selectedChapter}
                  </Text>
                </View>
                <Text className="text-white text-3xl font-nowy">Capítulo</Text>
              </View>
              <Ionicons name="chevron-down" size={24} color="white" />
            </View>
          </TouchableOpacity>

          {isChapterSelectionActive && (
            <View className="w-full flex flex-row flex-wrap justify-between items-start py-4 px-4 bg-zinc-900 gap-y-4 mt-4" style={{ borderRadius: 30 }}>
              {numberOfChapters > 0 &&
                Array.from({ length: numberOfChapters }, (_, index) => index + 1).map((chapter) => (
                  <TouchableOpacity
                    className="w-[22%] rounded-full"
                    key={chapter}
                    onPress={() => handleChapterSelection(chapter)}
                  >
                    <Text className="py-3 text-center text-white text-xl rounded-full bg-c1">{chapter}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}

          <TouchableOpacity
            className="w-full py-4 px-4 bg-zinc-900 rounded-full mt-6"
            onPress={() => {
              setIsVerseSelectionActive(!isVerseSelectionActive)
              setIsChapterSelectionActive(false)
              setIsBookSelectionActive(false)
            }}
          >
            <View className="flex-row gap-4 items-center justify-between">
              <View className="flex-row gap-4 items-center">
                <View className="h-[40px] w-[60px] flex items-center justify-center rounded-full bg-c1">
                  <Text className="text-xl font-nowy" style={{ color: '#EEE2CE' }}>
                    {selectedVerse}
                  </Text>
                </View>
                <Text className="text-white text-3xl font-nowy">Versículo</Text>
              </View>
              <Ionicons name="chevron-down" size={24} color="white" />
            </View>
          </TouchableOpacity>

          {isVerseSelectionActive && (
            <View className="w-full flex flex-row flex-wrap justify-between items-start py-4 px-4 bg-zinc-900 gap-y-4 mt-4" style={{ borderRadius: 30 }}>
              {numberOfVerses > 0 &&
                Array.from({ length: numberOfVerses }, (_, index) => index + 1).map((verse) => (
                  <TouchableOpacity
                    className="w-[22%] rounded-full"
                    key={verse}
                    onPress={() => handleVerseSelection(verse)}
                  >
                    <Text className="py-3 text-center text-white text-xl rounded-full bg-c1">{verse}</Text>
                  </TouchableOpacity>
                ))}
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-6 left-6 right-6 p-2 bg-zinc-900 rounded-full border border-zinc-600"
        onPress={() => router.push(`/read/nvi/${selectedBook.abbrev}/${selectedChapter}/${selectedVerse}`)}
      >
        <View className="flex-row items-center justify-between">
          <View className="w-full p-2 bg-c1 rounded-full flex-row justify-between items-center">
            <Ionicons name="arrow-forward" size={30} color="transparent" />
            <Text className="text-white text-xl font-nowyb">
              {selectedBook.name} {selectedChapter}:{selectedVerse}
            </Text>
            <Ionicons name="arrow-forward" size={30} color="white" />
          </View>
        </View>
      </TouchableOpacity>
    </>
  )
}
