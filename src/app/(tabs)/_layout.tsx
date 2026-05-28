import { Tabs } from "expo-router";
import { Home, Compass, Plus, Bell, User } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

const ORANGE = "#E8541C";
const GRAY = "#a8856b";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: ORANGE,
                tabBarInactiveTintColor: GRAY,
                tabBarStyle: {
                    backgroundColor: "#fff",
                    borderTopColor: "#f0e6dc",
                    borderTopWidth: 0.5,
                    height: 64,
                    paddingBottom: 10,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: "600",
                },
            }}
        >
            <Tabs.Screen name="index"
                options={{ title: "Beranda", tabBarIcon: ({ color }) => <Home size={22} color={color} strokeWidth={1.8} /> }} />
            <Tabs.Screen name="explore"
                options={{ title: "Explore", tabBarIcon: ({ color }) => <Compass size={22} color={color} strokeWidth={1.8} /> }} />
            <Tabs.Screen name="buat-laporan"
                options={{
                    title: "",
                    tabBarIcon: ({ color }) => (
                        <View style={styles.fabWrapper}>
                            <View style={styles.fab}>
                                <Plus size={22} color="#fff" strokeWidth={2.5} />
                            </View>
                        </View>
                    ),
                }}
            />
            <Tabs.Screen name="notifikasi"
                options={{ title: "Notifikasi", tabBarIcon: ({ color }) => <Bell size={22} color={color} strokeWidth={1.8} /> }} />
            <Tabs.Screen name="profil"
                options={{ title: "Profil", tabBarIcon: ({ color }) => <User size={22} color={color} strokeWidth={1.8} /> }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    fabWrapper: { alignItems: "center", justifyContent: "center", top: -10 },
    fab: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: ORANGE,
        alignItems: "center", justifyContent: "center",
        shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35, shadowRadius: 8, elevation: 8,
    },
});