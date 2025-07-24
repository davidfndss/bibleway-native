import { Link } from "expo-router";
import { Image, Text, View } from "react-native";

export default function HomeView() {
    return (
        <View className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center">
            <Image source={require('../../assets/logo.png')} />
        </View>
    )
}