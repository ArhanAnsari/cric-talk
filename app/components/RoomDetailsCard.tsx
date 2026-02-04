import { Room } from "@/schemas/RoomSchema";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

type Props = {
  roomId: string;
  room: Room;
  isVisible: boolean;
  onClose: () => void;
};

const RoomDetailsCard = ({ roomId, room, isVisible, onClose }: Props) => {
  return (
    <Modal visible={isVisible} transparent animationType="slide">
      {/* OVERLAY */}
      <Pressable
        className="absolute inset-0 bg-gray-950/30"
        onPress={onClose}
      />

      {/* CONTENT */}
      <View className="flex-1 justify-center">
        <View className="px-6 py-4">
          {/* ROOM DETAILS CARD */}
          <View className="bg-slate-50 h-65 w-full rounded-lg shadow-sm elevation-lg px-4 py-2">
            {/* MATCH TITLE + CLOSE ICON */}
            <View className="flex-row ">
              <Text className="text-slate-900 text-lg font-semibold text-center flex-1">
                {room?.teams[0]} vs {room?.teams[1]}
              </Text>
            </View>

            {/* MATCH INFO */}
            <View className="mt-6 gap-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="pricetag-outline" size={14} color="#45556c" />
                <Text className="text-slate-500">Room ID</Text>
                <Text className="ml-auto text-slate-900 text-sm">{roomId}</Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Ionicons name="trophy-outline" size={14} color="#45556c" />
                <Text className="text-slate-500">Match Type</Text>
                <View className="ml-auto bg-orange-500/10 px-2 py-0.5 rounded-full">
                  <Text className="text-orange-500 font-semibold text-sm">
                    {room?.matchType}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                <Ionicons name="time-outline" size={14} color="#45556c" />
                <Text className="text-slate-500">Start Time</Text>
                <Text className="ml-auto text-slate-900 text-sm">
                  {new Date(room?.startTime || "").toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <Ionicons name="stop-outline" size={14} color="#45556c" />
                <Text className="text-slate-500">End Time</Text>
                <Text className="ml-auto text-slate-900 text-sm">
                  {new Date(room?.endTime || "").toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </Text>
              </View>
            </View>

            {/* CLOSE BUTTON */}
            <Pressable
              className="mt-auto items-center px-6 py-3 rounded-lg border border-slate-300"
              onPress={onClose}
            >
              <Text>Close</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RoomDetailsCard;
