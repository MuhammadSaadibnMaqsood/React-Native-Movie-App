import {
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bars3Icon, MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { styles } from "../theme";
import TrendingMovies from "../components/trendingMovies";
import { useEffect, useState } from "react";
import MovieList from "../components/movieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import {
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from "../../api/moviedb";

const ios = Platform.OS === "ios";
export default function HomeScreen() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    Promise.allSettled([
      fetchTrendingMovies(controller.signal),
      fetchUpcomingMovies(controller.signal),
      fetchTopRatedMovies(controller.signal),
    ]).then(([trendingResponse, upcomingResponse, topRatedResponse]) => {
      if (controller.signal.aborted) return;

      const responses = [trendingResponse, upcomingResponse, topRatedResponse];
      const getResults = (response) =>
        response.status === "fulfilled" && Array.isArray(response.value?.results)
          ? response.value.results
          : [];

      setTrending(getResults(trendingResponse));
      setUpcoming(getResults(upcomingResponse));
      setTopRated(getResults(topRatedResponse));
      setLoadError(responses.every((response) => response.status === "rejected"));
      setLoading(false);
    });

    return () => controller.abort();
  }, [reloadKey]);

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
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 10 }}
        >
          {loadError && (
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                setReloadKey((key) => key + 1);
              }}
              className="mx-4 mb-5 rounded-xl bg-neutral-700 px-4 py-3"
            >
              <Text className="text-center text-white">
                Could not load movies. Tap to retry.
              </Text>
            </TouchableOpacity>
          )}
          <TrendingMovies data={trending} />
          <MovieList title="Upcoming" hideSeeAll data={upcoming} />
          <MovieList title="Top Rated" hideSeeAll data={topRated} />
        </ScrollView>
      )}
    </View>
  );
}
