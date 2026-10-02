import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { getImageUrl } from "../../api/moviedb";

const Cast = ({ cast, navigation }) => {
  if (!Array.isArray(cast) || cast.length === 0) return null;

  return (
    <View className="my-6">
      <Text className="text-white text-lg mx-4 mb-5">Top Cast</Text>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast &&
          cast.map((person, index) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Cast", { person })}
              key={person.id || index}
              className="mr-4 items-center"
              accessibilityRole="button"
              accessibilityLabel={`View ${person.name || "cast member"}`}
            >
              <View className="h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-neutral-500 bg-neutral-800">
                {getImageUrl(person.profile_path, "w185") ? (
                  <Image
                    source={{ uri: getImageUrl(person.profile_path, "w185") }}
                    style={{ height: 80, width: 80 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-xs text-neutral-500">No photo</Text>
                )}
              </View>
              <Text numberOfLines={1} className="mt-2 w-20 text-center text-xs text-white">
                {person.name || "Unknown"}
              </Text>
              <Text numberOfLines={1} className="mt-1 w-20 text-center text-xs text-neutral-400">
                {person.character || person.known_for_department || "Cast"}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default Cast;
