import {
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bars3Icon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
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
  const [refreshing, setRefreshing] = useState(false);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const navigation = useNavigation();

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
      setRefreshing(false);
    });

    return () => controller.abort();
  }, [reloadKey]);

  const retry = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setReloadKey((key) => key + 1);
  };

  const goToSearch = () => navigation.navigate("Search");

  return (
    <View className="flex-1 bg-neutral-900">
      <StatusBar style="light" />

      <SafeAreaView edges={["top"]} className={ios ? "-mb-2" : "mb-3"}>
        {/* Header */}
        <View className="flex-row items-center justify-between mx-4 mt-1">
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            activeOpacity={0.7}
            className="h-11 w-11 items-center justify-center rounded-full bg-neutral-800"
          >
            <Bars3Icon size={22} strokeWidth={2} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-3xl font-bold tracking-tight">
            <Text style={styles.text}>M</Text>ovies
          </Text>

          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Search movies"
            activeOpacity={0.7}
            onPress={goToSearch}
            className="h-11 w-11 items-center justify-center rounded-full bg-neutral-800"
          >
            <MagnifyingGlassIcon size={22} strokeWidth={2} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search entry point */}
        <TouchableOpacity
          accessibilityRole="search"
          accessibilityLabel="Search for a movie"
          activeOpacity={0.8}
          onPress={goToSearch}
          className="mx-4 mt-4 flex-row items-center rounded-full border border-neutral-700 bg-neutral-800 px-4 py-3"
        >
          <MagnifyingGlassIcon size={18} strokeWidth={2} color="#a3a3a3" />
          <Text className="ml-3 text-neutral-400">Search for a movie</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {loading && !refreshing ? (
        <Loading />
      ) : (
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingTop: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ffffff"
              colors={["#ffffff"]}
              progressBackgroundColor="#404040"
            />
          }
        >
          {loadError && (
            <View className="mx-4 mb-5 flex-row items-center rounded-2xl border border-neutral-700 bg-neutral-800 p-4">
              <ExclamationCircleIcon size={26} strokeWidth={1.8} color="#f87171" />
              <View className="ml-3 flex-1">
                <Text className="font-semibold text-white">
                  Movies didn't load
                </Text>
                <Text className="mt-0.5 text-sm text-neutral-400">
                  Check your connection and try again.
                </Text>
              </View>
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityLabel="Retry loading movies"
                activeOpacity={0.8}
                onPress={retry}
                className="ml-3 rounded-full bg-white px-4 py-2"
              >
                <Text className="font-semibold text-neutral-900">Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {trending.length > 0 && <TrendingMovies data={trending} />}

          <View className="mt-2">
            {upcoming.length > 0 && (
              <MovieList title="Upcoming" hideSeeAll data={upcoming} />
            )}
            {topRated.length > 0 && (
              <MovieList title="Top Rated" hideSeeAll data={topRated} />
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}