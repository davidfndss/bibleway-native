import { Link } from 'expo-router';
import { Image, Text, View } from 'react-native';

export default function HomePage() {
  return (
    <View className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center">
      <Image source={require('../assets/logo.png')} />
      <Link href="/random-verse" className="text-white py-3 px-8 rounded-full bg-zinc-600">Gerar versículo Aleatório</Link>
      <Link href="/select" className="text-white py-3 mt-4 px-8 rounded-full bg-zinc-600">Selecionar Capítulo</Link>
      <Link href="/read/nvi/gn/2/2" className="text-white py-3 mt-4 px-8 rounded-full bg-zinc-600">Ler</Link>
    </View>
  )
}
