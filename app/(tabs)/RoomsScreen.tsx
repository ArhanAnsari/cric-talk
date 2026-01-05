import { Ionicons, Octicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RoomsScreen = () => {
  const [isVisible, setIsVisible] = useState(true);

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
        <View className="mx-6 px-6 py-4 bg-white shadow-sm elevation-sm rounded-lg transition-all duration-300 active:scale-[0.97] active:opacity-85">
          {/* TEAMS */}
          <View className="flex-row items-center justify-between">
            {/* TEAM 1 */}
            <Pressable className="bg-gray-300 w-12 h-12 items-center justify-center rounded-full">
              <Text className="text-slate-900 font-semibold">AUS</Text>
            </Pressable>

            {/* TEAM FULL NAME */}
            <Text className="text-slate-900 font-medium text-lg">
              Australia vs India
            </Text>

            {/* TEAM 2 */}
            <Pressable className="bg-gray-300 w-12 h-12 items-center justify-center rounded-full">
              <Text className="text-slate-900 font-semibold">IND</Text>
            </Pressable>
          </View>

          {/* MATCH STATUS */}
          <View className="bg-green-400 mx-auto py-1 px-3 rounded-full">
            <Text className="text-white text-xs uppercase font-semibold">
              Live
            </Text>
          </View>

          {/* ROOM JOIN BUTTON */}
          <Pressable className="bg-orange-500 px-6 py-3 rounded-lg items-center justify-center mt-4 transition-all duration-300 active:scale-[0.98] active:opacity-85">
            <Text className="text-white font-semibold text-lg">Join Room</Text>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* CREATE ROOM BUTTON */}
      <Pressable
        className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center absolute bottom-6 right-6 shadow-md elevation-xs"
        onPress={() => setIsVisible(!isVisible)}
      >
        <Octicons name="plus" size={24} color="white" />
      </Pressable>

      {/* CREATE ROOM MODAL */}
      <Modal visible={true} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center">
          {/* OVERLAY */}
          <Pressable
            className="absolute inset-0 bg-gray-950/20"
            onPress={() => setIsVisible(false)}
          />

          {/* MODAL CONTENT */}
          <View className="bg-white w-80 h-120 shadow-sm elevation-sm rounded-lg px-6 py-4">
            <Text className="text-slate-900 font-semibold text-center text-lg">
              Create Room
            </Text>

            <View className="mt-4 gap-2">
              <Text className="text-600 font-medium">Team 1</Text>
              <TextInput
                placeholder="Enter team name"
                className="border border-gray-300 rounded-lg pl-4"
              />
            </View>

            <View className="mt-4 gap-2">
              <Text className="text-600 font-medium">Team 2</Text>
              <TextInput
                placeholder="Enter team name"
                className="border border-gray-300 rounded-lg pl-4"
              />
            </View>

            <Pressable className="bg-orange-500 px-6 py-3 rounded-lg mt-6 transition-all duration-300 active:opacity-85 active:scale-[0.98]">
              <Text className="text-center text-white font-semibold text-lg">
                Create Room
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RoomsScreen;
