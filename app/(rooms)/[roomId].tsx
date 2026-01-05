import { Room } from "@/interfaces/Room";
import { RoomMessage } from "@/interfaces/RoomMessage";
import { account } from "@/libs/appwrite";
import { showToast } from "@/libs/showToast";
import {
  createRoomMessage,
  fetchRoomMessages,
} from "@/services/roomMessage.service";
import { fetchRooms } from "@/services/rooms.service";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RoomDiscussion = () => {
  const { roomId } = useLocalSearchParams();

  const [userId, setUserId] = useState<string>("");

  const [room, setRoom] = React.useState<Room | null>(null);
  const [roomMessages, setRoomMessages] = useState<RoomMessage[]>([]);

  const [messageContent, setMessageContent] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function loadRoomDetails() {
      if (!mounted) return;

      const data = await fetchRooms();
      const roomDetails = data.rows.find((room) => room.$id === roomId);
      setRoom(roomDetails || null);
    }

    async function fetchUserId() {
      try {
        const user = await account.get();
        setUserId(user.$id);
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
    fetchUserId();
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
        content: messageContent,
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

  return (
    <KeyboardAvoidingView className="flex-1 bg-white" behavior="padding">
      <View className="flex-1">
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
                  <Text className="ml-auto text-slate-900 text-sm">
                    {roomId}
                  </Text>
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

        <View className="flex-1 -mt-4">
          {/* DISCUSSION AREA */}
          <FlatList
            data={roomMessages}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={{
              paddingBottom: 40,
              paddingHorizontal: 24,
            }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              // DISCUSSION MESSAGE CARD

              <View className="flex-row gap-2 bg-slate-200 px-3 py-4 rounded-lg items-baseline mb-4">
                {/* AUTHOR AVATAR */}
                <Pressable className="bg-slate-300 h-10 w-10 items-center justify-center rounded-full">
                  <Text className="text-slate-900 font-medium uppercase">
                    {item.authorId.charAt(0)}
                  </Text>
                </Pressable>

                {/* AUTHOR NAME & MESSAGE */}
                <View className="gap-1">
                  <Text className="text-slate-900 text-sm font-semibold">
                    {item.authorId}
                  </Text>

                  <Text className="max-w-[95%] text-slate-600">
                    {item.content}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
      </View>

      <SafeAreaView>
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
    </KeyboardAvoidingView>
  );
};

export default RoomDiscussion;
