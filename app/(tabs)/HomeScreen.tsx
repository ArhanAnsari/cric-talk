import useCreatePost from "@/hooks/useCreatePost";
import { account } from "@/libs/appwrite";
import { showToast } from "@/libs/showToast";
import { fetchPosts, updatePost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ViewToken } from "react-native";
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [userId, setUserId] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [content, setContent] = useState<string>("");

  const posts = usePosts((s) => s.posts);
  const setPosts = usePosts((s) => s.setPosts);
  const updatePostState = usePosts((s) => s.updatePost);
  const { createNewPost } = useCreatePost();

  async function increamentView(postId: string) {
    const post = posts.find((post) => post.$id === postId);
    if (!post) return;

    updatePostState({
      $id: postId,
      views: post.views + 1,
    });

    await updatePost(postId, {
      views: post.views + 1,
    });
  }

  const viewedPostsRef = useRef<Set<string>>(new Set());
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.forEach(({ item, isViewable }) => {
        if (!isViewable) return;
        if (viewedPostsRef.current.has(item.$id)) return;

        viewedPostsRef.current.add(item.$id);
        increamentView(item.$id);
      });
    },
    [posts]
  );

  useEffect(() => {
    let mounted = true;

    async function fetchUserId() {
      if (!mounted) return;
      const user = await account.get();
      setUserId(user.$id);
    }
    fetchUserId();

    async function fetchAllPosts() {
      if (!mounted) return;
      const data = await fetchPosts();
      setPosts(data.rows);
    }
    fetchAllPosts();

    return () => {
      mounted = false;
    };
  }, []);

  async function handleCreatePost() {
    Alert.alert("Creating Post", "Are you sure you want to create this post?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Create",
        onPress: async () => {
          try {
            await createNewPost({ content, userId });
            setIsVisible(false);
            setContent("");

            showToast({
              type: "success",
              text1: "Post Created",
              text2: "Your post has been created successfully.",
            });
          } catch (error) {
            showToast({
              type: "error",
              text1: "Error",
              text2: "Could not create post. Please try again later.",
            });
          }
        },
      },
    ]);
  }

  async function handleLikePost(postId: string) {
    const post = posts.find((p) => p.$id === postId);
    if (!post) return;

    const isLiked = post.likedBy.includes(userId);
    const updatedPostData = {
      likes: isLiked ? post.likes - 1 : post.likes + 1,
      likedBy: isLiked
        ? post.likedBy.filter((id) => id !== userId)
        : [...post.likedBy, userId],
    };

    try {
      updatePostState({
        $id: postId,
        ...updatedPostData,
      });
      const updatedPost = await updatePost(postId, updatedPostData);
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error",
        text2: "Could not like. Please try again later.",
      });
      updatePostState(post);
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center justify-between w-full">
            {/* USER AVATAR */}
            <Pressable className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85">
              <Text className="text-slate-900 font-medium text-lg capitalize">
                s
              </Text>
            </Pressable>

            {/* APP NAME */}
            <Text className="text-white text-xl font-semibold">CricTalk</Text>

            {/* NOTIFICATION ICON */}
            <Pressable className="bg-orange-600 p-2 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85">
              <Octicons name="bell-fill" size={18} color="white" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      <View className="px-6 py-4">
        {/* SEARCH BAR + FILTER BUTTON */}
        <View className="flex-row items-center">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search anything..."
            className="border border-gray-300 rounded-lg pl-4 flex-1 mr-4 h-12"
          />

          <Pressable className="bg-orange-500 w-12 h-12 rounded-lg items-center justify-center">
            <Octicons name="filter" size={24} color="white" />
          </Pressable>
        </View>

        {/* POSTS */}
        <View className="mt-6">
          <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={{ paddingBottom: 200 }}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
            renderItem={({ item }) => (
              <Pressable
                className="mb-4 border-b border-gray-200 pb-4"
                onPress={() => router.push(`/(posts)/${item.$id}`)}
              >
                {/* USER INFO */}
                <View className="flex-row items-center gap-2">
                  <Pressable className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85">
                    <Text className="text-slate-900 font-medium text-lg capitalize">
                      {item.authorId[0]}
                    </Text>
                  </Pressable>

                  <Text className="text-slate-900 font-medium text-lg">
                    {item.authorId}
                  </Text>

                  <Text className="text-sm">
                    ·{" "}
                    {Math.floor(
                      (Date.now() - new Date(item.$createdAt).getTime()) /
                        1000 /
                        60 /
                        60
                    )}
                    hr ago
                  </Text>
                </View>

                {/* POST CONTENT */}
                <View className="mt-2">
                  <Text className="leading-6 text-slate-800">
                    {item.content}
                  </Text>
                </View>

                {/* POST IMAGE */}
                {item.image?.length !== 0 && (
                  <Pressable className="w-full aspect-video bg-gray-300 rounded-lg mt-4" />
                )}

                {/* POST ACTIONS */}
                <View className="flex-row items-center justify-between mt-4">
                  <Pressable
                    className="flex-row items-center gap-2"
                    onPress={() => handleLikePost(item.$id)}
                  >
                    <Octicons
                      name={
                        posts
                          .find((p) => p.$id === item.$id)
                          ?.likedBy.includes(userId)
                          ? "heart-fill"
                          : "heart"
                      }
                      size={18}
                      color={
                        posts
                          .find((p) => p.$id === item.$id)
                          ?.likedBy.includes(userId)
                          ? "red"
                          : "gray"
                      }
                    />
                    <Text>
                      {item.likes} Like{item.likes === 1 ? "" : "s"}
                    </Text>
                  </Pressable>

                  <Pressable className="flex-row items-center gap-2">
                    <Octicons
                      name="comment-discussion"
                      size={18}
                      color="black"
                    />
                    <Text>
                      {item.commentCount} Comment
                      {item.commentCount === 1 ? "" : "s"}
                    </Text>
                  </Pressable>

                  <Pressable className="flex-row items-center gap-2">
                    <Octicons name="eye" size={18} color="black" />
                    <Text>
                      {item.views} View{item.views === 1 ? "" : "s"}
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            )}
          />
        </View>
      </View>

      {/* CREATE POST BUTTON */}
      <Pressable
        className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center absolute bottom-6 right-6 shadow-md elevation-xs"
        onPress={() => setIsVisible(true)}
      >
        <Octicons name="plus" size={24} color="white" />
      </Pressable>

      {/* CREATE POST MODAL */}
      <Modal visible={isVisible} transparent animationType="slide">
        <View className="flex-1 bg-white">
          <SafeAreaView className="flex-1">
            {/* MODAL HEADER */}
            <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
              <Ionicons
                name="close"
                size={24}
                color="#0f172b"
                onPress={() => setIsVisible(false)}
              />

              <Pressable onPress={handleCreatePost}>
                <Text className="text-orange-500 font-semibold">
                  Create Post
                </Text>
              </Pressable>
            </View>

            {/* MODAL CONTENT */}
            <View className="px-6 py-4">
              <Text className="text-lg font-semibold text-slate-900 tracking-wide">
                What's on your mind?
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
    </View>
  );
};

export default HomeScreen;
