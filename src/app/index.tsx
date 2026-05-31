import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import { useAuthStore } from "@/store/auth.store";

export default function Index() {
  const { token, loadFromStorage } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage().finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <View style={{ flex: 1, backgroundColor: "#E8541C" }} />
  );

  return <Redirect href={token ? ("/(tabs)" as any) : "/(auth)/login"} />;
}