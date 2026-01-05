import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const RoomDiscussion = () => {
  const { roomId } = useLocalSearchParams();

  return (
    <View>
      <Text>RoomDetails</Text>
    </View>
  );
};

export default RoomDiscussion;
