import { View, Text, TouchableHighlight, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import nvi from 'assets/json/nvi.json';
import { BibleBook } from 'interfaces/BibleBook';
import { ScrollView } from 'react-native-gesture-handler';
import { Verse } from 'interfaces/Verse';
import { NviService } from 'services/nvi-service';

export default function Select() {
  const [isBookSelectionActive, setIsBookSelectionActive] = useState<boolean>(false)
  const [selectedBook, setSelectedBook] = useState<BibleBook>(nvi[0])
  const [isChapterSelectionActive, setIsChapterSelectionActive] = useState<boolean>(false)
  const [selectedChapter, setSelectedChapter] = useState<number>(1)
  const [isVerseSelectionActive, setIsVerseSelectionActive] = useState<boolean>(false)
  const [selectedVerse, setSelectedVerse] = useState<number>(1)
  const [numberOfChapters, setNumberOfChapters] = useState<number>(0)
  const [numberOfVerses, setNumberOfVerses] = useState<number>(0)

  const service = new NviService();

  function handleBookSelection(book: BibleBook) {
    setSelectedBook(book)
    setIsChapterSelectionActive(true)
    setIsBookSelectionActive(false)
    setIsVerseSelectionActive(false)
    setNumberOfChapters(service.getNumberOfChapters(book.abbrev))
  }

  function handleChapterSelection(chapter: number) {
    setSelectedChapter(chapter)
    setIsVerseSelectionActive(true)
    setIsBookSelectionActive(false)
    setIsChapterSelectionActive(false)
    setNumberOfVerses(service.getNumberOfVerses(selectedBook.abbrev, chapter))
  }

  function handleVerseSelection(verse: number) {
    setSelectedVerse(verse)
    setIsVerseSelectionActive(false)
    setIsChapterSelectionActive(false)
    setIsBookSelectionActive(false)
  }

  useEffect(() => {
    setSelectedBook(nvi[0])
    setSelectedChapter(1)
    setSelectedVerse(1)
    setNumberOfChapters(service.getNumberOfChapters(selectedBook.abbrev))
    setNumberOfVerses(service.getNumberOfVerses(selectedBook.abbrev, selectedChapter))
  }, [])

  return (
    <>
    <ScrollView className='w-full h-full bg-zinc-900'>
      <View className='w-full h-full px-6 py-[10vh] flex-col items-center justify-start bg-zinc-900 gap-8'>
        <TouchableHighlight className='w-full py-4 px-4 bg-zinc-800 rounded-xl' onPress={() => {
            setIsBookSelectionActive(!isBookSelectionActive)
            setIsChapterSelectionActive(false)
            setIsVerseSelectionActive(false)
          }
        }>
          <View className='flex-row gap-4 items-center justify-between'>
              <View className='flex-row gap-4 items-center'>
                  <Text className='py-2 px-4 text-white text-3xl rounded-lg bg-zinc-950'>{selectedBook?.abbrev}</Text>
                  <Text className='text-white text-3xl'>{selectedBook?.name}</Text>
              </View>

              <Ionicons name="chevron-down" size={24} color="white" />
          </View>
        </TouchableHighlight>
        {
          isBookSelectionActive === true && 
              <View className='w-full py-4 px-4 bg-zinc-800 rounded-xl gap-y-2'>
                  {
                    nvi.map((book: BibleBook, index: number) => (
                      <TouchableHighlight className='flex-row gap-4 items-center rounded-lg' key={index} onPress={() => handleBookSelection(book)}>
                        <View className='flex-row gap-4 items-center'>
                          <Text className='py-3 w-[45px] text-center text-white text-lg rounded-full bg-zinc-950'>{book.abbrev}</Text>
                          <Text className='text-white text-2xl'>{book.name}</Text>
                        </View>
                      </TouchableHighlight>
                    ))
                  }
              </View>
        }

        <TouchableHighlight className='w-full py-4 px-4 bg-zinc-800 rounded-xl' onPress={() => setIsChapterSelectionActive(!isChapterSelectionActive)}>
          <View className='flex-row gap-4 items-center justify-between'>
              <View className='flex-row gap-4 items-center'>
                  <Text className='py-2 px-4 text-white text-3xl rounded-lg bg-zinc-950'>{selectedChapter}</Text>
                  <Text className='text-white text-3xl'>Capítulo</Text>
              </View>

              <Ionicons name="chevron-down" size={24} color="white" />
          </View>
        </TouchableHighlight>
        {
          isChapterSelectionActive === true && 
              <View className='w-full flex flex-row flex-wrap justify-between items-start py-4 px-4 bg-zinc-800 rounded-xl gap-y-4'>
                  {
                    numberOfChapters > 0 && 
                    Array.from({ length: numberOfChapters }, (_, index) => index + 1).map((chapter: number, index: number) => (
                      <TouchableHighlight className='w-[22%] rounded-lg' key={index} onPress={() => handleChapterSelection(chapter)}>
                        <Text className='py-3 text-center text-white text-xl rounded-lg bg-zinc-950'>{chapter}</Text>
                      </TouchableHighlight>
                    ))  
                  
                  }
              </View>
        }

        <TouchableHighlight className='w-full py-4 px-4 bg-zinc-800 rounded-xl' onPress={() => setIsVerseSelectionActive(!isVerseSelectionActive)}>
          <View className='flex-row gap-4 items-center justify-between'>
              <View className='flex-row gap-4 items-center'>
                  <Text className='py-2 px-4 text-white text-3xl rounded-lg bg-zinc-950'>{selectedVerse}</Text>
                  <Text className='text-white text-3xl'>Versículo</Text>
              </View>

              <Ionicons name="chevron-down" size={24} color="white" />
          </View>
        </TouchableHighlight>
        {
          isVerseSelectionActive === true && 
            <View className='w-full flex flex-row flex-wrap justify-between items-start py-4 px-4 bg-zinc-800 rounded-xl gap-y-4'>
                {
                  numberOfVerses > 0 && 
                  Array.from({ length: numberOfVerses }, (_, index) => index + 1).map((verse: number, index: number) => (
                    <TouchableHighlight className='w-[22%] rounded-lg' key={index} onPress={() => handleVerseSelection(verse)}>
                      <Text className='py-3 text-center text-white text-xl rounded-lg bg-zinc-950'>{verse}</Text>
                    </TouchableHighlight>
                  ))
                }
            </View>
        }

        {/* <TouchableHighlight className='w-full py-4 px-4 bg-zinc-800 rounded-xl'>
          <View className='flex-row gap-4 items-center justify-end'>
              <Text className='text-white text-3xl'>Ler</Text>  
              <Ionicons name="chevron-forward" size={24} color='white' />
          </View>
        </TouchableHighlight> */}
        
      </View>
      
    </ScrollView>

    <TouchableOpacity
        className="absolute bottom-6 left-6 right-6 p-2 bg-zinc-800 rounded-xl border border-zinc-600"
        onPress={() => alert('Botão fixo clicado!')}
      >
        <View className='flex-row items-center justify-between'>
          <View className='w-full p-2 bg-zinc-900 rounded-lg flex-row justify-between items-center'>
            <Ionicons name="arrow-forward" size={30} color='transparent' />
            <Text className='text-white text-xl border'>{selectedBook.abbrev} {selectedChapter}:{selectedVerse}</Text>  
            <Ionicons name="arrow-forward" size={30} color='white' />
          </View>
        </View>
      </TouchableOpacity>  
    </>
  )
}