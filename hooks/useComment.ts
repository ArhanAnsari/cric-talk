import { showToast } from "@/libs/showToast";
import { CommentType, CreateCommentSchema } from "@/schemas/CommentSchema";
import { Post } from "@/schemas/PostSchema";
import { executeComment } from "@/services/comments.service";
import { updatePost } from "@/services/posts.service";
import { useComments } from "@/store/useComments";
import { usePosts } from "@/store/usePosts";
import { use, useState } from "react";
import { Alert } from "react-native";

const useComment = ({ post }: { post: Post }) => {
  const postId = post.$id;

  const addCommentState = useComments((s) => s.addComment);
  const deleteCommentState = useComments((s) => s.deleteComment);

  const updatePostState = usePosts((s) => s.updatePost);

  async function handleAddComment({
    comment,
    setComment,
  }: {
    comment: string;
    setComment: (comment: string) => void;
  }) {
    try {
      const result = CreateCommentSchema.safeParse({
        postId,
        content: comment,
      });

      if (!result.success) {
        showToast({
          type: "error",
          text1: "Error",
          text2: result.error.issues[0].message,
        });
        return;
      }

      const execution = await executeComment({
        action: "add",
        postId: postId as string,
        content: comment,
      });
      const parsed = JSON.parse(execution?.responseBody || "");
      if (!parsed) throw new Error("Error while executing add comment");

      const newComment: CommentType = parsed.data;
      addCommentState(newComment);

      await updatePost(postId as string, {
        commentCount: (post?.commentCount || 0) + 1,
      });
      updatePostState({
        $id: postId as string,
        commentCount: (post?.commentCount || 0) + 1,
      });

      setComment("");
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Could not add comment. Please try again later.",
      });
    }
  }

  async function handleDeleteComment(commentId: string) {
    Alert.alert("Are you sure?", "Do you want to delete this comment?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const execution = await executeComment({
              action: "delete",
              commentId,
            });
            const parsed = JSON.parse(execution?.responseBody || "");

            const deletedCommentId = parsed.data.commentId;
            deleteCommentState(deletedCommentId);

            await updatePost(postId as string, {
              commentCount: (post?.commentCount || 0) - 1,
            });
            updatePostState({
              $id: postId as string,
              commentCount: (post?.commentCount || 0) - 1,
            });
          } catch (error) {
            showToast({
              type: "error",
              text1: "Error",
              text2: "Could not delete comment. Please try again later.",
            });
          }
        },
      },
    ]);
  }

  return { handleAddComment, handleDeleteComment };
};

export default useComment;
