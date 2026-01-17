import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const RoomManage = () => {
  const { roomId } = useLocalSearchParams();

  return (
    <View>
      <Text>RoomManage</Text>
    </View>
  );
};

export default RoomManage;
