import useCreatePost from "@/hooks/useCreatePost";
import useLikePost from "@/hooks/useLikePost";
import { account } from "@/libs/appwrite";
import { showToast } from "@/libs/showToast";
import { fetchPosts, updatePost } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";
import { useUser } from "@/store/useUser";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ViewToken } from "react-native";
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../components/PostCard";

const HomeScreen = () => {
  const [userId, setUserId] = useState<string>("");
  const [authorName, setAuthorName] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [content, setContent] = useState<string>("");

  const posts = usePosts((s) => s.posts);
  const setPosts = usePosts((s) => s.setPosts);
  const updatePostState = usePosts((s) => s.updatePost);
  const { createNewPost } = useCreatePost();
  const { likePost } = useLikePost();

  const username = useUser((s) => s.username);

  const SIDEBAR_WIDTH = Dimensions.get("window").width * 0.75;

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
      const name = user.name || user.email.split("@")[0];

      setUserId(user.$id);
      setAuthorName(name);
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
            await createNewPost({ content, userId, authorName });
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

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center justify-between w-full">
            {/* USER AVATAR */}
            <Pressable
              className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85"
              onPress={() => setIsDrawerOpen(true)}
            >
              <Text className="text-slate-900 font-medium text-lg capitalize">
                {username?.charAt(0)}
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
            renderItem={({ item }) => <PostCard userId={userId} post={item} />}
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

      {/* PROFILE DRAWER OVERLAY */}
      {isDrawerOpen && (
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 10,
          }}
          onPress={() => setIsDrawerOpen(false)}
        />
      )}

      {/* PROFILE DRAWER */}
      <Animated.View
        style={{
          width: SIDEBAR_WIDTH,
          backgroundColor: "#0f172b",
          position: "absolute",
          top: 0,
          bottom: 0,
          left: isDrawerOpen ? 0 : -320,
          shadowColor: "black",
          transitionProperty: "all",
          transitionDuration: 250,
          transitionTimingFunction: "ease-in",
          zIndex: 20,
        }}
      >
        <SafeAreaView>
          <View className="px-6 py-4">
            {/* USER INFO */}
            <Pressable className="flex-row items-center gap-2">
              <View className="w-8 h-8 bg-slate-400 rounded-full items-center justify-center">
                <Text className="uppercase text-lg font-medium text-slate-800">
                  {username?.charAt(0)}
                </Text>
              </View>

              <Text className="text-white text-base">{username}</Text>
            </Pressable>

            {/* PROFILE CONTENTS */}
            <View className="mt-8 gap-4">
              <Pressable
                className="flex-row items-center gap-2"
                onPress={() => router.push("/(profile)/ProfileScreen")}
              >
                <Ionicons name="person-outline" size={24} color="white" />
                <Text className="text-white font-medium text-xl">Profile</Text>
              </Pressable>

              <Pressable className="flex-row items-center gap-2">
                <Ionicons name="search-outline" size={24} color="white" />
                <Text className="text-white font-medium text-xl">Explore</Text>
              </Pressable>

              <Pressable className="flex-row items-center gap-2">
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={24}
                  color="white"
                />
                <Text className="text-white font-medium text-xl">Rooms</Text>
              </Pressable>

              <Pressable className="flex-row items-center gap-2">
                <Ionicons name="settings-outline" size={24} color="white" />
                <Text className="text-white font-medium text-xl">Settings</Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

export default HomeScreen;
