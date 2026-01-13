import { useUser } from "@/store/useUser";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Preferences = () => {
  const oldFavTeam = useUser((s) => s.favTeam) || "";
  const [favTeam, setFavTeam] = useState<string>(oldFavTeam);

  const isNewFavTeam = favTeam.trim() !== "" && favTeam.trim() !== oldFavTeam;

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center">
            <Pressable
              className="w-10 h-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="absolute left-0 right-0 items-center">
              <Text className="text-white text-lg font-semibold">
                Preferences
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* PREFERENCES CONTENT */}
      <View className="px-6 py-4">
        {/* FAV TEAM CHANGE */}
        <View>
          <Text className="text-slate-900 text-lg font-medium">
            Change Favourite Team
          </Text>

          <View className="flex-row items-center gap-2 mt-2">
            <TextInput
              value={favTeam}
              onChangeText={setFavTeam}
              placeholder="Change your favourite team"
              className="border border-slate-300 rounded-lg pl-4 h-12 flex-1"
            />

            <Pressable
              className={`w-12 h-12 ${
                isNewFavTeam ? "bg-orange-500" : "bg-slate-500"
              } items-center justify-center rounded-lg transition-all duration-300 ease-in-out active:opacity-85 active:scale-[0.98]`}
            >
              <Ionicons
                name={isNewFavTeam ? "save-outline" : "create-outline"}
                size={20}
                color="white"
              />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Preferences;
