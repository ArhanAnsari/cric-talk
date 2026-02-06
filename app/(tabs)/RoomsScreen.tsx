import { showToast } from "@/libs/showToast";
import { fetchRooms } from "@/services/rooms.service";
import { useRooms } from "@/store/useRooms";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateRoomModal from "../components/CreateRoomModal";
import FilterChip from "../components/FilterChip";
import MatchRoomCard from "../components/MatchRoomCard";
import { LegendList } from "@legendapp/list";

const RoomsScreen = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const rooms = useRooms((s) => s.rooms);
  const setRooms = useRooms((s) => s.setRooms);

  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "live" | "upcoming" | "finished"
  >("all");

  const filteredRooms = useMemo(() => {
    if (selectedFilter === "all") return rooms;
    else return rooms.filter((room) => room.status === selectedFilter);
  }, [rooms, selectedFilter]);

  useEffect(() => {
    let mounted = true;

    async function loadRooms() {
      if (!mounted) return;

      try {
        const data = await fetchRooms();
        setRooms(data);
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
      <View className="w-full h-30 bg-linear-to-br from-orange-500 to-orange-600">
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center justify-between">
            <Pressable
              className="bg-orange-600 size-10 rounded-full items-center justify-center transition-all duration-300 active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="absolute left-0 right-0 items-center">
              <Text className="text-white text-xl font-semibold">Rooms</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* CONTENT */}
      <SafeAreaView>
        {/* FILTER BAR */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 24,
          }}
        >
          {["all", "live", "upcoming", "finished"].map((label, index) => (
            <FilterChip
              key={index}
              label={label}
              selected={selectedFilter === label}
              onPress={() => setSelectedFilter(label as any)}
              width={label === "all" || label === "live" ? "20" : ""}
            />
          ))}
        </ScrollView>

        {/* MATCH ROOM CARD */}
        <LegendList
          data={filteredRooms}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingTop: 20, paddingBottom: 140 }}
          renderItem={({ item }) => <MatchRoomCard room={item} />}
          recycleItems
          ListEmptyComponent={() => (
            <View className="flex-1 items-center gap-2">
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={48}
                color="gray"
              />

              <Text className="text-slate-900 font-medium text-xl">
                No rooms yet!
              </Text>

              <Text className="text-gray-600 text-center max-w-[80%] text-sm">
                Be the first one to start a room and create the legacy!
              </Text>

              <Pressable className="flex-row items-center gap-2 mt-2 bg-orange-500 px-6 py-3 rounded-full transition-all duration-300 ease-in-out active:scale-[0.95] active:opacity-85">
                <Ionicons name="rocket-outline" size={18} color="white" />

                <Text
                  className="text-white font-medium"
                  onPress={() => setIsVisible(true)}
                >
                  Start legacy!
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
        <Ionicons name="add" size={24} color="white" />
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
