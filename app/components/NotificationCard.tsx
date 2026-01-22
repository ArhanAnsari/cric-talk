import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  title: string;
  content: string;
  $createdAt: string;
};

const NotificationCard = ({ notification }: { notification: Props }) => {
  return (
    <Pressable className="bg-white p-4 rounded-xl shadow-md elevation-xs border border-slate-300 mb-6 transition-all duration-300 ease-in-out active:scale-[0.95] active:opacity-85">
      {/* TITLE */}
      <View className="flex-row items-center gap-3">
        <View className="bg-slate-100 size-10 items-center justify-center rounded-full">
          <Ionicons name="notifications-outline" size={18} color="#0f172b" />
        </View>

        <Text className="font-medium text-slate-900">{notification.title}</Text>

        <View className="ml-auto bg-slate-100 px-2 py-0.5 rounded-full">
          <Text className="text-sm text-slate-600 font-medium">
            {Math.floor(
              (Date.now() - new Date(notification.$createdAt).getTime()) /
                1000 /
                60 /
                60,
            )}{" "}
            hr ago
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <View>
        <Text className="mt-2 text-sm leading-6 text-slate-700">
          {notification.content}
        </Text>
      </View>
    </Pressable>
  );
};

export default NotificationCard;
