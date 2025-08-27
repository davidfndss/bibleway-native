import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function SearchBooks() {
  const [currentText, setCurrentText] = useState<string>("");
  const router = useRouter();

  return (
    <View className="mb-8 w-full rounded-full border border-zinc-800 bg-zinc-950 px-6 py-3">
      <TouchableOpacity className="flex-row items-center justify-end gap-4 py-1" onPress={() => router.push(`/search`)}>
        <Ionicons name="search" size={24} color="gray" /> 
      </TouchableOpacity>
    </View>
  );
}
