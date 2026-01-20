import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NotificationsScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          {/* HEADER */}
          <View className="px-6 py-4 flex-row items-center">
            <Pressable
              className="size-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="absolute left-0 right-0 items-center">
              <Text className="text-lg text-white font-semibold">
                Notifications
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* CONTENT */}
      <View className="px-6 py-4">
        {/* NEW NOTIFICATIONS TOTAL */}
        <Text className="text-slate-900 font-medium">
          You have 5 new notifications
        </Text>

        {/* NOTIFICATION CARD */}
        <Pressable className="bg-white p-4 rounded-xl shadow-md elevation-xs border border-slate-300 mt-6 transition-all duration-300 ease-in-out active:scale-[0.95] active:opacity-85">
          {/* TITLE */}
          <View className="flex-row items-center gap-3">
            <View className="bg-slate-100 size-10 items-center justify-center rounded-full">
              <Ionicons
                name="notifications-outline"
                size={18}
                color="#0f172b"
              />
            </View>

            <Text className="font-medium text-slate-900">New message</Text>

            <View className="ml-auto bg-slate-100 px-2 py-0.5 rounded-full">
              <Text className="text-sm text-slate-600 font-mediumW">
                5 hr ago
              </Text>
            </View>
          </View>

          {/* CONTENT */}
          <View>
            <Text className="mt-2 text-sm leading-6 text-slate-700">
              Hey you have a new message in your room India vs Australia. Tap to
              open.
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default NotificationsScreen;
