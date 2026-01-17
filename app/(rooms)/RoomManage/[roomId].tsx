import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RoomManage = () => {
  const { roomId } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          {/* HEADER */}
          <View className="flex-row items-center px-6 py-4">
            <Pressable className="w-10 h-10 bg-orange-600 items-center justify-center rounded-full transition-all active:scale-[0.98] active:opacity-85">
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="absolute left-0 right-0 items-center">
              <Text className="text-lg text-white font-semibold">
                Manage Room
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default RoomManage;
