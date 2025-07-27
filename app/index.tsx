import { useFonts } from 'expo-font';
import { Link, useRouter } from 'expo-router';
import { ActivityIndicator, Image, Text, TouchableHighlight, View } from 'react-native';
import SparklesIcon from '../assets/svg/sparkles.svg';
import { Ionicons } from '@expo/vector-icons';

export default function HomePage() {
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    'Nowy-Regular': require('../assets/fonts/PoltawskiNowy-Regular.ttf'),
    'Nowy-Bold': require('../assets/fonts/PoltawskiNowy-Bold.ttf'),
  });

   if (!fontsLoaded) {
      return (
        <View className="w-full h-full items-center justify-center bg-zinc-900">
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      );
    }

  return (
    <View className="w-full h-full bg-c1 gap-10 flex flex-col items-center justify-center">
      <Image source={require('../assets/img/background-home.png')} className="w-[90vw] h-full max-h-[50vh] rounded-b-[25px]" />
      <View className='flex flex-col w-full max-w-[90vw]'>
        <View className='flex flex-row items-center gap-1'>
          <Text className='text-white font-nowyb text-[46px]'>Leia a Palavra.</Text>
          <SparklesIcon className='w-10 h-10' />          
        </View>
        <Text className='text-white font-nowy tracking-tight text-[28px] mt-[-10]'>Diariamente. Onde Estiver.</Text>
        <View className='mt-4'>
          <Text className='text-zinc-500 text-lg leading-tight tracking-tight font-nowy'>
            Acesse as Escrituras Sagradas com clareza, beleza e praticidade.
          </Text>
          <Text className='text-zinc-500 text-lg leading-tight tracking-tight font-nowy'>
            Descubra devocionais, planos de leitura e estudos, tudo em um só lugar.
          </Text>
        </View>
        <TouchableHighlight className='mt-8' onPress={() => router.push('/select')}>
          <View className='flex flex-row justify-between px-6 rounded-full items-center py-4 border border-zinc-800'>
            <Text className='text-white text-xl font-nowy'>
              Ler a Palavra
            </Text>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </View>
        </TouchableHighlight>
      </View>


      {/* <Link href="/random-verse" className="text-white py-3 px-8 rounded-full bg-zinc-600">Gerar versículo Aleatório</Link>
      <Link href="/select" className="text-white py-3 mt-4 px-8 rounded-full bg-zinc-600">Selecionar Capítulo</Link>
      <Link href="/read/nvi/gn/2/2" className="text-white py-3 mt-4 px-8 rounded-full bg-zinc-600">Ler</Link> */}
    </View>
  )
}
