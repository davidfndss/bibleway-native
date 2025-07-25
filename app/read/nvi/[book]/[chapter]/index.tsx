import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { NviService } from 'services/nvi-service';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import DynamicHeader from 'components/Header/DynamicHeader';
import { BibleBook } from 'interfaces/BibleBook';

export default function ReadChapter() {
    const { book, chapter, verse } = useLocalSearchParams<{ book: string, chapter: string, verse: string }>();
    const [chapterData, setChapterData] = useState<string[]>();

    const service = new NviService();
    const bookInfo: BibleBook = service.getBookInfoByAbbrev(book);

    useEffect(() => {
        setChapterData(service.getChapter(book, Number(chapter)));
    }, [])

    if (!chapterData) {
        return (
            <View className='w-full h-full items-center justify-center bg-zinc-900'>
                <Text className='text-white'>Carregando... </Text>
            </View>
        )
    }

    return (
        <ScrollView className='w-full h-full bg-zinc-900'>
            <DynamicHeader bookIndex={bookInfo.index!} bookName={bookInfo.name} chapter={Number(chapter)} />
            
            <View className='w-full h-full flex flex-col items-start justify-start mt-14  px-4'>
                <Text className='text-white text-4xl mb-10'>{bookInfo.name} {chapter}</Text>
                {
                    chapterData?.map((verse, index) => (
                        <TouchableOpacity key={index} className='mb-1' onPress={() => {}}>
                            <View>
                                <Text className='text-white text-xl leading-tight'>{index + 1}. {verse}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>
        </ScrollView>
    )
}