import { Redirect } from "expo-router";

export default function Index() {
  const username: string | null = null;

  if (!username) return <Redirect href="/OnboardingScreen" />;

  return <Redirect href="/(tabs)/HomeScreen" />;
}
