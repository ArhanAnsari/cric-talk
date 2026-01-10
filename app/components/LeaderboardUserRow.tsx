import { UserStats } from "@/interfaces/UserStats";
import React from "react";
import { Text, View } from "react-native";

type Props = {
  user: UserStats;
  rank: number;
};

const LeaderboardUserRow = ({ user, rank }: Props) => {
  return (
    <View className="w-full h-16 bg-slate-200 rounded-lg shadow-sm elevation-xs transition-all duration-300 active:scale-[0.98] active:opacity-85 px-4 flex-row items-center mb-4">
      <View className="bg-orange-500 w-10 h-10 items-center justify-center rounded-full">
        <Text className="text-white font-medium">#{rank}</Text>
      </View>

      <View className="ml-4">
        <Text className="text-slate-900 font-medium">{user.username}</Text>
        <Text className="text-xs text-slate-500">
          {user.messageCount} message
          {user.messageCount === 1 ? "" : "s"}
        </Text>
      </View>

      <Text className="ml-auto font-medium text-slate-800">
        {new Intl.NumberFormat("en-IN", { notation: "compact" }).format(
          user.messageCount
        )}
      </Text>
    </View>
  );
};

export default LeaderboardUserRow;
