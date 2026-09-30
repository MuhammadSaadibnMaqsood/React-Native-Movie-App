import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native";
import { Dimensions, Platform, Text, View } from "react-native";
import { styles, theme } from "../theme";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";
import MovieList from "../components/movieList";
import Loading from "../components/Loading";

let { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const verticalMargin = ios ? "" : "my-3";

const CastScreen = () => {
  const { params } = useRoute();
  const [isFav, setIsFav] = useState(false);
  const [personMovies, setPersonMovies] = useState([1, 2, 3, 4, 5]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  return (
    <ScrollView
      className="flex-1 bg-neutral-950"
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView
        className={`z-20 w-full flex-row justify-between items-center px-5 ${verticalMargin}`}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.background}
          className="rounded-2xl p-2.5"
        >
          <ChevronLeftIcon size="21" strokWidth={2.5} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsFav(!isFav)}
          className="rounded-full bg-neutral-800/80 p-2.5"
        >
          <HeartIcon size="27" fill={isFav ? "red" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>

      {loading ? (
        <Loading />
      ) : (
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
              <Image
                style={{ height: height * 0.42, width: width * 0.74 }}
                source={{
                  uri: "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg",
                }}
              />
            </View>
          </View>

          <View className="mt-7 px-4">
            <Text className="text-3xl text-white font-extrabold text-center tracking-tight">
              Keenu Reeves
            </Text>

            <Text className="text-sm text-neutral-400 text-center mt-1">
              London, United Kingdom
            </Text>
          </View>

          <View className="mx-4 mt-7 px-2 py-4 flex-row justify-between items-center bg-neutral-800 border border-neutral-700 rounded-2xl">
            <View className="flex-1 items-center px-2 border-r border-neutral-600">
              <Text className="text-neutral-400 text-xs uppercase tracking-wider">
                Gender
              </Text>
              <Text className="text-white font-semibold text-sm mt-1">
                Male
              </Text>
            </View>

            <View className="flex-1 items-center px-2 border-r border-neutral-600">
              <Text className="text-neutral-400 text-xs uppercase tracking-wider">
                Birthday
              </Text>
              <Text className="text-white font-semibold text-sm mt-1">
                29-03-2006
              </Text>
            </View>

            <View className="flex-1 items-center px-2 border-r border-neutral-600">
              <Text className="text-neutral-400 text-xs uppercase tracking-wider">
                Known for
              </Text>
              <Text className="text-white font-semibold text-sm mt-1">
                Acting
              </Text>
            </View>

            <View className="flex-1 items-center px-2">
              <Text className="text-neutral-400 text-xs uppercase tracking-wider">
                Popularity
              </Text>
              <Text className="text-white font-semibold text-sm mt-1">
                64.78
              </Text>
            </View>
          </View>

          <View className="mt-8 mx-5">
            <Text className="text-white text-xl font-bold mb-3">Biography</Text>

            <Text className="text-neutral-400 text-sm leading-6 tracking-wide">
              {" "}
              following a massive solar storm, disgraced atmospheric physicist
              Dr. following a massive solar storm, disgraced atmospheric
              physicist Dr. following a massive solar storm, disgraced
              atmospheric physicist Dr. following a massive solar storm,
              disgraced atmospheric physicist Dr. following a massive solar
              storm, disgraced atmospheric physicist Dr. following a massive
              solar storm, disgraced atmospheric physicist Dr. following a
              massive solar storm, disgraced atmospheric physicist Dr. following
              a massive solar storm, disgraced atmospheric physicist Dr.
              following a massive solar storm, disgraced atmospheric physicist
              Dr. following a massive solar storm, disgraced atmospheric
              physicist Dr. following a massive solar storm, disgraced
              atmospheric physicist Dr.
            </Text>
          </View>

          <View className="mt-2">
            <MovieList
              data={personMovies}
              title={"Cast Movies"}
              hideSeeAll={true}
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default CastScreen;
