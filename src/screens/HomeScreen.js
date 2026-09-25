import { Platform, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bars3Icon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { styles } from "../theme";
import { ScrollView } from "react-native";
import TrendingMovies from "../components/trendingMovies";
import { useState } from "react";

const ios = Platform.OS == "ios";
export default function HomeScreen() {

  const [trending, setTrending] = useState([1,2,3])

  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <StatusBar barStyle="light-content" />

        <View className="flex-row justify-between items-start mx-4">
          <Bars3Icon size={30} strokeWidth={2} color="white" />
          <Text className="text-white text-3xl font-bold">
            <Text style={styles.text}>M</Text>ovies
          </Text>
          <TouchableOpacity>
            <MagnifyingGlassIcon size={30} strokeWidth={2} color="white" />{" "}
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <TrendingMovies data={trending}/>
      </ScrollView>
    </View>
  );
}
