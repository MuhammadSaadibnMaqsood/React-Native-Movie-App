import { useNavigation } from "@react-navigation/native";
import {
  Image,
  Text,
  View,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { Carousel } from "react-native-reanimated-carousel";

const { width, height } = Dimensions.get("window");

const handleClick = () => {
  const navigation = useNavigation();
  navigation.navigate("Movie", item);
};

const TrendingMovies = ({ data }) => {
  return (
    <View className="mb-8 h-screen">
      <Text className="text-white text-xl mx-4 mb-5">Trending</Text>

      <Carousel
        width={width}
        height={350}
        data={data}
        renderItem={({ item }) => (
          <MovieCard item={item} handleClick={handleClick} />
        )}
      />
    </View>
  );
};

export default TrendingMovies;

const MovieCard = ({ item, handleClick }) => {
  return (
    <TouchableWithoutFeedback onPress={handleClick}>
      <View className="items-center">
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1789948731559-5d113d8744b6?q=80&w=987&auto=format&fit=crop",
          }}
          style={{
            height: 300,
            width: width * 0.6,
          }}
          className="rounded-3xl"
        />

        <Text className="text-white">Movie</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
