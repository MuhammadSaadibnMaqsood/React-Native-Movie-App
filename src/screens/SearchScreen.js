import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MagnifyingGlassIcon, XMarkIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import Loading from "../components/Loading";
import { getImageUrl, searchMovies } from "../../api/moviedb";

const { width, height } = Dimensions.get("window");

const SearchScreen = () => {
  const navigation = useNavigation();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchTerm = query.trim();
    if (!searchTerm) return undefined;

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setLoading(true);
      setError("");
      searchMovies(searchTerm, controller.signal)
        .then((response) => {
          setResults(Array.isArray(response.results) ? response.results : []);
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setResults([]);
            setError("Could not search movies. Check your connection and try again.");
          }
        })
        .finally(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 350);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query]);

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setError("");
    setLoading(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-950">
      <View className="mx-4 mt-3 flex-row items-center rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-1.5">
        <MagnifyingGlassIcon size="22" color="gray" />

        <TextInput
          value={query}
          onChangeText={(value) => {
            setQuery(value);
            setResults([]);
            setError("");
            setLoading(Boolean(value.trim()));
            if (!value.trim()) {
              setLoading(false);
            }
          }}
          placeholder="Search movies..."
          placeholderTextColor="#737373"
          className="ml-3 flex-1 py-3 text-base font-medium text-white"
          returnKeyType="search"
          autoCapitalize="none"
          accessibilityLabel="Search movies"
        />

        <TouchableOpacity
          onPress={() => (query ? clearSearch() : navigation.goBack())}
          className="ml-2 rounded-full bg-neutral-800 p-2"
          accessibilityLabel={query ? "Clear search" : "Close search"}
        >
          <XMarkIcon size="22" color="white" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <Loading />
      ) : error ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-center text-base text-neutral-400">{error}</Text>
        </View>
      ) : results.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 30,
          }}
        >
          <View className="mb-5 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-white">Search Results</Text>

            <Text className="rounded-full bg-neutral-800 px-3 py-1 text-sm text-neutral-400">
              {results.length} movies
            </Text>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {results.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => navigation.push("Movie", item)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`Open ${item.title || "movie"}`}
              >
                <View className="mb-6 w-[48%]">
                  {getImageUrl(item.poster_path) ? (
                  <Image
                    source={{ uri: getImageUrl(item.poster_path) }}
                    className="rounded-2xl bg-neutral-800"
                    style={{ height: height * 0.3, width: width * 0.44 }}
                  />
                  ) : (
                    <View
                      className="items-center justify-center rounded-2xl bg-neutral-800"
                      style={{ height: height * 0.3, width: width * 0.44 }}
                    >
                      <Text className="text-neutral-500">No poster</Text>
                    </View>
                  )}

                  <Text
                    numberOfLines={2}
                    className="mt-2 px-1 text-sm font-medium leading-5 text-neutral-300"
                  >
                    {item.title || "Untitled"}
                  </Text>
                  <Text className="mt-1 px-1 text-xs text-neutral-500">
                    {item.release_date?.slice(0, 4) || "Release date unknown"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View className="flex-1 items-center justify-center px-8">
          <View className="mb-5 rounded-full bg-neutral-900 p-6">
            <MagnifyingGlassIcon size="55" color="#737373" />
          </View>

          <Text className="text-xl font-bold text-white">
            {query.trim() ? "No Movies Found" : "Find a Movie"}
          </Text>
          <Text className="mt-2 text-center text-sm leading-6 text-neutral-500">
            {query.trim()
              ? "No titles matched your search. Try another name."
              : "Search by movie title to see matching films."}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
