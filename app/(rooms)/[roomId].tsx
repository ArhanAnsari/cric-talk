import { Room } from "@/interfaces/Room";
import { RoomMessage } from "@/interfaces/RoomMessage";
import { account, client } from "@/libs/appwrite";
import { showToast } from "@/libs/showToast";
import {
  createRoomMessage,
  deleteRoomMessage,
  fetchRoomMessages,
  updateRoomMessage,
} from "@/services/roomMessage.service";
import { fetchRooms } from "@/services/rooms.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RoomDetailsCard from "./RoomDetailsCard";

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

  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [isRoomDetailsVisible, setIsRoomDetailsVisible] =
    useState<boolean>(false);

  useEffect(() => {
    const keyboardShown = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      }
    );

    const keyboardHidden = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (e) => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardShown.remove();
      keyboardHidden.remove();
    };
  });

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

  async function handleCreateRoomMessage() {
    try {
      await createRoomMessage({
        roomId: roomId as string,
        authorId: userId,
        authorName: username,
        content: messageContent,
        isEdited: false,
      });
      setMessageContent("");
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error sending message",
        text2: "Please try again later.",
      });
    }
  }

  async function handleUpdateRoomMessage() {
    try {
      await updateRoomMessage({
        roomMessageId: editRoomMessageId,
        content: editMessageContent,
      });
      setIsEditModalVisible(false);
      setEditMessageContent("");
      setEditRoomMessageId("");

      showToast({
        type: "success",
        text1: "Message updated successfully",
      });
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error updating message",
        text2: "Please try again later.",
      });
    }
  }

  async function handleDeleteRoomMessage(roomMessageId: string) {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRoomMessage(roomMessageId);
              showToast({
                type: "success",
                text1: "Message deleted successfully",
              });
            } catch (error) {
              showToast({
                type: "error",
                text1: "Error deleting message",
                text2: "Please try again later.",
              });
            }
          },
        },
      ]
    );
  }

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
                : [payload, ...prev]
            );
          }
        }

        if (res.events.includes("databases.*.tables.*.rows.*.update")) {
          const payload: RoomMessage = res.payload as RoomMessage;

          if (payload.roomId === roomId) {
            setRoomMessages((prev) =>
              prev.map((m) => (m.$id === payload.$id ? payload : m))
            );
          }
        }

        if (res.events.includes("databases.*.tables.*.rows.*.delete")) {
          const payload: RoomMessage = res.payload as RoomMessage;

          if (payload.roomId === roomId) {
            setRoomMessages((prev) =>
              prev.filter((m) => m.$id !== payload.$id)
            );
          }
        }
      }
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
                className="w-10 h-10 bg-orange-600 rounded-full items-center justify-center transition-all duration-300 active:scale-[0.98] active:opacity-85"
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={18} color="white" />
              </Pressable>

              <Text className="text-white font-semibold text-lg text-center flex-1 -ml-6">
                India vs Australia
              </Text>

              <Pressable
                className="w-10 h-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 active:scale-[0.98] active:opacity-85 absolute right-6"
                onPress={() => setIsRoomDetailsVisible(true)}
              >
                <Ionicons name="information" size={18} color="white" />
              </Pressable>
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
        </SafeAreaView>

        <View className="flex-1 -mt-14 ">
          {/* DISCUSSION AREA */}
          <FlatList
            data={roomMessages}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={{
              paddingTop: 40,
              paddingHorizontal: 24,
            }}
            showsVerticalScrollIndicator={false}
            inverted
            renderItem={({ item }) => (
              // DISCUSSION MESSAGE CARD

              <View className="flex-row gap-2 bg-slate-200 px-3 py-4 rounded-lg items-baseline mb-4">
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

                  <Text className="max-w-[95%] text-slate-600">
                    {item.content}
                  </Text>
                </View>

                {/* EDIT + DELETE BUTTONS */}
                {item.authorId === userId && (
                  <View className="flex-row gap-2 ml-auto">
                    <Pressable
                      onPress={() => {
                        setIsEditModalVisible(true);
                        setEditMessageContent(item.content);
                        setEditRoomMessageId(item.$id);
                      }}
                    >
                      <Ionicons
                        name="create-outline"
                        size={18}
                        color="#0f172b"
                      />
                    </Pressable>

                    <Pressable
                      onPress={() => handleDeleteRoomMessage(item.$id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#0f172b"
                      />
                    </Pressable>
                  </View>
                )}
              </View>
            )}
          />
        </View>
      </View>

      <SafeAreaView
        edges={["bottom"]}
        style={{ marginBottom: keyboardHeight + 8 }}
      >
        {/* MESSAGE INPUT AREA */}
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
            className="h-12 w-12 bg-orange-500 rounded-lg items-center justify-center"
            onPress={handleCreateRoomMessage}
          >
            <Ionicons name="send-outline" size={18} color="white" />
          </Pressable>
        </View>
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
                className="bg-orange-500 px-4 py-2 rounded-lg"
                onPress={handleUpdateRoomMessage}
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
