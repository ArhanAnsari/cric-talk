import { Octicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");

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
    </View>
  );
};

export default HomeScreen;
