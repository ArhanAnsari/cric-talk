import { Room } from "@/interfaces/Room";
import { showToast } from "@/libs/showToast";
import { fetchRooms } from "@/services/rooms.service";
import { Ionicons, Octicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateRoomModal from "../components/CreateRoomModal";

const RoomsScreen = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    let mounted = true;

    async function loadRooms() {
      if (!mounted) return;

      try {
        const data = await fetchRooms();
        setRooms(data.rows);
      } catch (error) {
        showToast({
          type: "error",
          text1: "Error fetching rooms",
          text2: "Please try again later.",
        });
      }
    }
    loadRooms();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center justify-between">
            <Pressable className="bg-orange-600 h-10 p-2 rounded-full items-center justify-center transition-all duration-300 active:scale-[0.98] active:opacity-85">
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <Text className="text-white text-xl font-semibold">Rooms</Text>

            <Pressable className="bg-orange-600 h-10 p-2 rounded-full items-center justify-center transition-all duration-300 active:scale-[0.98] active:opacity-85">
              <Ionicons name="settings-outline" size={18} color="white" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      {/* CONTENT */}
      <SafeAreaView>
        {/* MATCH ROOM CARD */}
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingTop: 4, paddingBottom: 80 }}
          renderItem={({ item }) => (
            <View className="mx-6 px-6 py-4 bg-white shadow-sm elevation-sm rounded-lg transition-all duration-300 active:scale-[0.97] active:opacity-85 mb-6">
              {/* TEAMS */}
              <View className="flex-row items-center justify-between">
                {/* TEAM 1 */}
                <Pressable className="bg-gray-300 w-12 h-12 items-center justify-center rounded-full">
                  <Text className="text-slate-900 font-semibold">
                    {item.teams[0].slice(0, 3).toUpperCase()}
                  </Text>
                </Pressable>

                {/* TEAM FULL NAME */}
                <Text className="text-slate-900 font-medium text-lg">
                  {item.teams[0]} vs {item.teams[1]}
                </Text>

                {/* TEAM 2 */}
                <Pressable className="bg-gray-300 w-12 h-12 items-center justify-center rounded-full">
                  <Text className="text-slate-900 font-semibold">
                    {item.teams[1].slice(0, 3).toUpperCase()}
                  </Text>
                </Pressable>
              </View>

              {/* MATCH STATUS */}
              <View
                className={`${
                  item.status === "live"
                    ? "bg-green-500"
                    : item.status === "upcoming"
                    ? "bg-yellow-500"
                    : "bg-red-500"
                } mx-auto py-1 px-3 rounded-full`}
              >
                <Text className="text-white text-xs uppercase font-semibold">
                  {item.status}
                </Text>
              </View>

              {/* ROOM JOIN BUTTON */}
              <Pressable className="bg-orange-500 px-6 py-3 rounded-lg items-center justify-center mt-4 transition-all duration-300 active:scale-[0.98] active:opacity-85">
                <Text className="text-white font-semibold text-lg">
                  {item.status === "live" ? "Join Room" : "View Room"}
                </Text>
              </Pressable>
            </View>
          )}
        />
      </SafeAreaView>

      {/* CREATE ROOM BUTTON */}
      <Pressable
        className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center absolute bottom-6 right-6 shadow-md elevation-xs"
        onPress={() => setIsVisible(!isVisible)}
      >
        <Octicons name="plus" size={24} color="white" />
      </Pressable>

      {/* CREATE ROOM MODAL */}
      <CreateRoomModal
        visible={isVisible}
        onClose={() => setIsVisible(false)}
      />
    </View>
  );
};

export default RoomsScreen;
