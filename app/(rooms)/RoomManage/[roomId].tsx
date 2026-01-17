import { useRooms } from "@/store/useRooms";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RoomManage = () => {
  const { roomId } = useLocalSearchParams();

  const rooms = useRooms((s) => s.rooms);
  const room = rooms.find((r) => r.$id === roomId);

  const {
    teams: oldTeams = [],
    startTime: oldStartTime = "",
    endTime: oldEndTime = "",
    matchType: oldMatchType = "ODI",
    isLocked: oldIsLocked = false,
  } = room || {};

  const [team1, setTeam1] = useState<string>(oldTeams[0]);
  const [team2, setTeam2] = useState<string>(oldTeams[1]);
  const [startTime, setStartTime] = useState<string>(oldStartTime);
  const [endTime, setEndTime] = useState<string>(oldEndTime);
  const [matchType, setMatchType] = useState<"ODI" | "TEST" | "T20">(
    oldMatchType,
  );
  const [isLocked, setIsLocked] = useState<boolean>(oldIsLocked);

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          {/* HEADER */}
          <View className="flex-row items-center px-6 py-4">
            <Pressable
              className="w-10 h-10 bg-orange-600 items-center justify-center rounded-full transition-all active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
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
