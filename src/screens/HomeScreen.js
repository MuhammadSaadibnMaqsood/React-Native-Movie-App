import { Platform, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bars3Icon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { styles } from "../theme";
import { ScrollView } from "react-native";
import TrendingMovies from "../components/trendingMovies";
import { useEffect, useState } from "react";
import MovieList from "../components/movieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import { fetchTrendingMovies } from "../../api/moviedb";

const ios = Platform.OS == "ios";
export default function HomeScreen() {
  const [trending, setTrending] = useState([1, 2, 3]);
  const [loading, setLoading] = useState(false);
  const [upcoming, setUpcoming] = useState([
    { image: "", movieName: "Ant Man" },
    { image: "", movieName: "Ant Man" },
    { image: "", movieName: "Ant Man" },
  ]);
  const [topRated, setTopRated] = useState([
    { image: "", movieName: "Ant Man" },
    { image: "", movieName: "Ant Man" },
    { image: "", movieName: "Ant Man" },
  ]);

  useEffect(() => {
    getTrendingMovies();
  });

  async function getTrendingMovies() {
    setLoading(true)
    const movies = await fetchTrendingMovies();
    if(movies && movies.result) {
      setTrending(movies.result)
    }
    setLoading(false);
  }
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-neutral-800">
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <StatusBar barStyle="light-content" />

        <View className="flex-row justify-between items-start mx-4">
          <Bars3Icon size={30} strokeWidth={2} color="white" />
          <Text className="text-white text-3xl font-bold">
            <Text style={styles.text}>M</Text>ovies
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <MagnifyingGlassIcon size={30} strokeWidth={2} color="white" />{" "}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <TrendingMovies data={trending} />
          <MovieList title="Upcoming" hideSeeAll={false} data={upcoming} />
          <MovieList title="Top Rated" hideSeeAll={false} data={topRated} />
        </ScrollView>
      )}
    </View>
  );
}
