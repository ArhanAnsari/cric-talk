import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export async function registerForPushNotificationsAsync() {
  // if device is android then set notifications channel
  if (Platform.OS === "ios") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "white",
    });
  }

  // if permission exits use it or ask for permission
  const existingStatus = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus.status !== "granted") {
    const status = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus.status !== "granted") {
    console.log("Permission not granted for notifications");
    return;
  }

  // get the project id
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) {
    console.log("Project ID not found");
    return;
  }

  // get push token
  try {
    const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(pushToken);
    return pushToken;
  } catch (e: unknown) {
    console.log(e);
  }
}
