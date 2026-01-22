import { Room } from "@/interfaces/Room";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const MatchRoomCard = ({ room }: { room: Room }) => {
  let status;

  const now = Date.now();
  const start = new Date(room.startTime).getTime();
  const end = new Date(room.endTime ?? "").getTime();

  if (end < now) {
    status = "finished";
  } else if (start > now) {
    status = "upcoming";
  } else {
    status = "live";
  }

  return (
    <View className="mx-6 px-6 py-4 bg-white shadow-sm elevation-sm rounded-lg transition-all duration-300 active:scale-[0.97] active:opacity-85 mb-6">
      {/* TEAMS */}
      <View className="flex-row items-center justify-between">
        {/* TEAM 1 */}
        <Pressable className="bg-gray-300 w-12 h-12 items-center justify-center rounded-full">
          <Text className="text-slate-900 font-semibold">
            {room.teams[0].slice(0, 3).toUpperCase()}
          </Text>
        </Pressable>

        {/* TEAM FULL NAME */}
        <Text className="text-slate-900 font-medium text-lg">
          {room.teams[0]} vs {room.teams[1]}
        </Text>

        {/* TEAM 2 */}
        <Pressable className="bg-gray-300 w-12 h-12 items-center justify-center rounded-full">
          <Text className="text-slate-900 font-semibold">
            {room.teams[1].slice(0, 3).toUpperCase()}
          </Text>
        </Pressable>
      </View>

      {/* MATCH STATUS */}
      <View
        className={`${
          status === "live"
            ? "bg-green-500"
            : status === "upcoming"
              ? "bg-yellow-500"
              : "bg-red-500"
        } mx-auto py-1 px-3 rounded-full`}
      >
        <Text className="text-white text-xs uppercase font-semibold">
          {status}
        </Text>
      </View>

      {/* ROOM JOIN BUTTON */}
      <Pressable
        className="bg-orange-500 px-6 py-3 rounded-lg items-center justify-center mt-4 transition-all duration-300 active:scale-[0.98] active:opacity-85"
        onPress={() => router.push(`/(rooms)/${room.$id}`)}
      >
        <Text className="text-white font-semibold text-lg">
          {room.status === "live" ? "Join Room" : "View Room"}
        </Text>
      </Pressable>
    </View>
  );
};

export default MatchRoomCard;
