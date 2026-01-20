import { UserStats } from "@/interfaces/UserStats";
import { Text, View } from "react-native";

type Props = {
  userStat: UserStats;
  rank: 1 | 2 | 3;
};

const LeaderboardPodiumUser = ({ userStat, rank }: Props) => {
  return (
    <View className="items-center">
      <View
        className={`${
          rank === 1 ? "bg-slate-200 w-24 h-24" : "bg-slate-300 h-20 w-20"
        } rounded-full items-center justify-center`}
      >
        <Text className="text-slate-900 capitalize font-medium text-3xl">
          {userStat?.username[0] ?? "-"}
        </Text>
      </View>

      <View
        className={`bg-slate-200 px-3 py-1 rounded-lg shadow-xs elevation-xs ${
          rank === 1 ? "-mt-5" : "-mt-2"
        }`}
      >
        <Text className="text-slate-900 font-medium text-sm">
          <Text className="text-lg text-orange-500">#{rank} </Text>
          {userStat?.username || "-"}
        </Text>
      </View>
    </View>
  );
};

export default LeaderboardPodiumUser;
