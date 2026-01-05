import { Room } from "@/interfaces/Room";
import { fetchRooms } from "@/services/rooms.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RoomDiscussion = () => {
  const { roomId } = useLocalSearchParams();

  const [room, setRoom] = React.useState<Room | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadRoomDetails() {
      if (!mounted) return;

      const data = await fetchRooms();
      const roomDetails = data.rows.find((room) => room.$id === roomId);
      setRoom(roomDetails || null);
    }
    loadRoomDetails();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          <View className="flex-row items-center px-6 py-4">
            <Pressable
              className="w-10 h-10 bg-orange-600 rounded-full items-center justify-center transition-all duration-300 active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <Text className="text-white font-semibold text-lg text-center flex-1 -ml-6">
              India vs Australia
            </Text>
          </View>
        </SafeAreaView>
      </View>

      {/* CONTENT */}
      <SafeAreaView>
        <View className="px-6 py-4">
          {/* ROOM DETAILS CARD */}
          <View className="bg-slate-50 h-50 w-full rounded-lg shadow-sm elevation-lg px-4 py-2">
            {/* MATCH TITLE */}
            <Text className="text-slate-900 text-lg text-center font-semibold">
              India vs Australia
            </Text>

            {/* MATCH INFO */}
            <View className="mt-6 gap-2">
              <View className="flex-row">
                <Text className="text-slate-500">Match ID</Text>
                <Text className="ml-auto text-slate-900 text-sm">{roomId}</Text>
              </View>

              <View className="flex-row items-center">
                <Text className="text-slate-500">Match Type</Text>
                <View className="ml-auto bg-orange-500/10 px-2 py-0.5 rounded-full">
                  <Text className="text-orange-500 font-semibold text-sm">
                    ODI
                  </Text>
                </View>
              </View>

              <View className="flex-row">
                <Text className="text-slate-500">Start Time</Text>
                <Text className="ml-auto text-slate-900 text-sm">
                  5 Jan 2026, 07:00 PM
                </Text>
              </View>

              <View className="flex-row">
                <Text className="text-slate-500">End Time</Text>
                <Text className="ml-auto text-slate-900 text-sm">
                  5 Jan 2026, 10:00 PM
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default RoomDiscussion;
