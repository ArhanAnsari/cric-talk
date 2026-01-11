import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-100 bg-linear-to-br from-orange-500 to-orange-600">
        {/* HEADER */}
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center justify-between">
            <Pressable
              className="h-10 w-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <Text className="text-white text-lg font-semibold">
              SwapnaSahoo
            </Text>

            <Pressable className="h-10 w-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85">
              <Ionicons name="settings-outline" size={18} color="white" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default ProfileScreen;
