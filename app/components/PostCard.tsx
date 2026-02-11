import useLikePost from "@/hooks/useLikePost";
import { Post } from "@/schemas/PostSchema";
import { usePosts } from "@/store/usePosts";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import EditPostModal from "./EditPostModal";
import useDeletePost from "@/hooks/useDeletePost";

type Props = {
  userId: string;
  post: Post;
};

const PostCard = ({ userId, post }: Props) => {
  const posts = usePosts((s) => s.posts);

  const { likePost } = useLikePost();

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);

  const { handleDeletePost } = useDeletePost({ postId: post.$id });

  return (
    <>
      <Pressable
        className="mb-4 border-b border-gray-200 pb-4"
        onPress={() => router.push(`/(posts)/${post.$id}`)}
      >
        {/* USER INFO + POST ACTION ICON */}
        <View className="flex-row items-center gap-2">
          <Pressable className="size-10 bg-slate-300 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85">
            <Text className="text-slate-900 font-medium text-lg capitalize">
              {post.authorName.charAt(0)}
            </Text>
          </Pressable>

          <Text className="text-slate-900 font-medium text-lg">
            {post.authorName}
          </Text>

          <Text className="text-sm">
            ·{" "}
            {Math.floor(
              (Date.now() - new Date(post.$createdAt).getTime()) /
                1000 /
                60 /
                60,
            )}
            hr ago
          </Text>

          {post.authorId === userId && (
            <View className="flex-row items-center gap-4 ml-auto">
              {/* EDIT POST ICON */}
              <Pressable
                className="flex-row items-center"
                onPress={() => setIsEditModalVisible(true)}
              >
                <Ionicons name="pencil-outline" size={18} color="black" />
              </Pressable>

              {/* DELETE POST ICON */}
              <Pressable onPress={handleDeletePost}>
                <Ionicons name="trash-outline" size={18} color="black" />
              </Pressable>
            </View>
          )}
        </View>

        {/* POST CONTENT */}
        <View className="mt-2">
          <Text className="leading-6 text-slate-800">{post.content}</Text>
        </View>

        {/* POST IMAGE */}
        {post.image?.length !== 0 && (
          <Pressable className="w-full aspect-video bg-gray-300 rounded-lg mt-4" />
        )}

        {/* POST ACTIONS */}
        <View className="flex-row items-center justify-between mt-4">
          <Pressable
            className="flex-row items-center gap-2"
            onPress={() => likePost({ postId: post.$id, userId })}
          >
            <Ionicons
              name={
                posts.find((p) => p.$id === post.$id)?.likedBy.includes(userId)
                  ? "heart-sharp"
                  : "heart-outline"
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
            <Ionicons name="chatbox-ellipses-outline" size={18} color="black" />
            <Text>
              {post.commentCount} Comment
              {post.commentCount === 1 ? "" : "s"}
            </Text>
          </Pressable>

          <Pressable className="flex-row items-center gap-2">
            <Ionicons name="eye-outline" size={18} color="black" />
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
