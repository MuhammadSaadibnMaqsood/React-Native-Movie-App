import { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "../theme";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import MovieList from "../components/movieList";
import Loading from "../components/Loading";
import { fetchPersonDetails, fetchPersonMovies, getImageUrl } from "../../api/moviedb";

const CastScreen = () => {
  const { params } = useRoute();
  const initialPerson = params?.person || {};
  const [person, setPerson] = useState(initialPerson);
  const [isFav, setIsFav] = useState(false);
  const [personMovies, setPersonMovies] = useState([]);
  const [loading, setLoading] = useState(Boolean(initialPerson.id));

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
      setLoading(false);
    });

    return () => controller.abort();
  }, [initialPerson.id]);

  const gender = person.gender === 1 ? "Female" : person.gender === 2 ? "Male" : "Not listed";
  const profileImage = getImageUrl(person.profile_path, "w500");

  return (
    <ScrollView
      className="flex-1 bg-neutral-950"
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView
        className="z-20 w-full flex-row items-center justify-between px-5"
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.background}
          className="rounded-2xl p-2.5"
        >
          <ChevronLeftIcon size="21" strokeWidth={2.5} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsFav(!isFav)}
          className="rounded-full bg-neutral-800/80 p-2.5"
        >
          <HeartIcon size="27" color={isFav ? "#ef4444" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>

      {loading ? <Loading /> : null}
      <View className="pb-8">
          <View
            className="flex-row justify-center mt-4"
            style={{
              shadowColor: "grey",
              shadowRadius: 40,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 1,
            }}
          >
            <View className="items-center rounded-full overflow-hidden h-72 w-72 border-2 border-neutral-700 bg-neutral-800">
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

          <View className="mt-7 px-4">
            <Text className="text-3xl text-white font-extrabold text-center tracking-tight">
              {person.name || "Cast member"}
            </Text>

            <Text className="text-sm text-neutral-400 text-center mt-1">
              {person.place_of_birth || person.known_for_department || ""}
            </Text>
          </View>

          <View className="mx-4 mt-7 px-2 py-4 flex-row justify-between items-center bg-neutral-800 border border-neutral-700 rounded-2xl">
            <View className="flex-1 items-center px-2 border-r border-neutral-600">
              <Text className="text-neutral-400 text-xs uppercase tracking-wider">
                Gender
              </Text>
              <Text className="text-white font-semibold text-sm mt-1">
                {gender}
              </Text>
            </View>

            <View className="flex-1 items-center px-2 border-r border-neutral-600">
              <Text className="text-neutral-400 text-xs uppercase tracking-wider">
                Birthday
              </Text>
              <Text className="text-white font-semibold text-sm mt-1">
                {person.birthday || "Not listed"}
              </Text>
            </View>

            <View className="flex-1 items-center px-2 border-r border-neutral-600">
              <Text className="text-neutral-400 text-xs uppercase tracking-wider">
                Known for
              </Text>
              <Text className="text-white font-semibold text-sm mt-1">
                {person.known_for_department || "Not listed"}
              </Text>
            </View>

            <View className="flex-1 items-center px-2">
              <Text className="text-neutral-400 text-xs uppercase tracking-wider">
                Popularity
              </Text>
              <Text className="text-white font-semibold text-sm mt-1">
                {typeof person.popularity === "number" ? person.popularity.toFixed(1) : "Not listed"}
              </Text>
            </View>
          </View>

          <View className="mt-8 mx-5">
            <Text className="text-white text-xl font-bold mb-3">Biography</Text>

            <Text className="text-neutral-400 text-sm leading-6 tracking-wide">
              {person.biography || "No biography is available."}
            </Text>
          </View>

          <View className="mt-2">
            <MovieList
              data={personMovies}
              title="Known For"
              hideSeeAll={true}
            />
          </View>
        </View>
    </ScrollView>
  );
};

export default CastScreen;
