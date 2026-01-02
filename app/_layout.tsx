import { account } from "@/libs/appwrite";
import { useUser } from "@/store/useUser";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import "../global.css";

export default function RootLayout() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  const setUsername = useUser((s) => s.setUsername);
  const setEmail = useUser((s) => s.setEmail);
  const setFavTeam = useUser((s) => s.setFavTeam);

  useEffect(() => {
    let mounted: boolean = true;

    async function fetchUser() {
      try {
        const userData = await account.get();
        if (!mounted) return;
        setUser(userData);

        if (!userData) return;
        setUsername(userData.name);
        setFavTeam(userData.prefs.favTeam || "None");
        setEmail(userData.email);
      } catch (error) {}
    }
    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
