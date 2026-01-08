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
  const isOwnMessage = item.authorId === userId;

  return (
    <View>
      {/* USER AVATAR */}
      <View
        className={`${
          isOwnMessage
            ? "self-end bg-blue-400 text-white"
            : "self-start bg-gray-400 text-black"
        } mb-1 w-8 h-8 items-center justify-center rounded-full`}
      >
        <Text className="uppercase font-medium">
          {item.authorName.charAt(0)}
        </Text>
      </View>

      {/* MESSAGE BUBBLE */}
      <View
        className={`${
          isOwnMessage ? "bg-blue-400 self-end" : "self-start bg-gray-400"
        } px-3 py-4 mb-2 rounded-lg max-w-[75%] ${
          isOwnMessage
            ? "rounded-tr-3xl rounded-bl-3xl"
            : "rounded-tl-3xl rounded-br-3xl"
        }`}
      >
        {/* AUTHOR NAME */}
        {!isOwnMessage && (
          <Text className="text-black text-sm font-medium mb-2">
            {item.authorName}
          </Text>
        )}

        {/* MESSAGE CONTENT */}
        <Text
          className={`${
            isOwnMessage ? "text-white" : "text-black"
          } tracking-wide leading-5`}
        >
          {item.content}
        </Text>

        {/* SEND DATE */}
        <Text
          className={`${
            isOwnMessage ? "text-blue-100" : "text-gray-100"
          } mt-2 text-sm ml-auto`}
        >
          {new Date(item.$createdAt).toLocaleDateString() ===
          new Date().toLocaleDateString()
            ? new Date(item.$createdAt).toLocaleString("en-IN", {
                timeStyle: "short",
              })
            : new Date(item.$createdAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
        </Text>
      </View>

      {/* EDIT + DELETE BUTTONS */}
      {isOwnMessage && (
        <View className="self-end flex-row gap-2 mb-4">
          <Pressable
            onPress={() => {
              setIsEditModalVisible(true);
              setEditRoomMessageId(item.$id);
              setEditMessageContent(item.content);
            }}
          >
            <Ionicons name="create-outline" size={18} color="black" />
          </Pressable>

          <Pressable onPress={() => handleDeleteRoomMessage(item.$id)}>
            <Ionicons name="trash-outline" size={18} color="black" />
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default RoomMessageCard;
