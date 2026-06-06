import { useEffect, useState } from "react";
import { View } from "react-native";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const { token, loadFromStorage } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [onboardingDone, setOnboardingDone] = useState(false);

  useEffect(() => {
    async function init() {
      await AsyncStorage.removeItem("onboarding_done"); // sementara doangggg
      await loadFromStorage();
      const done = await AsyncStorage.getItem("onboarding_done");
      setOnboardingDone(!!done);
      setLoading(false);
    }
    init();
  }, []);

  if (loading) return <View style={{ flex: 1, backgroundColor: "#E8541C" }} />;

  if (!onboardingDone) return <Redirect href="/onboarding" />;

  return <Redirect href={token ? ("/(tabs)" as any) : "/(auth)/login"} />;
}