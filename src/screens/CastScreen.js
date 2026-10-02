import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon as HeartOutlineIcon } from "react-native-heroicons/outline";
import { HeartIcon as HeartSolidIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";
import MovieList from "../components/movieList";
import { theme } from "../theme";
import {
  fetchPersonDetails,
  fetchPersonMovies,
  getImageUrl,
} from "../../api/moviedb";

const NOT_LISTED = "Not listed";

function Stat({ label, value }) {
  return (
    <View className="w-1/2 p-1.5">
      <View className="rounded-2xl border border-neutral-700 bg-neutral-800 px-4 py-3">
        <Text className="text-xs text-neutral-400">{label}</Text>
        <Text
          className="mt-1 text-base font-semibold text-white"
          numberOfLines={1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const CastScreen = () => {
  const { params } = useRoute();
  const initialPerson = params?.person || {};
  const [person, setPerson] = useState(initialPerson);
  const [isFav, setIsFav] = useState(false);
  const [personMovies, setPersonMovies] = useState([]);
  const [loading, setLoading] = useState(Boolean(initialPerson.id));
  const [loadError, setLoadError] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);
  const [bioTruncated, setBioTruncated] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const navigation = useNavigation();

  useEffect(() => {
    if (!initialPerson.id) return undefined;
    const controller = new AbortController();

    Promise.allSettled([
      fetchPersonDetails(initialPerson.id, controller.signal),
      fetchPersonMovies(initialPerson.id, controller.signal),
    ]).then(([detailsResponse, moviesResponse]) => {
      if (controller.signal.aborted) return;
      if (detailsResponse.status === "fulfilled") setPerson(detailsResponse.value);
      if (moviesResponse.status === "fulfilled") {
        setPersonMovies(moviesResponse.value.cast || []);
      }
      setLoadError(
        detailsResponse.status === "rejected" &&
          moviesResponse.status === "rejected",
      );
      setLoading(false);
    });

    return () => controller.abort();
  }, [initialPerson.id, reloadKey]);

  const retry = () => {
    setLoading(true);
    setLoadError(false);
    setReloadKey((key) => key + 1);
  };

  const gender =
    person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : NOT_LISTED;
  const profileImage = getImageUrl(person.profile_path, "w500");
  const subtitle = person.place_of_birth || person.known_for_department || "";
  const popularity =
    typeof person.popularity === "number"
      ? person.popularity.toFixed(1)
      : NOT_LISTED;

  return (
    <View className="flex-1 bg-neutral-900">
      <StatusBar style="light" />

      {/* Floating actions stay visible while scrolling */}
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
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Portrait */}
        <SafeAreaView edges={["top"]} className="pt-14">
          <View
            className="items-center"
            style={{
              shadowColor: "#000",
              shadowRadius: 24,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              elevation: 12,
            }}
          >
            <View className="h-64 w-64 overflow-hidden rounded-full border-2 border-neutral-700 bg-neutral-800">
              {profileImage ? (
                <Image
                  source={{ uri: profileImage }}
                  style={{ height: "100%", width: "100%" }}
                  resizeMode="cover"
                />
              ) : (
                <View className="h-full w-full items-center justify-center">
                  <Text className="text-neutral-500">No photo</Text>
                </View>
              )}
            </View>
          </View>
        </SafeAreaView>

        {/* Name */}
        <View className="mt-6 px-4">
          <Text className="text-center text-3xl font-extrabold tracking-tight text-white">
            {person.name || "Cast member"}
          </Text>
          {subtitle ? (
            <Text className="mt-1 text-center text-base text-neutral-400">
              {subtitle}
            </Text>
          ) : null}
        </View>

        {/* Status */}
        {loading ? (
          <View className="mt-5 flex-row items-center justify-center">
            <ActivityIndicator size="small" color="#a3a3a3" />
            <Text className="ml-2 text-sm text-neutral-400">
              Loading profile
            </Text>
          </View>
        ) : null}
        {loadError ? (
          <View className="mx-4 mt-5 flex-row items-center rounded-2xl border border-neutral-700 bg-neutral-800 p-4">
            <View className="flex-1">
              <Text className="font-semibold text-white">
                Profile didn't load
              </Text>
              <Text className="mt-0.5 text-sm text-neutral-400">
                Check your connection and try again.
              </Text>
            </View>
            <TouchableOpacity
              onPress={retry}
              accessibilityRole="button"
              accessibilityLabel="Retry loading profile"
              activeOpacity={0.8}
              className="ml-3 rounded-full bg-white px-4 py-2"
            >
              <Text className="font-semibold text-neutral-900">Retry</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Stats */}
        <View className="mx-2.5 mt-6 flex-row flex-wrap">
          <Stat label="Gender" value={gender} />
          <Stat label="Birthday" value={person.birthday || NOT_LISTED} />
          <Stat
            label="Known for"
            value={person.known_for_department || NOT_LISTED}
          />
          <Stat label="Popularity" value={popularity} />
        </View>

        {/* Biography */}
        <View className="mx-5 mt-6">
          <Text className="mb-2 text-xl font-semibold text-white">
            Biography
          </Text>
          <Text
            className="text-base leading-7 text-neutral-300"
            numberOfLines={bioExpanded ? undefined : 6}
            onTextLayout={(event) => {
              if (!bioExpanded) {
                setBioTruncated(event.nativeEvent.lines.length > 6);
              }
            }}
          >
            {person.biography || "No biography is available."}
          </Text>
          {bioTruncated || bioExpanded ? (
            <TouchableOpacity
              onPress={() => setBioExpanded((expanded) => !expanded)}
              accessibilityRole="button"
              activeOpacity={0.7}
              className="mt-2 self-start"
            >
              <Text style={{ color: theme.background }} className="font-semibold">
                {bioExpanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View className="mt-4">
          <MovieList data={personMovies} title="Known For" hideSeeAll={true} />
        </View>
      </ScrollView>
    </View>
  );
};

export default CastScreen;