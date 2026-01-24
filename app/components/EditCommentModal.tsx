import { CommentType } from "@/interfaces/Post";
import { showToast } from "@/libs/showToast";
import { executeComment } from "@/services/comments.service";
import { useComments } from "@/store/useComments";
import { Ionicons } from "@expo/vector-icons";
import React, { Dispatch, SetStateAction, useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  selectedCommentId: string;
  initialComment: string;
};

const EditCommentModal = ({
  isVisible,
  onClose,
  selectedCommentId,
  initialComment,
}: Props) => {
  const updateCommentState = useComments((s) => s.updateComment);

  const [newComment, setNewComment] = useState<string>("");
  const isCommentModified: boolean =
    initialComment.trim() !== newComment.trim() && newComment.trim() !== "";

  async function handleUpdateComment(commentId: string) {
    try {
      const execution = await executeComment({
        action: "update",
        commentId,
        content: newComment,
      });
      const parsed = JSON.parse(execution.responseBody);

      const comment: CommentType = parsed.data;

      updateCommentState({ ...comment });
      onClose();
      showToast({ type: "success", text1: "Comment edited successfully" });
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Could not edit comment. Please try again later.",
      });
    }
  }
  return (
    // EDIT COMMENT MODAL
    <Modal visible={isVisible} transparent animationType="slide">
      {/* OVERLAY */}
      <Pressable
        className="bg-gray-900/40 absolute inset-0"
        onPress={onClose}
      />

      {/* CONTENT */}
      <View className="flex-1 items-center justify-center">
        <View className="bg-white w-80 h-60 rounded-lg px-6 py-4">
          {/* HEADER */}
          <View className="flex-row items-center">
            <Text className="text-slate-900 font-semibold absolute left-0 right-0 text-center">
              Edit comment
            </Text>

            <Pressable className="ml-auto" onPress={onClose}>
              <Ionicons name="close" size={18} color="#0f172b" />
            </Pressable>
          </View>

          {/* EDIT COMMENT INPUT */}
          <TextInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Edit comment"
            placeholderTextColor="gray"
            className="border border-slate-300 rounded-lg text-slate-900 h-12 mt-4 pl-4"
          />

          {/* CONTROL BUTTONS */}
          <View className="flex-row items-center mt-auto ml-auto gap-4">
            <Pressable onPress={onClose}>
              <Text className="text-slate-900">Cancel</Text>
            </Pressable>

            <Pressable
              disabled={!isCommentModified}
              className={`${isCommentModified ? "bg-orange-500" : "bg-slate-500"} px-4 py-2 rounded-lg transition-all duration-300 active:scale-[0.95] active:opacity-85`}
              onPress={() => handleUpdateComment(selectedCommentId)}
            >
              <Text className="font-medium text-white">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditCommentModal;
