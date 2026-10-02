import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/cast";
import MovieList from "../components/movieList";
import { styles, theme } from "../theme";
import {
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovies,
  getImageUrl,
} from "../../api/moviedb";

const { width, height } = Dimensions.get("window");

const MovieScreen = () => {
  const { params: item = {} } = useRoute();
  const navigation = useNavigation();
  const [movie, setMovie] = useState(item);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

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
  }, [item]);

  const backdrop = getImageUrl(
    movie.backdrop_path || movie.poster_path,
    "w500",
  );
  const releaseYear = movie.release_date?.slice(0, 4);
  const genres = movie.genres?.map((genre) => genre.name).join(" · ");

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      contentInsetAdjustmentBehavior="never"
      className="flex-1 bg-neutral-900"
    >
      <View className="w-full">
        <SafeAreaView className="absolute z-20 w-full flex-row items-center justify-between px-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.background}
            className="rounded-xl p-1"
            accessibilityLabel="Go back"
          >
            <ChevronLeftIcon size="20" strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsFav((favorite) => !favorite)}
            accessibilityLabel={
              isFav ? "Remove from favorites" : "Add to favorites"
            }
          >
            <HeartIcon size="30" color={isFav ? theme.background : "white"} />
          </TouchableOpacity>
        </SafeAreaView>

        {backdrop ? (
          <Image
            source={{ uri: backdrop }}
            style={{ height: height * 0.55, width }}
            resizeMode="cover"
          
          />
        ) : (
          <View
            className="items-center justify-center bg-neutral-800"
            style={{ height: height * 0.55, width }}
          >
            <Text className="text-neutral-400">No artwork available</Text>
          </View>
        )}
        <LinearGradient
          colors={["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]}
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

      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        <Text className="px-4 text-center text-3xl font-bold text-white">
          {movie.title || movie.original_title || "Movie details"}
        </Text>

        <Text className="text-center text-base font-semibold text-neutral-400">
          {[releaseYear, movie.runtime ? `${movie.runtime} min` : null]
            .filter(Boolean)
            .join(" · ") || "Release details unavailable"}
        </Text>

        <Text className="text-center text-sm font-semibold text-amber-400">
          {movie.vote_average
            ? `Rating ${movie.vote_average.toFixed(1)}/10`
            : "Not rated yet"}
        </Text>

        {genres ? (
          <Text className="mx-4 text-center text-sm text-neutral-400">
            {genres}
          </Text>
        ) : null}

        <Text className="mx-4 leading-6 text-neutral-300">
          {movie.overview || "No overview is available for this movie."}
        </Text>
      </View>

      {loading ? (
        <Text className="mx-4 mt-5 text-center text-sm text-neutral-500">
          Loading cast and recommendations...
        </Text>
      ) : null}
      {loadError ? (
        <Text className="mx-4 mt-5 text-center text-sm text-neutral-500">
          Some movie information could not be loaded.
        </Text>
      ) : null}
      <Cast cast={cast} navigation={navigation} />
      <MovieList
        title="Similar Movies"
        hideSeeAll
        data={similarMovies}
        emptyMessage={loading ? undefined : "No similar movies were found."}
      />
    </ScrollView>
  );
};

export default MovieScreen;
