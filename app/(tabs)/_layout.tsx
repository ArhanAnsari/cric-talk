import { Ionicons, Octicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarActiveTintColor: "#ff6900" }}
    >
      <Tabs.Screen
        name="HomeScreen"
        options={{
          title: "Home",
          tabBarIcon: ({ size, color, focused }) => (
            <Octicons
              name={focused ? "home-fill" : "home"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="RoomsScreen"
        options={{
          title: "Rooms",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={
                focused ? "chatbubble-ellipses" : "chatbubble-ellipses-outline"
              }
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="LeaderboardScreen"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ size, color, focused }) => (
            <Ionicons
              name={focused ? "trophy" : "trophy-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
