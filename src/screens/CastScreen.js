import { useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ScrollView, TouchableOpacity } from "react-native";
import { Dimensions, Platform, Text, View } from "react-native";
import { styles, theme } from "../theme";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "react-native";

let { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const verticalMargin = ios ? "" : "my-3";
const CastScreen = () => {
  const { params } = useRoute();
  const [isFav, setIsFav] = useState(false);

  const navigation = useNavigation();

  return (
    <ScrollView className="flex-1 bg-neutral-900">
      <SafeAreaView
        className={`z-20 w-full flex-row justify-between items-center px-4 ${verticalMargin}`}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.background}
          className="rounded-xl p-1"
        >
          <ChevronLeftIcon size="20" strokWidth={2.5} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setIsFav(!isFav)}>
          <HeartIcon size="32" fill={isFav ? "red" : "white"} />
        </TouchableOpacity>
      </SafeAreaView>
      <View>
        <View
          className="flex-row justify-center"
          style={{
            shadowColor: "grey",
            shadowRadius: 40,
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 1,
          }}
        >
          <View className="items-center rounded-full overflow-hidden h-72 w-72 border-2 border-neutral-500">
            <Image
              // className="rounde"
              style={{ height: height * 0.42, width: width * 0.74 }}
              source={{
                uri: "https://m.media-amazon.com/images/M/MV5BMTU2NjA1ODgzMF5BMl5BanBnXkFtZTgwMTM2MTI4MjE@._V1_.jpg",
              }}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CastScreen;
