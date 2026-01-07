import { useEffect, useState } from "react";
import { Keyboard, Platform } from "react-native";

const useKeyboardHeight = () => {
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const keyboardShown = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setHeight(e.endCoordinates.height)
    );

    const keyboardHidden = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      (e) => setHeight(0)
    );

    return () => {
      keyboardShown.remove();
      keyboardHidden.remove();
    };
  }, []);

  return height;
};

export default useKeyboardHeight;
