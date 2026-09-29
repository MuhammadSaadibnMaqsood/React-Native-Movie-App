import React from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Image,
} from "react-native";
import { styles } from "../theme";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");


const MovieList = ({ title, data, hideSeeAll }) => {
  let movieName = "Ant-Man and the Wasp: Quantumania";

  const navigation = useNavigation();

  return (
    <View className="mb-8 space-y-4">

      <View className="mx-4 flex-row justify-between items-center">
        <Text className="text-white text-xl">
          {title}
        </Text>

        { !hideSeeAll && <TouchableOpacity>
          <Text style={styles.text} className="text-lg">
            See All
          </Text>
        </TouchableOpacity>}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {data.map((item, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPress={() => navigation.push("Movie", item)}
          >
            <View className="space-y-1 mr-4">

              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1789948731559-5d113d8744b6?q=80&w=987&auto=format&fit=crop",
                }}
                className="rounded-3xl"
                height={height * 0.22}
                width={width * 0.33}
              />

              <Text className="text-neutral-300 text-center ml-1">
                {movieName.length > 14
                  ? movieName.slice(0, 14) + "..."
                  : movieName}
              </Text>

            </View>
          </TouchableWithoutFeedback>
        ))}
      </ScrollView>

    </View>
  );
};

export default MovieList;