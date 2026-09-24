import { View, Text, Pressable } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="mb-5 text-3xl font-bold">
        Home Screen
      </Text>

      <Pressable
        className="rounded-lg bg-blue-500 px-6 py-3"
        onPress={() => navigation.navigate("Profile")}
      >
        <Text className="font-bold text-white">
          Go to Profile
        </Text>
      </Pressable>
    </View>
  );
}