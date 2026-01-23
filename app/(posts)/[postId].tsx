import useKeyboardHeight from "@/hooks/useKeyboardHeight";
import { CommentType } from "@/interfaces/Post";
import { account } from "@/libs/appwrite";
import { showToast } from "@/libs/showToast";
import { executeComment, fetchComments } from "@/services/comments.service";
import { updatePost } from "@/services/posts.service";
import { useComments } from "@/store/useComments";
import { usePosts } from "@/store/usePosts";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CommentCard from "../components/CommentCard";
import EditCommentModal from "../components/EditCommentModal";
import PostCard from "../components/PostCard";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();

  const [userId, setUserId] = useState<string>("");

  const posts = usePosts((s) => s.posts);
  const post = posts.find((post) => post.$id === postId);

  if (!post) {
    showToast({
      type: "error",
      text1: "Post not found",
    });
    throw new Error("Post not found");
  }

  const updatePostState = usePosts((s) => s.updatePost);
  const updateCommentState = useComments((s) => s.updateComment);

  const commentList = useComments((s) => s.commentList);
  const setCommentList = useComments((s) => s.setComments);
  const addCommentState = useComments((s) => s.addComment);
  const deleteCommentState = useComments((s) => s.deleteComment);

  const [comment, setComment] = useState<string>("");
  const [oldComment, setOldComment] = useState<string>("");
  const [newComment, setNewComment] = useState<string>("");
  const isNewComment =
    oldComment.trim() !== newComment.trim() && newComment.trim();

  const [selectedCommentId, setSelectedCommentId] = useState<string>("");

  const [isEditCommentVisible, setIsEditCommentVisible] =
    useState<boolean>(false);

  const keyboardHeight = useKeyboardHeight();

  useEffect(() => {
    async function fetchUserId() {
      const user = await account.get();
      setUserId(user.$id);
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadComments() {
      if (!mounted) return;

      try {
        const data = await fetchComments(postId as string);
        setCommentList(data.rows);
      } catch (error) {
        showToast({
          type: "error",
          text1: "Error",
          text2: "Could not load comments. Please try again later.",
        });
      }
    }
    loadComments();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleAddComment() {
    if (comment.trim().length === 0) {
      showToast({
        type: "error",
        text1: "Comment cannot be empty.",
      });
      return;
    }

    try {
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
      setIsEditCommentVisible(false);
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
    <View className="flex-1 bg-white">
      <View className="flex-1">
        {/* HEADER */}
        <View className="w-full h-30 bg-orange-500">
          <SafeAreaView>
            <View className="px-6 py-4 flex-row items-center">
              <Pressable
                className="size-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={18} color="white" />
              </Pressable>

              <View className="absolute left-0 right-0 items-center">
                <Text className="text-lg text-white font-semibold">
                  CricTalk
                </Text>
              </View>
            </View>
          </SafeAreaView>
        </View>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <SafeAreaView>
            {/* POST DETAILS */}
            <View className="px-6 -mt-4">
              {/* POST CONTENT */}
              <PostCard userId={userId} post={post} />

              {/* COMMENTS SECTION */}
              <View className="mt-4">
                <Text className="text-slate-900 font-semibold text-xl">
                  Comments
                </Text>

                {/* COMMENT LIST */}
                <FlatList
                  data={commentList}
                  keyExtractor={(item) => item.$id}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  renderItem={({ item }) => (
                    <CommentCard
                      userId={userId}
                      comment={item}
                      onEditPress={() => {
                        setSelectedCommentId(item.$id);
                        setOldComment(item.content);
                        setNewComment(item.content);
                        setIsEditCommentVisible(true);
                      }}
                      onDeletePress={() => handleDeleteComment(item.$id)}
                    />
                  )}
                />
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>

      {/* COMMENT INPUT BOX */}
      <SafeAreaView
        edges={["bottom"]}
        style={{ marginBottom: keyboardHeight + 8 }}
      >
        <View className="px-6 flex-row items-center ">
          {/* COMMENT INPUT */}
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Comment"
            placeholderTextColor="gray"
            className="border border-gray-300 rounded-lg pl-4 h-12 flex-1 mr-4 text-slate-900"
          />

          {/* COMMENT ADD BUTTON */}
          <Pressable
            className="h-12 w-12 bg-orange-500 rounded-lg items-center justify-center"
            onPress={handleAddComment}
          >
            <Ionicons name="send-outline" size={18} color="white" />
          </Pressable>
        </View>
      </SafeAreaView>

      <EditCommentModal
        visible={isEditCommentVisible}
        onClose={() => setIsEditCommentVisible(false)}
        newComment={newComment}
        setNewComment={setNewComment}
        isNewComment={isNewComment}
        onUpdatePress={() => handleUpdateComment(selectedCommentId)}
      />
    </View>
  );
};

export default PostDetails;
