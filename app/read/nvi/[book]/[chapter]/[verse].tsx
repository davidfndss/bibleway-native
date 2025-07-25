import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { NviService } from 'services/nvi-service';
import { Verse } from 'interfaces/Verse';

export default function ReadVerse() {
    const { book, chapter, verse } = useLocalSearchParams();
    const [verseData, setVerseData] = useState<Verse>();

    const service = new NviService();

    useEffect(() => {
        setVerseData(service.getVerse(String(book), Number(chapter), Number(verse)));
    }, [])

    if (!verseData) {
        return (
            <View className='w-full h-full items-center justify-center bg-zinc-900'>
                <Text className='text-white'>Carregando...</Text>
            </View>
        )
    }

    return (
        <View className='w-full h-full items-center justify-center bg-zinc-900'>
            <Text className='text-white'>{verseData.book.name} {verseData?.chapter}:{verseData?.index}</Text>
            <Text className='text-white'>{verseData?.verse} </Text>
        </View>
    )
}