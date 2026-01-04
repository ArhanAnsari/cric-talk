import Toast from "react-native-toast-message";

export function showToast({
  type,
  text1,
  text2,
}: {
  type: "success" | "error" | "info";
  text1: string;
  text2?: string;
}) {
  Toast.show({
    type,
    text1,
    text2,
    swipeable: true,
    visibilityTime: 2000,
  });
}
