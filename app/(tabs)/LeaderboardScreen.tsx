import { UserStats } from "@/interfaces/UserStats";
import { functions } from "@/libs/appwrite";
import { showToast } from "@/libs/showToast";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LeaderboardPodiumUser from "../components/LeaderboardPodiumUser";
import LeaderboardUserRow from "../components/LeaderboardUserRow";
import { LegendList } from "@legendapp/list";

const LeaderboardScreen = () => {
  const [userStatsLeaderboard, setUserStatsLeaderboard] = useState<UserStats[]>(
    [],
  );

  useEffect(() => {
    let mounted = true;

    async function loadUsersMessageCount() {
      if (!mounted) return;

      try {
        const data = await functions.createExecution({
          functionId:
            process.env.EXPO_PUBLIC_APPWRITE_LEADERBOARD_GUARD_FUNCTION_ID!,
          async: false,
        });
        const leaderboardData = JSON.parse(data.responseBody).rows;

        setUserStatsLeaderboard(leaderboardData);
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
            <Pressable
              className="size-10 bg-orange-600 rounded-full items-center justify-center transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
              onPress={() => router.push("/(tabs)/RoomsScreen")}
            >
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

      {/* LEADERBOARD LIST */}

      <LegendList
        data={userStatsLeaderboard.slice(3, 3 + 7)}
        keyExtractor={(item) => item.$id}
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 24,
          paddingVertical: 16,
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <LeaderboardUserRow user={item} rank={index + 1} />
        )}
        recycleItems
      />
    </View>
  );
};

export default LeaderboardScreen;
