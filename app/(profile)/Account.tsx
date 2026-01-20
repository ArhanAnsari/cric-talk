import { showToast } from "@/libs/showToast";
import { updateEmail, updateUsername } from "@/services/profile.service";
import { useUser } from "@/store/useUser";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Modal, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Account = () => {
  const username = useUser((s) => s.username) || "";
  const setUsername = useUser((s) => s.setUsername);
  const [newUsername, setNewUsername] = useState<string>(username);

  const email = useUser((s) => s.email) || "";
  const setEmail = useUser((s) => s.setEmail);
  const [newEmail, setNewEmail] = useState<string>(email);

  const [password, setPassword] = useState<string>("");

  const isNewUsername =
    username.trim() !== newUsername.trim() && newUsername.trim() !== "";
  const isNewEmail = email.trim() !== newEmail.trim() && newEmail.trim() !== "";

  const [isEmailModalVisible, setIsEmailModalVisible] =
    useState<boolean>(false);

  async function handleUpdateUsername() {
    try {
      if (newUsername.trim().length >= 36) {
        alert("Username can't be longer than 36 characaters");
        return;
      }

      await updateUsername(newUsername.trim());
      setUsername(newUsername.trim());

      showToast({
        type: "success",
        text1: "Username updated successfully",
      });
    } catch (error) {
      showToast({
        type: "error",
        text1: "Error updating username",
        text2: "Please try again later.",
      });
    }
  }

  async function handleUpdateEmail() {
    try {
      const emailRegex: RegExp =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

      if (!emailRegex.test(newEmail)) {
        showToast({
          type: "error",
          text1: "Invalid email format",
        });
        setIsEmailModalVisible(false);

        return;
      }

      await updateEmail(newEmail.trim(), password.trim());
      setEmail(newEmail);
      setPassword("");
      setIsEmailModalVisible(false);

      showToast({
        type: "error",
        text1: "Email updated successfully",
      });
    } catch (error) {
      setIsEmailModalVisible(false);
      showToast({
        type: "error",
        text1: "Error updating email address",
        text2: "Please try again later.",
      });
    }
  }

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center">
            <Pressable
              className="size-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
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
            {username[0]}
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
                value={newUsername}
                onChangeText={setNewUsername}
                placeholder="Change your username"
                placeholderTextColor="gray"
                className="border border-slate-300 rounded-lg h-12 text-slate-900 flex-1 pl-4"
              />

              <Pressable
                disabled={!isNewUsername}
                className={`w-12 h-12 ${
                  isNewUsername ? "bg-orange-500" : "bg-slate-500"
                } rounded-lg items-center justify-center transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85`}
                onPress={handleUpdateUsername}
              >
                <Ionicons
                  name={isNewUsername ? "save-outline" : "create-outline"}
                  size={18}
                  color="white"
                />
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
                value={newEmail}
                onChangeText={setNewEmail}
                placeholder="Change your email address"
                placeholderTextColor="gray"
                className="border border-slate-300 rounded-lg h-12 text-slate-900 flex-1 pl-4"
              />

              <Pressable
                disabled={!isNewEmail}
                className={`w-12 h-12 ${
                  isNewEmail ? "bg-orange-500" : "bg-slate-500"
                } rounded-lg items-center justify-center transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85`}
                onPress={() => setIsEmailModalVisible(true)}
              >
                <Ionicons
                  name={isNewEmail ? "save-outline" : "create-outline"}
                  size={18}
                  color="white"
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* EMAIL CHANGE MODAL */}
      <Modal visible={isEmailModalVisible} transparent animationType="slide">
        {/* OVERLAY */}
        <Pressable
          className="bg-gray-900/40 absolute inset-0"
          onPress={() => setIsEmailModalVisible(false)}
        />

        <View className="flex-1 justify-center items-center">
          <View className="bg-white w-80 h-60 px-4 py-4 rounded-lg">
            <View className="gap-2">
              <Text className="text-slate-900 font-medium">
                Enter your password
              </Text>
              <Text className="text-sm text-slate-500">
                In order to change your email address you have to enter your
                password.
              </Text>
            </View>

            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="gray"
              className="border border-slate-300 rounded-lg mt-2 pl-4 text-slate-900"
            />

            <View className="flex-row mt-auto ml-auto gap-6 items-center">
              <Pressable onPress={() => setIsEmailModalVisible(false)}>
                <Text className="text-slate-900">Cancel</Text>
              </Pressable>

              <Pressable
                className="bg-orange-500 px-3 py-1.5 rounded-lg"
                onPress={handleUpdateEmail}
              >
                <Text className="text-white font-medium">Change</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Account;
