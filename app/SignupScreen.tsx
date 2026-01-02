import { Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const SignupScreen = () => {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [isPasswordHidden, setIsPasswordHidden] = useState<boolean>(true);
  const isDisabled: boolean =
    email?.trim().length === 0 ||
    !email ||
    password.trim().length === 0 ||
    !password;

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
        {/* EMAIL INPUT */}
        <View className="px-6">
          <Text className="text-slate-900 text-xl font-semibold">
            What is your email?
          </Text>

          <TextInput
            value={email || ""}
            onChangeText={setEmail}
            placeholder="Enter your email"
            className="border border-orange-500 rounded-md p-2 mt-2 h-12 pl-4"
          />
        </View>

        {/* PASSWORD INPUT */}
        <View className="px-6 mt-4">
          <Text className="text-slate-900 text-xl font-semibold">
            What is your password?
          </Text>

          <View className="relative">
            <TextInput
              value={password || ""}
              onChangeText={setPassword}
              secureTextEntry={isPasswordHidden}
              placeholder="Enter your password"
              className="border border-orange-500 rounded-md p-2 mt-2 h-12 pl-4"
            />

            <Octicons
              name={isPasswordHidden ? "eye-closed" : "eye"}
              size={24}
              color="#0f172b"
              style={{ position: "absolute", right: 10, top: 16 }}
              onPress={() => setIsPasswordHidden(!isPasswordHidden)}
            />
          </View>
        </View>

        {/* GET STARTED BUTTON */}
        <Pressable
          className={`mt-4 mx-6 ${
            isDisabled ? "bg-slate-200" : "bg-orange-500"
          } px-4 py-3 rounded-md transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85`}
          disabled={isDisabled}
        >
          <Text
            className={`${
              isDisabled ? "text-slate-500" : "text-white"
            } font-medium text-lg text-center`}
          >
            Get Started
          </Text>
        </Pressable>

        {/* LOGIN LINK */}
        <View className="flex-row items-center mx-auto mt-2 gap-2">
          <Text className="text-lg font-medium text-slate-900">
            Already have an account?
          </Text>
          <Pressable onPress={() => router.replace("/LoginScreen")}>
            <Text className="text-lg text-orange-500 font-medium">Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SignupScreen;
