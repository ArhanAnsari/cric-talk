import { RoomMessage } from "@/interfaces/RoomMessage";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  item: RoomMessage;
  userId: string;
  setIsEditModalVisible: (visible: boolean) => void;
  setEditMessageContent: (content: string) => void;
  setEditRoomMessageId: (id: string) => void;
  handleDeleteRoomMessage: (RoomMessageId: string) => void;
};

const RoomMessageCard = ({
  item,
  userId,
  setIsEditModalVisible,
  setEditMessageContent,
  setEditRoomMessageId,
  handleDeleteRoomMessage,
}: Props) => {
  return (
    <View className="flex-row gap-2 bg-slate-200 px-3 py-4 rounded-lg items-start mb-4">
      {/* AUTHOR AVATAR */}
      <Pressable className="bg-slate-300 h-10 w-10 items-center justify-center rounded-full">
        <Text className="text-slate-900 font-medium uppercase">
          {item.authorName.charAt(0)}
        </Text>
      </Pressable>

      {/* AUTHOR NAME & MESSAGE */}
      <View className="gap-1">
        <Text className="text-slate-900 text-sm font-semibold">
          {item.authorName}
        </Text>

        <Text className="max-w-[90%] text-slate-600">{item.content}</Text>
      </View>

      {/* EDIT + DELETE BUTTONS */}
      {item.authorId === userId && (
        <View className="flex-row gap-2 ml-auto absolute right-3 top-3">
          <Pressable
            onPress={() => {
              setIsEditModalVisible(true);
              setEditMessageContent(item.content);
              setEditRoomMessageId(item.$id);
            }}
          >
            <Ionicons name="create-outline" size={18} color="#0f172b" />
          </Pressable>

          <Pressable onPress={() => handleDeleteRoomMessage(item.$id)}>
            <Ionicons name="trash-outline" size={18} color="#0f172b" />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default RoomMessageCard;
