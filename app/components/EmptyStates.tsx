import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";

const EmptyStateIcon = {
  post: "chatbubble-outline",
  comment: "chatbox-ellipses-outline",
  room: "chatbubble-ellipses-outline",
  roomMessage: "chatbubble-ellipses-outline",
} as const;

const EmptyStateTitle = {
  post: "No posts yet!",
  comment: "No comments yet!",
  room: "No rooms yet!",
  roomMessage: "No messages yet!",
};

const EmptyStateDescription = {
  post: "Be the first one to start the legacy conversation!",
  comment: "Be the first one to comment and start a discussion!",
  room: "Be the first one to start a room and create the legacy!",
  roomMessage: "Be the first to send a message and start the conversation!",
};

const EmptyStateButtonText = {
  post: "Create one!",
  comment: "Comment now!",
  room: "Start legacy!",
  roomMessage: "Message now!",
};

type EmptyStateProps = {
  type: "post" | "comment" | "room" | "roomMessage";
  onPress: () => void;
};

export const EmptyState = ({ type, onPress }: EmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center gap-2">
      <Ionicons name={EmptyStateIcon[type]} size={48} color="gray" />

      <Text className="text-slate-900 font-medium text-xl">
        {EmptyStateTitle[type]}
      </Text>

      <Text className="max-w-[80%] text-center text-slate-600 text-sm">
        {EmptyStateDescription[type]}
      </Text>

      <Pressable
        className="flex-row items-center gap-2 mt-2 bg-orange-500 px-6 py-3 rounded-full transition-all duration-300 ease-in-out active:scale-[0.95] active:opacity-85"
        onPress={onPress}
      >
        <Ionicons name="rocket-outline" size={18} color="white" />
        <Text className="text-white font-medium">
          {EmptyStateButtonText[type]}
        </Text>
      </Pressable>
    </View>
  );
};
