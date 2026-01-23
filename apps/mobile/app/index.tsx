import { StatusBar } from "expo-status-bar";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white p-6">
      <Text className="text-center text-3xl font-bold text-gray-900">Welcome to Comoi</Text>
      <Text className="mt-4 text-center text-base text-gray-600">
        Find and compare prices from local mini-markets in Vietnam.
      </Text>
      <StatusBar style="auto" />
    </View>
  );
}
