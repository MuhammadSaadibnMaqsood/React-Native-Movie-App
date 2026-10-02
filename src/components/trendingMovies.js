import { useNavigation } from "@react-navigation/native";
import { Image, Text, View, Dimensions, TouchableOpacity } from "react-native";
import { Carousel } from "react-native-reanimated-carousel";
import { getImageUrl } from "../../api/moviedb";

const { width } = Dimensions.get("window");

const TrendingMovies = ({ data }) => {
  const navigation = useNavigation();

  if (!Array.isArray(data) || data.length === 0) return null;

  return (
    <View className="mb-8 h-[50vh]">
      <Text className="text-white text-2xl py-2 font-bold mx-4 mb-5">Trending</Text>

      <Carousel
        width={width}
        height={350}
        data={data}
        onConfigurePanGesture={(gesture) => {
          gesture.activeOffsetX([-10, 10]);
          gesture.failOffsetY([-10, 10]);
        }}
        renderItem={({ item }) => (
          <MovieCard
            item={item}
            onPress={() => navigation.push("Movie", item)}
          />
        )}
      />
    </View>
  );
};

export default TrendingMovies;

const MovieCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      className="items-center"
    >
      {getImageUrl(item.poster_path, "w780") ? (
        <Image
          source={{ uri: getImageUrl(item.poster_path, "w342") }}
          style={{ height: 300, width: width * 0.6 }}
          className="rounded-3xl bg-neutral-800"
        />
      ) : (
        <View
          style={{ height: 300, width: width * 0.6 }}
          className="items-center justify-center rounded-3xl bg-neutral-800"
        >
          <Text className="text-neutral-400">No poster</Text>
        </View>
      )}
      <Text numberOfLines={1} className="mt-2 w-[60%] text-center text-white">
        {item.title || item.name || "Untitled"}
      </Text>
      <Text className="mt-1 text-sm text-neutral-400">
        {item.vote_average
          ? `Rating ${item.vote_average.toFixed(1)}/10`
          : "Not rated yet"}
      </Text>
    </TouchableOpacity>
  );
};
