import { Post } from "@/interfaces/Post";
import { showToast } from "@/libs/showToast";
import { executePost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  postId: string;
  initialContent: string;
};

const EditPostModal = ({
  isVisible,
  onClose,
  postId,
  initialContent,
}: Props) => {
  const [content, setContent] = useState<string>(initialContent);

  const updatePostState = usePosts((s) => s.updatePost);

  async function handleEditPost() {
    const trimmedContent: string = content.trim();

    if (trimmedContent.length === 0) {
      onClose();

      showToast({
        type: "error",
        text1: "Your post is empty",
        text2: "Try writing something for community.",
      });

      return;
    }

    if (trimmedContent.length > 512) {
      onClose();

      showToast({
        type: "error",
        text1: "Character limit reached",
        text2: "Content can't be longer than 512 characters.",
      });

      return;
    }

    if (initialContent.trim() === trimmedContent) {
      onClose();

      showToast({
        type: "info",
        text1: "Nothing to edit",
        text2: "You haven't made any changes yet.",
      });

      return;
    }

    try {
      const execution = await executePost({
        action: "update",
        postId,
        content,
      });
      const parsed = JSON.parse(execution.responseBody);

      const post: Post = parsed.data;
      updatePostState(post);
      onClose();
      showToast({ type: "success", text1: "Post edited successfully" });
    } catch (error) {
      onClose();
      showToast({
        type: "error",
        text1: "Failed editing the post",
        text2: "Please try again later.",
      });
    }
  }

  return (
    <Modal visible={isVisible} transparent animationType="slide">
      <View className="flex-1 bg-white">
        <SafeAreaView className="flex-1">
          {/* MODAL HEADER */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
            <Ionicons
              name="close"
              size={24}
              color="#0f172b"
              onPress={onClose}
            />

            <Pressable onPress={handleEditPost}>
              <Ionicons name="save-outline" size={24} color="#0f172b" />
            </Pressable>
          </View>

          {/* MODAL CONTENT */}
          <View className="px-6 py-4">
            <Text className="text-lg font-semibold text-slate-900 tracking-wide">
              Changed your mind?
            </Text>

            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder="Write anything about cricket..."
              multiline
              numberOfLines={8}
              maxLength={512}
              className="border border-gray-300 mt-2 rounded-lg text-slate-900"
            />

            <Text className="text-sm text-gray-800 mt-2 ml-auto">
              {content.length} / 512
            </Text>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

export default EditPostModal;
