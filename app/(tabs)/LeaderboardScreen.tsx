import { UserStats } from "@/interfaces/UserStats";
import { showToast } from "@/libs/showToast";
import { fetchUsersMessageCount } from "@/services/messageCount.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LeaderboardScreen = () => {
  const [messageLeaderboard, setMessageLeaderboard] = useState<UserStats[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadUsersMessageCount() {
      if (!mounted) return;

      try {
        const data = await fetchUsersMessageCount();
        setMessageLeaderboard(data.rows);
      } catch (error) {
        showToast({
          type: "error",
          text1: "Error fetching message count leaderboard",
          text2: "Please try again later.",
        });
      }
    }
    loadUsersMessageCount();

    return () => {
      mounted = false;
    };
  }, []);

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
                  {messageLeaderboard[0]?.username?.[0] ?? "-"}
                </Text>
              </View>

              <View className="bg-slate-200 px-3 py-1 -mt-5 rounded-lg shadow-xs elevation-xs">
                <Text className="text-slate-900 font-medium text-sm">
                  <Text className="text-lg text-orange-500">#1 </Text>
                  {messageLeaderboard[0]?.username || "-"}
                </Text>
              </View>
            </View>

            {/* TOP 2 */}
            <View className="flex-row items-center gap-8 mt-6">
              <View className="items-center">
                <View className="bg-slate-300 w-20 h-20 rounded-full items-center justify-center">
                  <Text className="text-slate-900 capitalize font-medium text-3xl">
                    {messageLeaderboard[1]?.username?.[0] ?? "-"}
                  </Text>
                </View>

                <View className="bg-slate-200 px-3 py-1 -mt-2 rounded-lg">
                  <Text className="text-slate-900 font-medium text-sm">
                    <Text className="text-lg text-orange-500">#2 </Text>
                    {messageLeaderboard[1]?.username ?? "-"}
                  </Text>
                </View>
              </View>

              <View className="items-center">
                <View className="bg-slate-300 w-20 h-20 rounded-full items-center justify-center">
                  <Text className="text-slate-900 capitalize font-medium text-3xl">
                    {messageLeaderboard[2]?.username?.[0] ?? "-"}
                  </Text>
                </View>

                <View className="bg-slate-200 px-3 py-1 -mt-2 rounded-lg">
                  <Text className="text-slate-900 font-medium text-sm">
                    <Text className="text-lg text-orange-500">#3 </Text>
                    {messageLeaderboard[2]?.username ?? "-"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View className="mt-6 px-6">
        {/* LEADERBOARD LIST */}
        <FlatList
          data={messageLeaderboard.slice(3, 3 + 7)}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
          maxToRenderPerBatch={}
          renderItem={({ item, index }) => (
            <View className="w-full h-16 bg-slate-200 rounded-lg shadow-sm elevation-xs transition-all duration-300 active:scale-[0.98] active:opacity-85 px-4 flex-row items-center">
              <View className="bg-orange-500 w-10 h-10 items-center justify-center rounded-full">
                <Text className="text-white font-medium">#{index + 4}</Text>
              </View>

              <View className="ml-4">
                <Text className="text-slate-900 font-medium">
                  {item.username}
                </Text>
                <Text className="text-xs text-slate-500">
                  {item.messageCount} message
                  {item.messageCount === 1 ? "" : "s"}
                </Text>
              </View>

              <Text className="ml-auto font-medium text-slate-800">
                {new Intl.NumberFormat("en-IN", { notation: "compact" }).format(
                  item.messageCount
                )}
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default LeaderboardScreen;
