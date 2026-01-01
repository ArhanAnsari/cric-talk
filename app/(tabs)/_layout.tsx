import { Tabs } from "expo-router";
import React from "react";

const TabsLayout = () => {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="HomeScreen" options={{ title: "Home" }} />
      <Tabs.Screen name="RoomsScreen" options={{ title: "Rooms" }} />
      <Tabs.Screen
        name="LeaderboardScreen"
        options={{ title: "Leaderboard" }}
      />
    </Tabs>
  );
};

export default TabsLayout;
