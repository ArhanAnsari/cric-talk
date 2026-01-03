import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const PostDetails = () => {
  const { postId } = useLocalSearchParams();

  return (
    <View>
      <Text>PostDetails</Text>
    </View>
  );
};

export default PostDetails;
