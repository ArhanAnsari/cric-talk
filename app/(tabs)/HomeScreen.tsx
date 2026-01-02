import { Post } from "@/interfaces/Post";
import { account } from "@/libs/appwrite";
import { createPost, fetchPosts } from "@/services/posts.service";
import { Ionicons, Octicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [userId, setUserId] = useState<string>("");

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [content, setContent] = useState<string>("");
  const [posts, setPosts] = useState<Post[]>([]);

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
            await createPost({ content, authorId: userId });
            setIsVisible(false);
            setContent("");
            alert("Post created succesfully!");
          } catch (error) {
            alert("Error creating post. Please try again.");
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
          <View>
            {/* USER INFO */}
            <View className="flex-row items-center gap-2">
              <Pressable className="w-10 h-10 bg-gray-200 rounded-full items-center justify-center transition-all ease-in-out duration-300 active:scale-[0.98] active:opacity-85">
                <Text className="text-slate-900 font-medium text-lg capitalize">
                  s
                </Text>
              </Pressable>

              <Text className="text-slate-900 font-medium text-lg">Slice</Text>

              <Text className="text-sm">· 10hr ago</Text>
            </View>

            {/* POST CONTENT */}
            <View className="mt-2">
              <Text className="leading-6 text-slate-800">
                Exicting match between India and Australia today! Are you all
                exicted too? #India #Australia #INDIAvsAUS
              </Text>
            </View>

            {/* POST IMAGE */}
            <Pressable className="w-full aspect-video bg-gray-300 rounded-lg mt-4" />

            {/* POST ACTIONS */}
            <View className="flex-row items-center justify-between mt-4">
              <Pressable className="flex-row items-center gap-2">
                <Octicons name="heart-fill" size={18} color="red" />
                <Text>1 Like</Text>
              </Pressable>

              <Pressable className="flex-row items-center gap-2">
                <Octicons name="comment-discussion" size={18} color="black" />
                <Text>1 Comment</Text>
              </Pressable>

              <Pressable className="flex-row items-center gap-2">
                <Octicons name="eye" size={18} color="black" />
                <Text>10 Views</Text>
              </Pressable>
            </View>
          </View>
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
