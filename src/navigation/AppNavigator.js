import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import MovieScreen from "../screens/movieScreen";
import CastScreen from "../screens/CastScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        options={{ headerShown: false }}
        component={HomeScreen}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen
        name="Movie"
        options={{ headerShown: false }}
        component={MovieScreen}
      />
      <Stack.Screen name="Cast" component={CastScreen} />
    </Stack.Navigator>
  );
}
