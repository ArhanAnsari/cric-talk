import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginSecurity = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          {/* HEADER */}
          <View className="px-6 py-4 flex-row items-center">
            <Pressable
              className="w-10 h-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="absolute left-0 right-0 items-center">
              <Text className="text-white text-lg font-semibold">
                Login and Security
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* LOGIN SECURITY CONTENT */}
      <View className="px-6 py-4">
        {/* PASSWORD CHANGE */}
        <View>
          <Text className="text-slate-900 text-lg font-medium mb-2">
            Change Password
          </Text>

          <View className="gap-2">
            <View className="gap-2">
              <Text className="text-slate-900 font-medium">Old Password</Text>
              <TextInput
                value={oldPassword}
                onChangeText={setOldPassword}
                placeholder="Enter your old password"
                className="border border-slate-300 rounded-lg"
              />
            </View>

            <View className="gap-2">
              <Text className="text-slate-900 font-medium">New Password</Text>
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter your new password"
                className="border border-slate-300 rounded-lg"
              />
            </View>
          </View>

          <Pressable className="bg-orange-500 items-center w-full rounded-lg px-6 py-3 mt-4 transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85">
            <Text className="text-white font-medium">Update</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default LoginSecurity;
