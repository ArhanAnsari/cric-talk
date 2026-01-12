import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SettingsScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        {/* HEADER */}
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center">
            <Pressable className="w-10 h-10 bg-orange-600 items-center justify-center rounded-full tranistion-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85">
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="absolute left-0 right-0 items-center">
              <Text className="text-white text-lg font-semibold">Settings</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default SettingsScreen;
