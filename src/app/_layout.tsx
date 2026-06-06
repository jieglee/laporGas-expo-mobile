import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import CustomSplash from "@/components/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
    const [loaded] = useFonts({});
    const [showSplash, setShowSplash] = useState(false);
    const [splashVisible, setSplashVisible] = useState(false);

    useEffect(() => {
        if (loaded) SplashScreen.hideAsync();
    }, [loaded]);

    useEffect(() => {
        async function checkSplash() {
            try {
                const shown = await AsyncStorage.getItem("splash_shown");
                if (!shown) {
                    setShowSplash(true);
                    setSplashVisible(true);
                    await AsyncStorage.setItem("splash_shown", "1");

                    setTimeout(() => {
                        setSplashVisible(false);
                        setTimeout(() => setShowSplash(false), 1200);
                    }, 2200);
                }
            } catch {

                setShowSplash(true);
                setSplashVisible(true);
            }
        }
        checkSplash();
    }, []);


    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FFFCFA" }}>
            <SafeAreaProvider>
                <QueryClientProvider client={queryClient}>
                    <PaperProvider>
                        <StatusBar style="auto" />
                        {loaded && (
                            <Stack screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="index" />
                                <Stack.Screen name="(auth)" />
                                <Stack.Screen name="(tabs)" />
                                <Stack.Screen name="laporan/[id]" />
                                <Stack.Screen name="onboarding" />
                            </Stack>
                        )}
                        {showSplash && (
                            <View style={{
                                position: "absolute",
                                top: 0, left: 0, right: 0, bottom: 0,
                                zIndex: 9999,
                            }}>
                                <CustomSplash isVisible={splashVisible} />
                            </View>
                        )}
                    </PaperProvider>
                </QueryClientProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}