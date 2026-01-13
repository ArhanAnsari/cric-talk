import { Post } from "@/interfaces/Post";
import { UserStats } from "@/interfaces/UserStats";
import { account } from "@/libs/appwrite";
import { fetchPostsByUserId } from "@/services/posts.service";
import { fetchUserStatsByUserId } from "@/services/userStats.service";
import { useUser } from "@/store/useUser";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../components/PostCard";

const ProfileScreen = () => {
  const [userId, setUserId] = useState<string>("");
  const username = useUser((s) => s.username) || "";
  const email = useUser((s) => s.email);
  const joinDate = useUser((s) => s.joinDate);

  const MAX_CHARS = 16;

  const [activeTab, setActiveTab] = useState<"posts" | "rooms" | "stats">(
    "posts"
  );

  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);

  const messageCount = userStats.reduce(
    (acc, stat) => acc + stat.messageCount,
    0
  );

  useEffect(() => {
    async function fetchUserId() {
      const user = await account.get();
      setUserId(user.$id);
    }
    fetchUserId();
  }, []);

  useEffect(() => {
    if (!userId) return;

    async function loadData() {
      const posts = await fetchPostsByUserId(userId);
      const stats = await fetchUserStatsByUserId(userId);

      setUserPosts(posts.rows);
      setUserStats(stats.rows);
    }
    loadData();
  }, [userId]);

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-100 bg-linear-to-br from-orange-500 to-orange-600">
        {/* HEADER */}
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center justify-between">
            <Pressable
              className="h-10 w-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <Text className="text-white text-lg font-semibold">
              {username?.length > MAX_CHARS
                ? username?.slice(0, MAX_CHARS) + "..."
                : username}
            </Text>

            <Pressable className="h-10 w-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85">
              <Ionicons name="settings-outline" size={18} color="white" />
            </Pressable>
          </View>

          {/* USER INFO */}
          <View className="px-6 py-4 mt-6">
            <View className="flex-row items-center gap-4">
              <View className="w-30 h-30 bg-orange-600 rounded-full items-center justify-center">
                <Text className="text-4xl text-white font-medium">
                  {username?.[0].toUpperCase()}
                </Text>
              </View>

              <View>
                <Text className="text-lg text-white font-medium">
                  {username?.length > 16
                    ? username?.slice(0, MAX_CHARS)
                    : username}
                </Text>
                <Text className="text-sm text-slate-200 font-medium">
                  {email}
                </Text>
              </View>
            </View>

            <Text className="mt-4 text-slate-300 text-sm ">
              Joined on{" "}
              {joinDate.toLocaleDateString("en-IN", {
                dateStyle: "long",
              })}
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <View className="px-6 py-4">
        {/* TABS OPTION */}
        <View className="flex-row items-center gap-2 bg-slate-200 px-2 py-2 rounded-md">
          {(["posts", "rooms", "stats"] as const).map((label) => (
            <Pressable
              key={label}
              className={`${
                activeTab === label ? "bg-white" : "bg-transparent"
              } flex-1 items-center rounded-lg px-6 py-2 transition-transform duration-300 ease-in-out active:scale-[0.97]`}
              onPress={() => setActiveTab(label)}
            >
              <Text
                className={`capitalize ${
                  activeTab === label ? "text-slate-900" : "text-slate-600"
                }`}
              >
                {label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ACTIVE TAB DATA */}
      {activeTab === "posts" ? (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.$id}
          contentContainerClassName="px-6 mt-4 pb-40"
          style={{ flex: 1 }}
          renderItem={({ item }) => <PostCard userId={userId} post={item} />}
        />
      ) : activeTab === "stats" ? (
        <View className="px-6 py-4">
          <View className="bg-slate-200/60 border border-slate-200/80 h-40 px-3 py-1 items-center justify-center rounded-lg">
            <Text className="text-xl font-medium text-slate-900">
              {new Intl.NumberFormat("en-IN").format(messageCount)}{" "}
              <Text className="text-sm">messages sent</Text>
            </Text>

            <Text className="text-sm text-slate-500">
              You're doing great! Keep it up!
            </Text>
          </View>
        </View>
      ) : (
        ""
      )}
    </View>
  );
};

export default ProfileScreen;
