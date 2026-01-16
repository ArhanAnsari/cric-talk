import useLikePost from "@/hooks/useLikePost";
import { Post } from "@/interfaces/Post";
import { usePosts } from "@/store/usePosts";
import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Props = {
  userId: string;
  post: Post;
};

const PostCard = ({ userId, post }: Props) => {
  const posts = usePosts((s) => s.posts);

  const { likePost } = useLikePost();

  return (
    <Pressable
      className="mb-4 border-b border-gray-200 pb-4"
      onPress={() => router.push(`/(posts)/${post.$id}`)}
    >
      {/* USER INFO */}
      <View className="flex-row items-center gap-2">
        <Pressable className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85">
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
            (Date.now() - new Date(post.$createdAt).getTime()) / 1000 / 60 / 60
          )}
          hr ago
        </Text>
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

        {post.authorId === userId && (
          <Pressable className="flex-row items-center gap-2">
            <Octicons name="pencil" size={18} color="black" />
            <Text>Edit</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );
};

export default PostCard;
