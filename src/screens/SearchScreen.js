
import { useNavigation } from "@react-navigation/native";
import { Dimensions, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { TouchableWithoutFeedback } from "react-native";
import { Image } from "react-native";
import { View } from "react-native";
import { useState } from "react";
import {
  MagnifyingGlassIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

let movieName = "Ant-Man and the Wasp: Quantumania";
const SearchScreen = () => {
  const navigation = useNavigation();

  const [results, setResults] = useState([1, 2, 3, 4, 5]);

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      {/* Search Bar */}
      <View className="mx-4 mt-3 flex-row items-center rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-1.5">
        <MagnifyingGlassIcon size="22" color="gray" />

        <TextInput
          placeholder="Search movies..."
          placeholderTextColor="#737373"
          className="ml-3 flex-1 py-3 text-base font-medium text-white"
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          className="ml-2 rounded-full bg-neutral-800 p-2"
        >
          <XMarkIcon size="22" color="white" />
        </TouchableOpacity>
      </View>

      {results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 30,
          }}
        >
          {/* Results Header */}
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">
              Search Results
            </Text>

            <Text className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-400">
              {results.length} movies
            </Text>
          </View>

          {/* Movies */}
          <View className="flex-row flex-wrap justify-between">
            {results.map((item, index) => (
              <TouchableWithoutFeedback
                key={index}
                onPress={() => navigation.push("Movie", item)}
              >
                <View className="mb-6 w-[48%]">
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1789948731559-5d113d8744b6?q=80&w=987&auto=format&fit=crop",
                    }}
                    className="rounded-2xl bg-neutral-800"
                    height={height * 0.3}
                    width={width * 0.44}
                  />

                  <Text
                    numberOfLines={2}
                    className="mt-2 px-1 text-sm font-medium leading-5 text-neutral-300"
                  >
                    {movieName.length > 22
                      ? movieName.slice(0, 22) + "..."
                      : movieName}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* Empty State */
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-5 rounded-full bg-neutral-900 p-6">
            <MagnifyingGlassIcon size="55" color="#737373" />
          </View>

          <Text className="text-xl font-bold text-white">
            No Movies Found
          </Text>

          <Text className="mt-2 text-center text-sm leading-6 text-neutral-500">
            We couldn't find any movies matching your search. Try searching
            with a different name.
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            className="mt-6 rounded-full bg-neutral-800 px-6 py-3"
          >
            <Text className="font-semibold text-white">
              Back to Home
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
