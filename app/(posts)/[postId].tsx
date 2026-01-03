import { Octicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();

  return (
    <View className="flex-1 bg-white">
      {/* HEADER */}
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          <View className="px-6 flex-row items-center w-full">
            <Octicons name="arrow-left" size={24} color="white" />

            <Text className="text-white font-semibold text-xl text-center flex-1">
              CricTalk
            </Text>
          </View>
        </SafeAreaView>
      </View>

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
                  s
                </Text>
              </Pressable>

              {/* AUTHOR NAME */}
              <Text className="text-lg font-medium text-slate-900">Swapna</Text>

              {/* PUBLISH DATE */}
              <Text className="text-sm text-slate-600 ml-auto">
                3 Jan 2025, 08:20 AM
              </Text>
            </View>

            {/* POST CONTENT */}
            <View className="mt-4">
              <Text className="leading-6 text-slate-800">
                This will contain the post content for the clicked post.
              </Text>
            </View>

            {/* IMAGE PLACEHOLDER */}
            <View className="w-full aspect-video bg-gray-300 rounded-lg my-4" />

            {/* POST ACTIONS */}
            <View className="mt-4 flex-row items-center justify-between">
              <Pressable className="flex-row gap-2">
                <Octicons name="heart-fill" size={18} color="red" />
                <Text>0 Likes</Text>
              </Pressable>

              <Pressable className="flex-row gap-2">
                <Octicons name="comment-discussion" size={18} color="black" />
                <Text>0 Comments</Text>
              </Pressable>

              <Pressable className="flex-row gap-2">
                <Octicons name="eye" size={18} color="black" />
                <Text>0 Views</Text>
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
                  This will contain the comment content for the clicked post.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default PostDetails;
