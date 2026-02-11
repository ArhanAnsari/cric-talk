import { account } from "@/libs/appwrite";
import { fetchPosts, searchPosts } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";
import { useUser } from "@/store/useUser";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ViewToken } from "react-native";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreatePostModal from "../components/CreatePostModal";
import PostCard from "../components/PostCard";
import ProfileDrawer from "../components/ProfileDrawer";
import { LegendList } from "@legendapp/list";
import { showToast } from "@/libs/showToast";
import { EmptyState } from "../components/EmptyState";
import useViewPost from "@/hooks/useViewPost";

const HomeScreen = () => {
  const [userId, setUserId] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const seacrhQueryRef = useRef<TextInput>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const posts = usePosts((s) => s.posts);
  const setPosts = usePosts((s) => s.setPosts);

  const username = useUser((s) => s.username);

  const screenHeight = Dimensions.get("screen").height;

  const { incrementView } = useViewPost();

  const viewedPostsRef = useRef<Set<string>>(new Set());
  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      viewableItems.forEach(({ item, isViewable }) => {
        if (!isViewable) return;
        if (viewedPostsRef.current.has(item.$id)) return;

        viewedPostsRef.current.add(item.$id);

        incrementView({ postId: item.$id, userId });
      });
    },
    [posts],
  );

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function onRefresh() {
    setRefreshing(true);
    setLoading(true);

    // fetch posts
    try {
      const data = await fetchPosts();
      setPosts(data.rows);
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error refreshing posts",
        text2: "Please try again later.",
      });
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }

  async function handleSearch(text: string) {
    try {
      const data = await searchPosts(text);
      setPosts(data.rows);

      console.log("Search query:", searchQuery);
      console.log("Fetched posts:", data.rows);
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error searching posts",
        text2: "Please try again later.",
      });
    }
  }

  useEffect(() => {
    let mounted = true;

    async function fetchUserId() {
      if (!mounted) return;
      const user = await account.get();

      setUserId(user.$id);
    }
    fetchUserId();

    async function fetchAllPosts() {
      try {
        const data = await fetchPosts();
        setPosts(data.rows);
      } catch (error) {
        showToast({
          type: "error",
          text1: "Error fetching posts",
          text2: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    }
    fetchAllPosts();
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="w-full h-30 bg-linear-to-br from-orange-600 to-orange-500">
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center justify-between w-full">
            {/* USER AVATAR */}
            <Pressable
              className="size-10 bg-gray-200 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85"
              onPress={() => setIsDrawerOpen(true)}
            >
              <Text className="text-slate-900 font-medium text-lg capitalize">
                {username?.charAt(0)}
              </Text>
            </Pressable>

            {/* APP NAME */}
            <Text className="text-white text-xl font-semibold">CricTalk</Text>

            {/* NOTIFICATION ICON */}
            <Pressable
              className="bg-orange-600 size-10 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85"
              onPress={() =>
                router.push("/(notifications)/NotificationsScreen")
              }
            >
              <Ionicons name="notifications" size={18} color="white" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      <View className="px-6 py-4">
        {/* SEARCH BAR + FILTER BUTTON */}
        <View className="flex-row items-center">
          <TextInput
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);

              if (debounceRef.current) {
                clearTimeout(debounceRef.current);
              }

              debounceRef.current = setTimeout(() => {
                handleSearch(text);
              }, 300);
            }}
            ref={seacrhQueryRef}
            placeholder="Search anything..."
            placeholderTextColor="gray"
            className="border border-gray-300 rounded-lg pl-4 flex-1 mr-4 h-12 text-slate-900"
          />

          <Pressable className="bg-orange-500 w-12 h-12 rounded-lg items-center justify-center">
            <Ionicons name="filter" size={24} color="white" />
          </Pressable>
        </View>

        {/* POSTS */}
        <View className="mt-6">
          {loading ? (
            <ActivityIndicator
              size="large"
              color="#ff6900"
              style={{ marginTop: screenHeight * 0.25 }}
            />
          ) : (
            <LegendList
              data={posts}
              keyExtractor={(item) => item.$id}
              contentContainerStyle={{ paddingBottom: 200 }}
              showsVerticalScrollIndicator={false}
              onViewableItemsChanged={onViewableItemsChanged}
              viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
              renderItem={({ item }) => (
                <PostCard userId={userId} post={item} />
              )}
              recycleItems
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={["#ff6900"]}
                />
              }
              ListEmptyComponent={
                <EmptyState type="post" onPress={() => setIsVisible(true)} />
              }
            />
          )}
        </View>
      </View>

      {/* CREATE POST BUTTON */}
      <Pressable
        className="w-16 h-16 bg-orange-500 rounded-full items-center justify-center absolute bottom-6 right-6 shadow-md elevation-xs"
        onPress={() => setIsVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
      </Pressable>

      {/* CREATE POST MODAL */}
      <CreatePostModal
        isVisible={isVisible}
        onClose={() => setIsVisible(false)}
      />

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
      <ProfileDrawer
        username={username || ""}
        isDrawerOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        searchQueryRef={seacrhQueryRef}
      />
    </View>
  );
};

export default HomeScreen;
