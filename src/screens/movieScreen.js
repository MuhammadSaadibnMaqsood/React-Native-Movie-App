import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon as HeartSolidIcon } from "react-native-heroicons/solid";
import { HeartIcon as HeartOutlineIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import { theme } from "../theme";
import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  getImageUrl,
} from "../../api/moviedb";

const { width, height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.55;

const MovieScreen = () => {
  const { params: item = {} } = useRoute();
  const navigation = useNavigation();
  const [movie, setMovie] = useState(item);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!item.id) return undefined;
    const controller = new AbortController();

    Promise.allSettled([
      fetchMovieDetails(item.id, controller.signal),
      fetchMovieCredits(item.id, controller.signal),
      fetchSimilarMovies(item.id, controller.signal),
    ]).then(([detailsResponse, creditsResponse, similarResponse]) => {
      if (controller.signal.aborted) return;

      const details =
        detailsResponse.status === "fulfilled" ? detailsResponse.value : null;
      const credits =
        creditsResponse.status === "fulfilled" ? creditsResponse.value : null;
      const similar =
        similarResponse.status === "fulfilled" ? similarResponse.value : null;

      if (details) setMovie({ ...item, ...details });
      setCast(Array.isArray(credits?.cast) ? credits.cast.slice(0, 12) : []);
      setSimilarMovies(Array.isArray(similar?.results) ? similar.results : []);
      setLoadError(
        [detailsResponse, creditsResponse, similarResponse].every(
          (response) => response.status === "rejected",
        ),
      );
      setLoading(false);
    });

    return () => controller.abort();
  }, [item, reloadKey]);

  const retry = () => {
    setLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  };

  const backdrop = getImageUrl(
    movie.backdrop_path || movie.poster_path,
    "w500",
  );
  const releaseYear = movie.release_date?.slice(0, 4);
  const runtime = movie.runtime ? `${movie.runtime} min` : null;
  const meta = [releaseYear, runtime].filter(Boolean).join("  •  ");
  const genres = Array.isArray(movie.genres) ? movie.genres : [];
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : null;

  return (
    <View className="flex-1 bg-neutral-900">
      <StatusBar style="light" />

      {/* Floating actions stay put while the page scrolls */}
      <SafeAreaView
        edges={["top"]}
        className="absolute left-0 right-0 top-0 z-20 flex-row items-center justify-between px-4 pt-1"
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          activeOpacity={0.8}
          className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
        >
          <ChevronLeftIcon size={22} strokeWidth={2.5} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsFav((favorite) => !favorite)}
          accessibilityRole="button"
          accessibilityLabel={
            isFav ? "Remove from favorites" : "Add to favorites"
          }
          accessibilityState={{ selected: isFav }}
          activeOpacity={0.8}
          className="h-11 w-11 items-center justify-center rounded-full bg-black/50"
        >
          {isFav ? (
            <HeartSolidIcon size={24} color={theme.background} />
          ) : (
            <HeartOutlineIcon size={24} strokeWidth={2} color="white" />
          )}
        </TouchableOpacity>
      </SafeAreaView>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        contentInsetAdjustmentBehavior="never"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View className="w-full">
          {backdrop ? (
            <Image
              source={{ uri: backdrop }}
              style={{ height: HERO_HEIGHT, width }}
              resizeMode="cover"
            />
          ) : (
            <View
              className="items-center justify-center bg-neutral-800"
              style={{ height: HERO_HEIGHT, width }}
            >
              <Text className="text-neutral-400">No artwork available</Text>
            </View>
          )}
          <LinearGradient
            colors={["transparent", "rgba(23,23,23,0.85)", "rgba(23,23,23,1)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: height * 0.4,
            }}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            pointerEvents="none"
          />
        </View>

        {/* Title block */}
        <View style={{ marginTop: -(height * 0.1) }} className="px-4">
          <Text className="text-center text-4xl font-bold leading-tight text-white">
            {movie.title || movie.original_title || "Movie details"}
          </Text>

          <View className="mt-3 flex-row flex-wrap items-center justify-center">
            {rating ? (
              <View className="mr-3 rounded-full bg-amber-400 px-3 py-1">
                <Text className="text-sm font-bold text-neutral-900">
                  ★ {rating}
                </Text>
              </View>
            ) : (
              <Text className="mr-3 text-sm text-neutral-500">Not rated yet</Text>
            )}
            <Text className="text-base font-medium text-neutral-400">
              {meta || "Release details unavailable"}
            </Text>
          </View>

          {genres.length > 0 && (
            <View className="mt-4 flex-row flex-wrap justify-center">
              {genres.map((genre) => (
                <View
                  key={genre.id ?? genre.name}
                  className="m-1 rounded-full border border-neutral-700 bg-neutral-800 px-3 py-1"
                >
                  <Text className="text-sm text-neutral-300">{genre.name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Overview */}
        <View className="mx-4 mt-6">
          <Text className="mb-2 text-xl font-semibold text-white">Overview</Text>
          <Text className="text-base leading-7 text-neutral-300">
            {movie.overview || "No overview is available for this movie."}
          </Text>
        </View>

        {/* Status */}
        {loading ? (
          <View className="mx-4 mt-6 flex-row items-center justify-center">
            <ActivityIndicator size="small" color="#a3a3a3" />
            <Text className="ml-2 text-sm text-neutral-400">
              Loading cast and similar movies
            </Text>
          </View>
        ) : null}
        {loadError ? (
          <View className="mx-4 mt-6 flex-row items-center rounded-2xl border border-neutral-700 bg-neutral-800 p-4">
            <View className="flex-1">
              <Text className="font-semibold text-white">
                Movie info didn't load
              </Text>
              <Text className="mt-0.5 text-sm text-neutral-400">
                Check your connection and try again.
              </Text>
            </View>
            <TouchableOpacity
              onPress={retry}
              accessibilityRole="button"
              accessibilityLabel="Retry loading movie info"
              activeOpacity={0.8}
              className="ml-3 rounded-full bg-white px-4 py-2"
            >
              <Text className="font-semibold text-neutral-900">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View className="mt-2">
          <Cast cast={cast} navigation={navigation} />
          <MovieList
            title="Similar Movies"
            hideSeeAll
            data={similarMovies}
            emptyMessage={loading ? undefined : "No similar movies were found."}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default MovieScreen;