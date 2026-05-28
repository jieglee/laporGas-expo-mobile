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
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFCFA" }}>
      <ActivityIndicator color="#E8541C" />
    </View>
  );

  return <Redirect href={token ? "/(tabs)" : "/(auth)/login" as any} />;
}