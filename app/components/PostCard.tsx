import useLikePost from "@/hooks/useLikePost";
import { Post } from "@/interfaces/Post";
import { showToast } from "@/libs/showToast";
import { executePost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";
import { Octicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import EditPostModal from "./EditPostModal";

type Props = {
  userId: string;
  post: Post;
};

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";

  return "Just now";
}

const PostCard = ({ userId, post }: Props) => {
  const posts = usePosts((s) => s.posts);

  const { likePost } = useLikePost();

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  async function handleDeletePost() {
    Alert.alert("Are you sure?", "Do you want to delete the post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await executePost({
              action: "delete",
              postId: post.$id,
            });

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

  return (
    <>
      <Pressable
        className="mb-4 border-b border-gray-200 pb-4"
        onPress={() => router.push(`/(posts)/${post.$id}`)}
      >
        {/* USER INFO + POST ACTION ICON */}
        <View className="flex-row items-center gap-2">
          <Pressable className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85">
            <Text className="text-slate-900 font-medium text-lg capitalize">
              {post.authorName.charAt(0)}
            </Text>
          </Pressable>

          <Text className="text-slate-900 font-medium text-lg">
            {post.authorName}
          </Text>

          <Text className="text-sm text-gray-500">
            · {timeAgo(post.$createdAt)}
          </Text>

          {post.authorId === userId && (
            <View className="flex-row items-center gap-4 ml-auto">
              {/* EDIT POST ICON */}
              <Pressable
                className="flex-row items-center"
                onPress={() => setIsEditModalVisible(true)}
              >
                <Octicons name="pencil" size={18} color="black" />
              </Pressable>

              {/* DELETE POST ICON */}
              <Pressable onPress={handleDeletePost}>
                <Octicons name="trash" size={18} color="black" />
              </Pressable>
            </View>
          )}
        </View>

        {/* POST CONTENT */}
        <View className="mt-2">
          <Text className="leading-6 text-slate-800">{post.content}</Text>
        </View>

        {/* POST IMAGE */}
        {post.image && post.image.length > 0 && (
          <Image
            source={{ uri: post.image[0] }}
            style={{
              width: "100%",
              aspectRatio: 16 / 9,
              borderRadius: 8,
              marginTop: 16,
              backgroundColor: "#e5e7eb",
            }}
            contentFit="cover"
            transition={300}
          />
        )}

        {/* POST ACTIONS */}
        <View className="flex-row items-center justify-between mt-4">
          <Pressable
            className="flex-row items-center gap-2"
            onPress={() => likePost({ postId: post.$id, userId })}
          >
            <Octicons
              name={
                posts.find((p) => p.$id === post.$id)?.likedBy.includes(userId)
                  ? "heart-fill"
                  : "heart"
              }
              size={18}
              color={
                posts.find((p) => p.$id === post.$id)?.likedBy.includes(userId)
                  ? "red"
                  : "gray"
              }
            />
            <Text>
              {post.likes} Like{post.likes === 1 ? "" : "s"}
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center gap-2">
            <Octicons name="comment-discussion" size={18} color="black" />
            <Text>
              {post.commentCount} Comment
              {post.commentCount === 1 ? "" : "s"}
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center gap-2">
            <Octicons name="eye" size={18} color="black" />
            <Text>
              {post.views} View{post.views === 1 ? "" : "s"}
            </Text>
          </Pressable>
        </View>
      </Pressable>

      <EditPostModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        postId={post.$id}
        initialContent={post.content}
      />
    </>
  );
};

export default PostCard;
