import { useRoute } from "@react-navigation/native";
import { Text, View } from "react-native";

const CastScreen = () => {
  const { params } = useRoute();
  const person = params?.person;
  const personName =
    person && typeof person === "object"
      ? person.name ?? person.original_name
      : person;

  return (
    <View className="flex-1 items-center justify-center bg-neutral-900">
      <Text className="text-xl text-white">
        {personName ? String(personName) : "Cast member"}
      </Text>
    </View>
  );
};

export default CastScreen;