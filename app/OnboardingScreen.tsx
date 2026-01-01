import { useUser } from "@/store/useUser";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OnboardingScreen = () => {
  const username = useUser((s) => s.username);
  const setUsername = useUser((s) => s.setUsername);
  const isDisabled: boolean = username?.trim().length === 0 || !username;

  function handleGetStarted() {
    setUsername(username?.trim() || "");
    router.replace("/(tabs)/HomeScreen");
  }

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-60 bg-orange-500 rounded-b-4xl">
        <SafeAreaView>
          {/* Header */}
          <View className="mt-12">
            <Text className="text-white font-bold text-2xl text-center">
              CricTalk
            </Text>
            <Text className="text-white text-center mt-2">
              Your ultimate place for cricket discussions!
            </Text>
          </View>
        </SafeAreaView>
      </View>

      <SafeAreaView>
        {/* USERNAME INPUT */}
        <View className="px-6">
          <Text className="text-slate-900 text-xl font-semibold">
            What is your name?
          </Text>

          <TextInput
            value={username || ""}
            onChangeText={setUsername}
            placeholder="Enter your username"
            className="border border-orange-500 rounded-md p-2 mt-2 h-12 pl-4"
          />
        </View>

        {/* GET STARTED BUTTON */}
        <Pressable
          className={`mt-4 mx-6 ${
            isDisabled ? "bg-slate-200" : "bg-orange-500"
          } px-4 py-3 rounded-md transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85`}
          disabled={isDisabled}
          onPress={handleGetStarted}
        >
          <Text
            className={`${
              isDisabled ? "text-slate-500" : "text-white"
            } font-medium text-lg text-center`}
          >
            Get Started
          </Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
};

export default OnboardingScreen;
