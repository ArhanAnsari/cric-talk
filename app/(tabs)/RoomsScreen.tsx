import { showToast } from "@/libs/showToast";
import { fetchRooms } from "@/services/rooms.service";
import { useRooms } from "@/store/useRooms";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateRoomModal from "../components/CreateRoomModal";
import FilterChip from "../components/FilterChip";
import MatchRoomCard from "../components/MatchRoomCard";
import { LegendList } from "@legendapp/list";
import { EmptyState } from "../components/EmptyStates";

const RoomsScreen = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const rooms = useRooms((s) => s.rooms);
  const setRooms = useRooms((s) => s.setRooms);

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [selectedFilter, setSelectedFilter] = useState<
    "all" | "live" | "upcoming" | "finished"
  >("all");

  const filteredRooms = useMemo(() => {
    if (selectedFilter === "all") return rooms;
    else return rooms.filter((room) => room.status === selectedFilter);
  }, [rooms, selectedFilter]);

  const screenHeight = Dimensions.get("screen").height;

  async function onRefresh() {
    setRefreshing(true);
    setLoading(true);

    // fetch rooms
    try {
      const data = await fetchRooms();
      setRooms(data);
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error refreshing rooms",
        text2: "Please try again later.",
      });
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }

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
      } finally {
        setLoading(false);
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
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#ff6900"
            style={{ marginTop: screenHeight * 0.25 }}
          />
        ) : (
          <LegendList
            data={filteredRooms}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={{ paddingTop: 20, paddingBottom: 140 }}
            renderItem={({ item }) => <MatchRoomCard room={item} />}
            recycleItems
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#ff6900"]}
              />
            }
            ListEmptyComponent={
              <EmptyState type="room" onPress={() => setIsVisible(true)} />
            }
          />
        )}
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
