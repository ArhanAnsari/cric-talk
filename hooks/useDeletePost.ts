import { View, Text, Alert } from "react-native";
import React from "react";
import { executePost } from "@/services/posts.service";
import { showToast } from "@/libs/showToast";
import { usePosts } from "@/store/usePosts";

const useDeletePost = ({ postId }: { postId: string }) => {
  const deletePostState = usePosts((s) => s.deletePost);

  async function handleDeletePost() {
    Alert.alert("Are you sure?", "Do you want to delete the post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const execution = await executePost({
              action: "delete",
              postId,
            });
            const parsed = JSON.parse(execution.responseBody);

            const deletedPostId = parsed.data.postId;

            deletePostState(deletedPostId);
            showToast({ type: "success", text1: "Post deleted successfully" });
          } catch (error) {
            showToast({
              type: "error",
              text1: "Failed to delete the post",
              text2: "Please try again later.",
            });
          }
        },
      },
    ]);
  }

  return { handleDeletePost };
};

export default useDeletePost;
