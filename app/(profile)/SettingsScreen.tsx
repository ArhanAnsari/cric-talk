import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type SettingOptionProps = {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  description: string;
  onPress: () => void;
};

const SettingOption = ({
  icon,
  title,
  description,
  onPress,
}: SettingOptionProps) => {
  return (
    <Pressable
      className="flex-row items-center gap-2 bg-white shadow-sm elevation-xs p-3 rounded-md transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
      onPress={onPress}
    >
      <Ionicons name={icon} size={24} color="#0f172b" />

      <View className="gap-1 flex-1">
        {/* SETTING NAME + ARROW */}
        <View className="flex-row items-center">
          <Text className="text-slate-900 text-lg font-medium">{title}</Text>

          <Pressable className="ml-auto">
            <Ionicons name="chevron-forward" size={18} color="#62748e" />
          </Pressable>
        </View>

        {/* SETTING DESCRIPTION */}
        <Text className="text-slate-500 text-sm max-w-[95%]">
          {description}
        </Text>
      </View>
    </Pressable>
  );
};

const SettingsScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        {/* HEADER */}
        <SafeAreaView>
          <View className="px-6 py-4 flex-row items-center">
            <Pressable className="w-10 h-10 bg-orange-600 items-center justify-center rounded-full tranistion-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85">
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="absolute left-0 right-0 items-center">
              <Text className="text-white text-lg font-semibold">Settings</Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* SETTINGS CONTENT */}
      <View className="px-6 py-4 mt-6">
        <View className="gap-4">
          <SettingOption
            icon="person-outline"
            title="Account"
            description="Change your username, profile picture and email address."
            onPress={() => router.push("/(profile)/Account")}
          />

          <SettingOption
            icon="shield-checkmark-outline"
            title="Login and Security"
            description="Change your password, download your data, logout from this device or logout from all logged in devices."
            onPress={() => router.push("/(profile)/LoginSecurity")}
          />
        </View>
      </View>
    </View>
  );
};

export default SettingsScreen;
