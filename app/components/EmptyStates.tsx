import { Ionicons } from "@expo/vector-icons";
import { View, Text, Pressable } from "react-native";

export const PostListEmptyComponent = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  return (
    <View className="flex-1 items-center justify-center gap-2">
      <Ionicons name="chatbubble-outline" size={48} color="gray" />

      <Text className="text-slate-900 font-medium text-xl">No posts yet!</Text>

      <Text className="max-w-[80%] text-center text-slate-600 text-sm">
        Be the first one to start the legacy conversation!
      </Text>

      <Pressable
        className="flex-row items-center gap-2 mt-2 bg-orange-500 px-6 py-3 rounded-full transition-all duration-300 ease-in-out active:scale-[0.95] active:opacity-85"
        onPress={onPress}
      >
        <Ionicons name="rocket-outline" size={18} color="white" />
        <Text className="text-white font-medium">Create one!</Text>
      </Pressable>
    </View>
  );
};

export const CommentListEmptyComponent = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  return (
    <View className="flex-1 items-center gap-2">
      <Ionicons name="chatbox-ellipses-outline" size={48} color="gray" />

      <Text className="text-slate-900 text-xl font-medium">
        No comments yet!
      </Text>

      <Text className="max-w-[80%] text-center text-slate-600 text-sm">
        Be the first one to comment and start a discussion!
      </Text>

      <Pressable
        className="flex-row items-center gap-2 mt-2 bg-orange-500 px-6 py-3 rounded-full transition-all duration-300 ease-in-out active:scale-[0.95] active:opacity-85"
        onPress={onPress}
      >
        <Ionicons name="rocket-outline" size={18} color="white" />

        <Text className="font-medium text-white">Comment now!</Text>
      </Pressable>
    </View>
  );
};

export const RoomListEmptyComponent = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  return (
    <View className="flex-1 items-center gap-2">
      <Ionicons name="chatbubble-ellipses-outline" size={48} color="gray" />

      <Text className="text-slate-900 font-medium text-xl">No rooms yet!</Text>

      <Text className="text-gray-600 text-center max-w-[80%] text-sm">
        Be the first one to start a room and create the legacy!
      </Text>

      <Pressable
        className="flex-row items-center gap-2 mt-2 bg-orange-500 px-6 py-3 rounded-full transition-all duration-300 ease-in-out active:scale-[0.95] active:opacity-85"
        onPress={onPress}
      >
        <Ionicons name="rocket-outline" size={18} color="white" />

        <Text className="text-white font-medium">Start legacy!</Text>
      </Pressable>
    </View>
  );
};

export const RoomMessageListEmptyComponent = ({
  onPress,
}: {
  onPress: () => void;
}) => {
  return (
    <View className="flex-1 items-center gap-2">
      <Ionicons name="chatbubble-ellipses-outline" size={48} color="gray" />

      <Text className="text-slate-900 text-xl font-medium">
        No messages yet!
      </Text>

      <Text className="text-slate-600 max-w-[98%] text-center text-sm">
        Be the first to send a message and start the conversation!
      </Text>

      <Pressable
        className="flex-row items-center gap-2 mt-2 bg-orange-500 px-6 py-3 rounded-full transition-all duration-300 ease-in-out active:scale-[0.95] active:opacity-85"
        onPress={onPress}
      >
        <Ionicons name="rocket-outline" size={18} color="white" />
        <Text className="text-white font-medium">Message now!</Text>
      </Pressable>
    </View>
  );
};
