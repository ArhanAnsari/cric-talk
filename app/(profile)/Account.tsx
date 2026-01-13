import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Account = () => {
  const [newUsername, setNewUsername] = useState<string>("");
  const [newEmail, setNewEmail] = useState<string>("");

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center">
            <Pressable
              className="w-10 h-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="absolute left-0 right-0 items-center">
              <Text className="text-white text-lg font-semibold">Account</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* ACCOUNT CONTENT */}
      <View className="px-6 py-4">
        {/* PROFILE PICTURE CHANGE */}
        <View className="size-45 bg-slate-300 rounded-full mx-auto mt-6 items-center justify-center">
          <Text className="capitalize text-4xl font-medium text-slate-600">
            s
          </Text>

          <Pressable className="absolute bottom-4 right-3 bg-slate-300 p-1 shadow-sm elevation-xs rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85">
            <Ionicons name="create-outline" size={18} color="#45556c" />
          </Pressable>
        </View>

        {/* USERNAME + EMAIL CHANGE INPUT */}
        <View className="gap-2">
          {/* USERNAME CHANGE */}
          <View>
            <Text className="text-slate-900 text-lg font-medium">Username</Text>

            <View className="flex-row gap-2">
              <TextInput
                onChangeText={setNewUsername}
                placeholder="Change your username"
                className="border border-slate-300 rounded-lg h-12 text-slate-900 flex-1"
              />

              <Pressable className="w-12 h-12 bg-orange-500 rounded-lg items-center justify-center">
                <Ionicons name="create-outline" size={18} color="white" />
              </Pressable>
            </View>
          </View>

          {/* EMAIL CHANGE */}
          <View>
            <Text className="text-slate-900 text-lg font-medium">
              Email Address
            </Text>

            <View className="flex-row gap-2">
              <TextInput
                onChangeText={setNewEmail}
                placeholder="Change your email address"
                className="border border-slate-300 rounded-lg h-12 text-slate-900 flex-1"
              />

              <Pressable className="w-12 h-12 bg-orange-500 rounded-lg items-center justify-center">
                <Ionicons name="create-outline" size={18} color="white" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Account;
