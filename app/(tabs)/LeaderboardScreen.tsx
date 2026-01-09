import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LeaderboardScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-100 bg-linear-to-br from-orange-500 to-orange-600">
        <SafeAreaView>
          {/* HEADER */}
          <View className="px-6 py-4 flex-row items-center">
            <Pressable className="w-10 h-10 bg-orange-600 rounded-full items-center justify-center">
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="items-center absolute left-0 right-0">
              <Text className="text-white text-lg font-semibold">
                Leaderboard
              </Text>
            </View>
          </View>

          {/* TOP 3 LEADERBOARD */}
          <View className="items-center mt-4">
            <View className="items-center">
              <View className="bg-slate-200 w-24 h-24 rounded-full items-center justify-center">
                <Text className="text-slate-900 capitalize font-medium text-3xl">
                  s
                </Text>
              </View>

              <View className="bg-slate-200 px-3 py-1 -mt-5 rounded-lg shadow-xs elevation-xs">
                <Text className="text-slate-900 font-medium text-sm">
                  <Text className="text-lg text-orange-500">#1 </Text>
                  SwapnaSahoo
                </Text>
              </View>
            </View>

            {/* TOP 2 */}
            <View className="flex-row items-center gap-8 mt-6">
              <View className="items-center">
                <View className="bg-slate-300 w-20 h-20 rounded-full items-center justify-center">
                  <Text className="text-slate-900 capitalize font-medium text-3xl">
                    s
                  </Text>
                </View>

                <View className="bg-slate-200 px-3 py-1 -mt-2 rounded-lg">
                  <Text className="text-slate-900 font-medium text-sm">
                    <Text className="text-lg text-orange-500">#2 </Text>
                    SwapnaSahoo
                  </Text>
                </View>
              </View>

              <View className="items-center">
                <View className="bg-slate-300 w-20 h-20 rounded-full items-center justify-center">
                  <Text className="text-slate-900 capitalize font-medium text-3xl">
                    s
                  </Text>
                </View>

                <View className="bg-slate-200 px-3 py-1 -mt-2 rounded-lg">
                  <Text className="text-slate-900 font-medium text-sm">
                    <Text className="text-lg text-orange-500">#3 </Text>
                    SwapnaSahoo
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
};

export default LeaderboardScreen;
