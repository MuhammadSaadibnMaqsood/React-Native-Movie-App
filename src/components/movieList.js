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
import { getImageUrl } from "../../api/moviedb";
const { width, height } = Dimensions.get("window");

const MovieList = ({ title, data, hideSeeAll, emptyMessage }) => {
  const navigation = useNavigation();

  if ((!Array.isArray(data) || data.length === 0) && !emptyMessage) return null;

  return (
    <View className="mb-8 space-y-4">
      <View className="mx-4 flex-row justify-between items-center">
        <Text className="text-white text-2xl py-3 font-bold">{title}</Text>

        {!hideSeeAll && (
          <TouchableOpacity>
            <Text style={styles.text} className="text-lg">
              See All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {Array.isArray(data) && data.length > 0 ? (
        <ScrollView
          horizontal
          nestedScrollEnabled
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 15 }}
        >
          {data.map((item, index) => (
            <TouchableWithoutFeedback
              key={item.id || index}
              onPress={() => navigation.push("Movie", item)}
            >
              <View className="space-y-1 mr-4">
                {getImageUrl(item.poster_path) ? (
                  <Image
                    source={{ uri: getImageUrl(item.poster_path, "w342") }}
                    className="rounded-3xl bg-neutral-800"
                    style={{ height: height * 0.22, width: width * 0.33 }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className="items-center justify-center rounded-3xl bg-neutral-800"
                    style={{ height: height * 0.22, width: width * 0.33 }}
                  >
                    <Text className="px-3 text-center text-neutral-500">
                      No poster
                    </Text>
                  </View>
                )}

                <Text
                  numberOfLines={2}
                  style={{ width: width * 0.33 }}
                  className="ml-1 text-center text-neutral-300"
                >
                  {item.title || item.name || "Untitled"}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      ) : (
        <Text className="mx-4 text-sm text-neutral-500">{emptyMessage}</Text>
      )}
    </View>
  );
};

export default MovieList;
