import { account } from "@/libs/appwrite";
import { useUser } from "@/store/useUser";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import Toast from "react-native-toast-message";
import "../global.css";

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  const setUsername = useUser((s) => s.setUsername);
  const setEmail = useUser((s) => s.setEmail);
  const setFavTeam = useUser((s) => s.setFavTeam);
  const setJoinDate = useUser((s) => s.setJoinDate);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const userData = await account.get();
        if (!mounted) return;

        setUser(userData);
        setUsername(userData.name || userData.email.split("@")[0]);
        setFavTeam(userData.prefs?.favTeam || "None");
        setEmail(userData.email);
        setJoinDate(new Date(userData.$createdAt));
      } catch {
        try {
          await account.createAnonymousSession();
        } catch (e) {
          console.log("Anonymous session failed:", e);
        }
      } finally {
        if (mounted) setReady(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) return null;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </>
  );
}
