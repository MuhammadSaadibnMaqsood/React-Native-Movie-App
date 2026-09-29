import { useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { ChevronLeftIcon } from "react-native-heroicons/outline";
import { HeartIcon } from "react-native-heroicons/solid";
import { styles, theme } from "../theme";
import { Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/cast";
import MovieList from "../components/movieList";

const { width, height } = Dimensions.get("window");
const MovieScreen = () => {
  let movieName = "Ant-Man and the Wasp: Quantumania";
  const { params: item } = useRoute();
  const navigation = useNavigation();

  const [isFav, setIsFav] = useState(false);
  const [cast, setCast] = useState([1,2,3,4,5])
  const [similarMovie, setSimilarMovie] = useState([1,2,3,4,5])
  useEffect(() => {
    // call api
  }, [item]);
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 20 }}
      contentInsetAdjustmentBehavior="never"
      className="flex-1 bg-neutral-900"
    >
      <View className="w-full">
        <SafeAreaView className="absolute z-20 w-full flex-row justify-between items-center px-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.background}
            className="rounded-xl p-1"
          >
            <ChevronLeftIcon size="20" strokWidth={2.5} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsFav(!isFav)}>
            <HeartIcon size="32" color={isFav ? theme.background : "white"} />
          </TouchableOpacity>
        </SafeAreaView>
        <View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1789948731559-5d113d8744b6?q=80&w=987&auto=format&fit=crop",
            }}
            className="rounded-3xl"
            height={height * 0.55}
            width={width}
          />
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
      </View>

      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        <Text className="text-white text-center text-3xl font-bold tracking-wider">
          {movieName}
        </Text>

        <Text className="text-neutral-400 font-semibold text-base text-center">
          Released + 2020 + 170 min
        </Text>

        <View className="flex-row justify-center mx-4 space-x-2">
          <Text className="text-neutral-400 font-semibold text-base text-center">
            Action .
          </Text>
          <Text className="text-neutral-400 font-semibold text-base text-center">
            Thrill .
          </Text>
          <Text className="text-neutral-400 font-semibold text-base text-center">
            Comedy .
          </Text>
        </View>

        <Text className="text-neutral-400 mx-4 tracking-wider">
          When an isolated Arctic research station loses all communication
          following a massive solar storm, disgraced atmospheric physicist Dr.
          Elena Vaemperatures dropping, Elena must decipher the entity's final
          message before the anomaly expands beyond the Arctic perimeter.
        </Text>
      </View>

      <Cast cast={cast} navigation = {navigation} />

      <MovieList title="Similar Movies" hideSeeAll={true} data={similarMovie}/>
    </ScrollView>
  );
};

export default MovieScreen;
