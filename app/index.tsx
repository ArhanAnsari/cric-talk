import { useUser } from "@/store/useUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const username = useUser((s) => s.username);
  const setUsername = useUser((s) => s.setUsername);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // get user info
  useEffect(() => {
    async function fetchUser() {
      const storedUsername = await AsyncStorage.getItem("username");
      setUsername(storedUsername || "");
      setIsLoading(false);
    }

    fetchUser();
  }, [setUsername]);

  if (isLoading) return null;
  if (!username) return <Redirect href="/OnboardingScreen" />;

  return <Redirect href="/(tabs)/HomeScreen" />;
}
