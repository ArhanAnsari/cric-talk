import { account } from "@/libs/appwrite";
import { updatePost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();

  const [userId, setUserId] = useState<string>("");

  const posts = usePosts((s) => s.posts);
  const post = posts.find((post) => post.$id === postId);

  const updatePostState = usePosts((s) => s.updatePost);

  useEffect(() => {
    async function fetchUserId() {
      const user = await account.get();
      setUserId(user.$id);
    }
    fetchUserId();
  }, []);

  async function handleLikePost() {
    if (!post) return;
    const prevPost = { ...post, likedBy: [...post.likedBy] };

    const isLiked = post?.likedBy.includes(userId);
    const updatedPostData = {
      likes: isLiked ? post?.likes - 1 : post?.likes + 1,
      likedBy: isLiked
        ? post.likedBy.filter((id) => id !== userId)
        : [...post.likedBy, userId],
    };

    try {
      updatePostState({
        $id: post.$id,
        ...updatedPostData,
      });

      await updatePost(post.$id, updatedPostData);
    } catch (error) {
      alert("Error liking post. Please try again");
      updatePostState(prevPost);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior="padding"
      keyboardVerticalOffset={0}
    >
      <View className="flex-1">
        {/* HEADER */}
        <View className="w-full h-30 bg-orange-500">
          <SafeAreaView>
            <View className="px-6 flex-row items-center w-full">
              <Octicons
                name="arrow-left"
                size={24}
                color="white"
                onPress={() => router.back()}
              />

              <Text className="text-white font-semibold text-xl text-center flex-1">
                CricTalk
              </Text>
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
              <View className="border-b border-gray-300 pb-4">
                {/* AUTHOR INFO + PUBLISH DATE */}
                <View className="flex-row items-center gap-2">
                  {/* AUTHOR PROFILE IMAGE */}
                  <Pressable className="bg-gray-300 h-10 w-10 items-center justify-center rounded-full">
                    <Text className="text-lg font-semibold capitalize text-slate-950">
                      {post?.authorId[0]}
                    </Text>
                  </Pressable>

                  {/* AUTHOR NAME */}
                  <Text className="text-lg font-medium text-slate-900">
                    {post?.authorId}
                  </Text>

                  {/* PUBLISH DATE */}
                  <Text className="text-sm text-slate-600 ml-auto">
                    {new Date(post?.$createdAt || "").toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                      }
                    )}
                  </Text>
                </View>

                {/* POST CONTENT */}
                <View className="mt-4">
                  <Text className="leading-6 text-slate-800">
                    {post?.content}
                  </Text>
                </View>

                {/* IMAGE PLACEHOLDER */}
                {post?.image?.length !== 0 && (
                  <View className="w-full aspect-video bg-gray-300 rounded-lg my-4" />
                )}

                {/* POST ACTIONS */}
                <View className="mt-4 flex-row items-center justify-between">
                  <Pressable
                    className="flex-row gap-2"
                    onPress={handleLikePost}
                  >
                    <Octicons
                      name={
                        post?.likedBy.includes(userId) ? "heart-fill" : "heart"
                      }
                      size={18}
                      color={post?.likedBy.includes(userId) ? "red" : "gray"}
                    />
                    <Text>
                      {post?.likes} Like{post?.likes === 1 ? "" : "s"}
                    </Text>
                  </Pressable>

                  <Pressable className="flex-row gap-2">
                    <Octicons
                      name="comment-discussion"
                      size={18}
                      color="black"
                    />
                    <Text>
                      {post?.comments.length} Comment
                      {post?.comments.length === 1 ? "" : "s"}
                    </Text>
                  </Pressable>

                  <Pressable className="flex-row gap-2">
                    <Octicons name="eye" size={18} color="black" />
                    <Text>
                      {post?.views} View{post?.views === 1 ? "" : "s"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              {/* COMMENTS SECTION */}
              <View className="mt-4">
                <Text className="text-slate-900 font-semibold text-xl">
                  Comments
                </Text>

                {/* COMMENT LIST */}
                <View className="border-b border-gray-300 pb-4 mt-4">
                  {/* AUTHOR INFO + PUBLISH DATE */}
                  <View className="flex-row items-center gap-2">
                    {/* AUTHOR PROFILE IMAGE */}
                    <Pressable className="bg-gray-300 h-10 w-10 items-center justify-center rounded-full">
                      <Text className="text-lg font-semibold capitalize text-slate-950">
                        i
                      </Text>
                    </Pressable>

                    {/* AUTHOR NAME */}
                    <Text className="text-lg font-medium text-slate-900">
                      Ishan
                    </Text>

                    {/* PUBLISH DATE */}
                    <Text className="text-sm text-slate-600 ml-auto">
                      3 Jan 2025, 08:25 AM
                    </Text>
                  </View>

                  {/* COMMENT CONTENT */}
                  <View className="mt-4">
                    <Text className="leading-6 text-slate-800">
                      This will contain the comment content for the clicked
                      post.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </ScrollView>
      </View>

      {/* COMMENT INPUT BOX */}
      <SafeAreaView>
        <View className="px-6 flex-row items-center ">
          {/* COMMENT INPUT */}
          <TextInput
            placeholder="Comment"
            className="border border-gray-300 rounded-lg pl-4 h-12 flex-1 mr-4"
          />

          {/* COMMENT ADD BUTTON */}
          <Pressable className="h-12 w-12 bg-orange-500 rounded-lg items-center justify-center">
            <Ionicons name="send-outline" size={18} color="white" />
          </Pressable>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PostDetails;
