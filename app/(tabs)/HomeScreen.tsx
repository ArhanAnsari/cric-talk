import { account } from "@/libs/appwrite";
import { showToast } from "@/libs/showToast";
import { executePost, fetchPosts } from "@/services/posts.service";
import { usePosts } from "@/store/usePosts";
import { useUser } from "@/store/useUser";
import { Octicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import type { ViewToken } from "react-native";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreatePostModal from "../components/CreatePostModal";
import PostCard from "../components/PostCard";
import ProfileDrawer from "../components/ProfileDrawer";

const HomeScreen = () => {
  const [userId, setUserId] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const seacrhQueryRef = useRef<TextInput>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showFilter, setShowFilter] = useState(false);
  const [sortBy, setSortBy] = useState<"trending" | "popular" | "newest">(
    "trending"
  );

  const posts = usePosts((s) => s.posts);
  const setPosts = usePosts((s) => s.setPosts);
  const updatePostState = usePosts((s) => s.updatePost);

  const username = useUser((s) => s.username);

  async function increamentView(postId: string) {
    const post = posts.find((p) => p.$id === postId);
    if (!post) return;

    if (post.viewedBy.includes(userId)) return;

    const optimisticPost = {
      ...post,
      views: post.views + 1,
      viewedBy: [...post.viewedBy, userId],
    };

    updatePostState(optimisticPost);

    try {
      const execution = await executePost({
        action: "view",
        postId: postId,
      });
      const parsed = JSON.parse(execution.responseBody);

      const updatedPost = parsed.data;
      updatePostState(updatedPost);
    } catch (error) {
      updatePostState(post);
    }
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

  const loadPosts = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true);
      setHasMore(true);
    } else {
      if (loadingMore || !hasMore) return;
      setLoadingMore(true);
    }

    try {
      const currentOffset = refresh ? 0 : posts.length;
      const data: any = await fetchPosts({
        limit: 10,
        offset: currentOffset,
        sort: sortBy,
      });
      const newPosts = data.rows || data.documents || [];

      if (refresh) {
        setPosts(newPosts);
      } else {
        setPosts([...posts, ...newPosts]);
      }

      if (newPosts.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error loading posts:", error);

      // Fallback to "newest" if "trending" or "popular" fails (likely due to missing index)
      if (sortBy !== "newest") {
        console.log("Sort failed, falling back to newest...");
        setSortBy("newest");
        return;
      }

      showToast({
        type: "error",
        text1: "Error",
        text2: "Could not load posts. Please try again.",
      });
    } finally {
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function fetchUserId() {
      if (!mounted) return;
      const user = await account.get();

      setUserId(user.$id);
    }
    fetchUserId();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    loadPosts(true);
  }, [sortBy]);

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
            <Pressable className="bg-orange-600 w-10 h-10 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85">
              <Octicons name="bell-fill" size={18} color="white" />
            </Pressable>
          </View>
        </SafeAreaView>
      </View>

      <View className="px-6 py-4 flex-1">
        {/* SEARCH BAR + FILTER BUTTON */}
        <View className="flex-row items-center">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            ref={seacrhQueryRef}
            placeholder="Search anything..."
            className="border border-gray-300 rounded-lg pl-4 flex-1 mr-4 h-12"
          />

          <Pressable
            className="bg-orange-500 w-12 h-12 rounded-lg items-center justify-center"
            onPress={() => setShowFilter(!showFilter)}
          >
            <Octicons name="filter" size={24} color="white" />
          </Pressable>
        </View>

        {/* FILTER OPTIONS */}
        {showFilter && (
          <View className="flex-row justify-between mb-4 mt-2 gap-2">
            {(["trending", "popular", "newest"] as const).map((option) => (
              <Pressable
                key={option}
                className={`px-4 py-2 rounded-full border ${
                  sortBy === option
                    ? "bg-orange-500 border-orange-500"
                    : "bg-white border-gray-300"
                }`}
                onPress={() => {
                  setSortBy(option);
                  setShowFilter(false);
                }}
              >
                <Text
                  className={`capitalize ${
                    sortBy === option ? "text-white" : "text-slate-700"
                  }`}
                >
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* POSTS */}
        <View className="mt-6 flex-1">
          <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
            refreshing={refreshing}
            onRefresh={() => loadPosts(true)}
            onEndReached={() => {
              if (hasMore && !loadingMore) {
                loadPosts(false);
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <View className="py-4">
                  <ActivityIndicator size="small" color="#f97316" />
                </View>
              ) : null
            }
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
