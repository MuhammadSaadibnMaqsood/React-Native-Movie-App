import React from "react";
import { Image } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";

const Cast = ({ cast , navigation}) => {
  let personName = "Keanu Reeves";
  let characterName = "John Wick";
  return (
    <View className="my-6">
      <Text className="text-white text-lg mx-4 mb-5">Top Cast</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {cast &&
          cast.map((person, index) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Cast", { person })}
              key={index}
              className="mr-4 items-center"
            >
              <View className="overflow-hidden h-20 w-20 items-center border border-neutral-500 rounded-full ">

              <Image
                className="rounded-2xl h-24 w-20"
                source={{
                    uri: "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg",
                }}
                />
                </View>
              <Text className=" text-white text-xs mt-1">
                {characterName.length > 10
                  ? characterName.slice(0, 10) + "..."
                  : characterName}
              </Text>
              <Text className="text-neutral-400 text-xs mt-1">
                {personName.length > 10
                  ? personName.slice(0, 10) + "..."
                  : personName}
              </Text>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </View>
  );
};

export default Cast;
