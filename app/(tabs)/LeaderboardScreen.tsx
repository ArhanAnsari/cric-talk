import { UserStats } from "@/interfaces/UserStats";
import { showToast } from "@/libs/showToast";
import { fetchUsersStats } from "@/services/userStats.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeaderboardPodiumUser from "../components/LeaderboardPodiumUser";

const LeaderboardScreen = () => {
  const [userStatsLeaderboard, setUserStatsLeaderboard] = useState<UserStats[]>(
    []
  );

  useEffect(() => {
    let mounted = true;

    async function loadUsersMessageCount() {
      if (!mounted) return;

      try {
        const data = await fetchUsersStats();
        setUserStatsLeaderboard(data.rows);
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
            <LeaderboardPodiumUser
              userStat={userStatsLeaderboard[0]}
              rank={1}
            />

            {/* TOP 2 */}
            <View className="flex-row items-center gap-8 mt-6">
              <LeaderboardPodiumUser
                userStat={userStatsLeaderboard[1]}
                rank={2}
              />

              <LeaderboardPodiumUser
                userStat={userStatsLeaderboard[2]}
                rank={3}
              />
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View className="mt-6 px-6">
        {/* LEADERBOARD LIST */}
        <FlatList
          data={userStatsLeaderboard.slice(3, 3 + 7)}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 80 }}
          showsVerticalScrollIndicator={false}
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
