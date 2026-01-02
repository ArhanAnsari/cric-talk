import { account } from "@/libs/appwrite";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";

export default function Index() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // get user info
  useEffect(() => {
    async function fetchUser() {
      const user = await account.get();

      if (!user) return;
      setUser(user);
      setIsLoading(false);
    }

    fetchUser();
  }, [user]);

  if (isLoading) return null;
  if (!user) return <Redirect href="/LoginScreen" />;

  return <Redirect href="/(tabs)/HomeScreen" />;
}
