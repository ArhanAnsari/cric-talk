import { CommentType } from "@/interfaces/CommentType";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  userId: string;
  comment: CommentType;
  onEditPress: () => void;
  onDeletePress: () => void;
};

const CommentCard = ({
  userId,
  comment,
  onEditPress,
  onDeletePress,
}: Props) => {
  return (
    <View className="border-b border-gray-300 pb-4 mt-4">
      {/* AUTHOR INFO */}
      <View className="flex-row items-center gap-2">
        {/* AUTHOR PROFILE IMAGE + DELETE */}
        <Pressable className="bg-slate-300 size-10 items-center justify-center rounded-full">
          <Text className="text-lg font-semibold capitalize text-slate-950">
            {comment.authorId[0]}
          </Text>
        </Pressable>

        {/* AUTHOR NAME */}
        <Text className="text-lg font-medium text-slate-900">
          {comment.authorId}
        </Text>

        {comment.authorId === userId && (
          <View className="flex-row items-center ml-auto gap-2">
            <Pressable onPress={onEditPress}>
              <Ionicons name="pencil-outline" size={18} color="gray" />
            </Pressable>

            <Pressable onPress={onDeletePress}>
              <Ionicons name="trash-outline" size={18} color="gray" />
            </Pressable>
          </View>
        )}
      </View>

      {/* COMMENT CONTENT */}
      <View className="mt-4">
        <Text className="leading-6 text-slate-800">{comment.content}</Text>
      </View>

      {/* PUBLISH DATE */}
      <Text className="text-sm text-slate-600 ml-auto">
        {new Date(comment.$createdAt).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
        })}
      </Text>
    </View>
  );
};

export default CommentCard;
