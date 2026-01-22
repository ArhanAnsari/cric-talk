import { Notification } from "@/interfaces/Notification";
import { executeNotification } from "@/services/notifications.service";
import { executePushToken } from "@/services/pushToken.service";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NotificationCard from "../components/NotificationCard";

const NotificationsScreen = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const [notificationsList, setNotifcationsList] = useState<Notification[]>([]);

  useEffect(() => {
    async function setupPushToken() {
      try {
        const token: string = (await registerForPushNotificationsAsync()) ?? "";

        if (!token) return;

        setExpoPushToken(token);
        await executePushToken({ action: "send", pushToken: token });
      } catch (error) {
        console.log("Error while setting up token");
        return;
      }
    }
    setupPushToken();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => setNotification(notification),
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) =>
        console.log(response),
      );

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  // fetch notifications list
  useEffect(() => {
    async function fetchNotifications() {
      const execution = await executeNotification({ action: "fetchByUserId" });
      const parsed = JSON.parse(execution.responseBody);

      const notificationsData: Notification[] = parsed.data.rows;
      setNotifcationsList(notificationsData);
    }
    fetchNotifications();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <View className="w-full h-30 bg-orange-500">
        <SafeAreaView>
          {/* HEADER */}
          <View className="px-6 py-4 flex-row items-center">
            <Pressable
              className="size-10 bg-orange-600 items-center justify-center rounded-full transition-all duration-300 ease-in-out active:scale-[0.98] active:opacity-85"
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={18} color="white" />
            </Pressable>

            <View className="absolute left-0 right-0 items-center">
              <Text className="text-lg text-white font-semibold">
                Notifications
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      {/* CONTENT */}
      <View className="px-6 py-4 flex-1">
        {/* NEW NOTIFICATIONS TOTAL */}
        <Text className="text-slate-900 font-medium mb-2">
          You have {notificationsList.length} new notifications
        </Text>

        {/* NOTIFICATION CARD */}
        <FlatList
          data={notificationsList}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 80, marginTop: 16 }}
          renderItem={({ item }) => <NotificationCard notification={item} />}
        />
      </View>
    </View>
  );
};

export default NotificationsScreen;
