import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <View>
        <Text className="text-3xl font-bold text-orange-700 pt-20">Home Screen</Text>
      </View>
    </SafeAreaView>
  );
}
