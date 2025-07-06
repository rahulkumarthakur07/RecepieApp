import { Stack } from "expo-router";
import "../global.css";
export default function RootLayout() {
  return <Stack initialRouteName="splash" screenOptions={{headerShown:false}} >
    <Stack.Screen name="splash"/>
    <Stack.Screen name="index"/>
    </Stack>;
}
