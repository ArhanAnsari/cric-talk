import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import useRoomMessage from "@/hooks/useRoomMessage";
import { Room } from "@/interfaces/Room";
import { RoomMessage } from "@/interfaces/RoomMessage";
import { account, client } from "@/libs/appwrite";
import { showToast } from "@/libs/showToast";
import { fetchRoomMessages } from "@/services/roomMessage.service";
import { fetchRooms } from "@/services/rooms.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RoomDetailsCard from "../components/RoomDetailsCard";
import RoomMessageCard from "../components/RoomMessageCard";

const RoomDiscussion = () => {
  const CRIC_TALK_DATABASE_ID =
    process.env.EXPO_PUBLIC_APPWRITE_CRIC_TALK_DATABASE_ID!;
  const ROOM_MESSAGE_TABLE_ID =
    process.env.EXPO_PUBLIC_APPWRITE_ROOM_MESSAGE_TABLE_ID!;

  const { roomId } = useLocalSearchParams();

  const [userId, setUserId] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  const [room, setRoom] = React.useState<Room | null>(null);
  const [roomMessages, setRoomMessages] = useState<RoomMessage[]>([]);

  const [messageContent, setMessageContent] = useState<string>("");
  const [editMessageContent, setEditMessageContent] = useState<string>("");
  const [editRoomMessageId, setEditRoomMessageId] = useState<string>("");
  const canSendMessage = messageContent.trim().length > 0;
  const canEditMessage = editMessageContent.trim().length > 0;

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isRoomDetailsVisible, setIsRoomDetailsVisible] =
    useState<boolean>(false);

  const {
    handleCreateRoomMessage,
    handleUpdateRoomMessage,
    handleDeleteRoomMessage,
  } = useRoomMessage(roomId as string);

  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    let mounted = true;

    async function loadRoomDetails() {
      if (!mounted) return;

      const data = await fetchRooms();
      const roomDetails = data.rows.find((room) => room.$id === roomId);
      setRoom(roomDetails || null);
    }

    async function fetchUserDetails() {
      try {
        const user = await account.get();
        setUserId(user.$id);
        setUsername(user.name || user.email.split("@")[0]);
      } catch (error) {
        showToast({
          type: "error",
          text1: "Error fetching user details",
          text2: "Please try again later.",
        });
      }
    }

    async function loadRoomMessages() {
      try {
        const data = await fetchRoomMessages(roomId as string);
        setRoomMessages(data.rows as any);
      } catch (error) {
        showToast({
          type: "error",
          text1: "Error fetching room messages",
          text2: "Please try again later.",
        });
      }
    }

    loadRoomDetails();
    fetchUserDetails();
    loadRoomMessages();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${CRIC_TALK_DATABASE_ID}.tables.${ROOM_MESSAGE_TABLE_ID}.rows`,
      (res) => {
        if (res.events.includes("databases.*.tables.*.rows.*.create")) {
          const payload: RoomMessage = res.payload as RoomMessage;

          if (payload.roomId === roomId) {
            setRoomMessages((prev) =>
              prev.some((msg) => msg.$id === payload.$id)
                ? prev
                : [payload, ...prev],
            );
          }
        }

        if (res.events.includes("databases.*.tables.*.rows.*.update")) {
          const payload: RoomMessage = res.payload as RoomMessage;

          if (payload.roomId === roomId) {
            setRoomMessages((prev) =>
              prev.map((m) => (m.$id === payload.$id ? payload : m)),
            );
          }
        }

        if (res.events.includes("databases.*.tables.*.rows.*.delete")) {
          const payload: RoomMessage = res.payload as RoomMessage;

          if (payload.roomId === roomId) {
            setRoomMessages((prev) =>
              prev.filter((m) => m.$id !== payload.$id),
            );
          }
        }
      },
    );

    return () => unsubscribe();
  }, [roomId]);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1">
        <View className="w-full h-30 bg-orange-500">
          <SafeAreaView>
            <View className="flex-row items-center px-6 py-4 relative">
              <Pressable
                className="size-10 bg-orange-600 rounded-full items-center justify-center transition-all duration-300 active:scale-[0.98] active:opacity-85"
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={18} color="white" />
              </Pressable>

              <Text
                className={`text-white font-semibold text-lg text-center flex-1 ${room?.authorId === userId ? "-mr-10" : "-ml-6"}`}
              >
                {room?.teams && `${room?.teams[0]} vs ${room?.teams[1]}`}
              </Text>

              <Pressable
                className={`size-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 active:scale-[0.98] active:opacity-85 ${room?.authorId === userId ? "mr-2" : ""}`}
                onPress={() => setIsRoomDetailsVisible(true)}
              >
                <Ionicons name="information" size={18} color="white" />
              </Pressable>

              {/* ROOM MANAGE ICON */}
              {room?.authorId === userId && (
                <Pressable
                  className="size-10 bg-orange-600 items-center justify-center rounded-full transition-all active:scale-[0.98] active:opacity-85"
                  onPress={() => router.push(`/(rooms)/RoomManage/${roomId}`)}
                >
                  <Ionicons name="settings-outline" size={18} color="white" />
                </Pressable>
              )}
            </View>
          </SafeAreaView>
        </View>

        <SafeAreaView>
          <RoomDetailsCard
            roomId={roomId as string}
            room={room as Room}
            isVisible={isRoomDetailsVisible}
            onClose={() => setIsRoomDetailsVisible(false)}
          />

          {/* UPCOMING / FINISHED MATCH BANNER */}
          {room && room?.status !== "live" && (
            <View className="mx-auto">
              <Text className="text-lg text-slate-900 font-medium text-center">
                {room?.status === "upcoming"
                  ? "The room hasn't started yet"
                  : room?.status === "finished"
                    ? "The room has finished"
                    : ""}
              </Text>

              <Text className="text-sm text-slate-600 text-center">
                You can't send or edit messages when a room&nbsp;
                {room?.status === "upcoming"
                  ? "is upcoming."
                  : room?.status == "finished"
                    ? "has been finished."
                    : ""}
              </Text>
            </View>
          )}
        </SafeAreaView>

        <View className="flex-1 -mt-18">
          {/* DISCUSSION AREA */}
          <FlatList
            data={roomMessages}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={{
              paddingTop: 40,
              paddingHorizontal: 24,
              paddingBottom: 24,
            }}
            showsVerticalScrollIndicator={false}
            inverted
            renderItem={({ item }) => (
              // DISCUSSION MESSAGE CARD

              <RoomMessageCard
                item={item}
                userId={userId}
                setIsEditModalVisible={setIsEditModalVisible}
                setEditMessageContent={setEditMessageContent}
                setEditRoomMessageId={setEditRoomMessageId}
                handleDeleteRoomMessage={handleDeleteRoomMessage}
              />
            )}
          />
        </View>
      </View>

      <SafeAreaView
        edges={["bottom"]}
        style={{ marginBottom: keyboardHeight + 8 }}
      >
        {/* MESSAGE INPUT AREA */}
        {room?.status === "live" && (
          <View className="px-6 flex-row items-center bg-white shadow-sm elevation-sm mx-4 rounded-lg py-2">
            {/* MESSAGE INPUT */}
            <TextInput
              value={messageContent}
              onChangeText={setMessageContent}
              placeholder="Comment"
              className="border border-gray-300 rounded-lg pl-4 h-12 flex-1 mr-4"
            />

            {/* MESSAGE ADD BUTTON */}
            <Pressable
              disabled={!canSendMessage}
              className={`h-12 w-12 ${
                canSendMessage ? "bg-orange-500" : "bg-gray-500"
              } rounded-lg items-center justify-center transition-all duration-200 ease-in-out scale-[0.98] active:opacity-85`}
              onPress={() =>
                handleCreateRoomMessage({
                  messageContent,
                  userId,
                  username,
                  setMessageContent,
                })
              }
            >
              <Ionicons name="send-outline" size={18} color="white" />
            </Pressable>
          </View>
        )}
      </SafeAreaView>

      {/* EDIT MESSAGE MODAL */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        {/* OVERLAY */}
        <Pressable
          className="absolute inset-0 bg-gray-950/30"
          onPress={() => setIsEditModalVisible(false)}
        />

        <View className="flex-1 items-center justify-center">
          <View className="bg-white w-80 h-56 rounded-lg shadow-sm elevation-sm px-6 py-4">
            <Text className="text-lg text-slate-900 font-medium">
              Edit Message
            </Text>

            <TextInput
              value={editMessageContent}
              onChangeText={setEditMessageContent}
              placeholder="Edit your message"
              className="border border-gray-300 rounded-lg h-24 mt-2 pl-4"
              textAlignVertical="top"
              multiline
            />

            {/* ACTION BUTTONS */}
            <View className="flex-row items-center gap-2 ml-auto mt-auto">
              <Pressable onPress={() => setIsEditModalVisible(false)}>
                <Text className="text-slate-900">Cancel</Text>
              </Pressable>

              <Pressable
                disabled={!canEditMessage}
                className={`${
                  canEditMessage ? "bg-orange-500" : "bg-gray-500"
                } px-4 py-2 rounded-lg transition-all duration-200 ease-in-out active:scale-[0.98] active:opacity-85`}
                onPress={() =>
                  handleUpdateRoomMessage({
                    editMessageContent,
                    editRoomMessageId,
                    setIsEditModalVisible,
                    setEditMessageContent,
                    setEditRoomMessageId,
                  })
                }
              >
                <Text className="text-white font-medium">Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default RoomDiscussion;
