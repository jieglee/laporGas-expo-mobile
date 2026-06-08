import { useEffect, useState } from "react";
import { Tabs, useRouter } from "expo-router";
import { Home, Compass, Plus, Bell, User } from "lucide-react-native";
import {
    StyleSheet, View, Text, ActivityIndicator,
    TouchableOpacity, Dimensions,
} from "react-native";
import { useAuthStore } from "@/store/auth.store";
import { useNotifStore } from "@/store/notif.store";

const ORANGE = "#E8541C";
const ORANGE_LIGHT = "#FFF5EE";
const INACTIVE = "#b8a49a";
const { width } = Dimensions.get("window");
const TAB_COUNT = 5;
const TAB_WIDTH = width / TAB_COUNT;

const TABS = [
    { name: "index",        icon: Home,    label: "Beranda"    },
    { name: "explore",      icon: Compass, label: "Explore"    },
    { name: "buat-laporan", icon: Plus,    label: ""           },
    { name: "notifikasi",   icon: Bell,    label: "Notifikasi" },
    { name: "profil",       icon: User,    label: "Profil"     },
];

function SimpleTabBar({ state, navigation }: any) {
    const { unreadCount } = useNotifStore();

    return (
        <View style={styles.tabBar}>
            {/* Top border accent */}
            <View style={styles.topBorder} />

            {state.routes.map((route: any, index: number) => {
                const isFocused = state.index === index;
                const isFAB = index === 2;
                const Icon = TABS[index].icon;
                const label = TABS[index].label;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                if (isFAB) {
                    return (
                        <TouchableOpacity
                            key={route.key}
                            style={[styles.tabItem, { width: TAB_WIDTH }]}
                            onPress={onPress}
                            activeOpacity={0.85}
                        >
                            <View style={styles.fab}>
                                <Plus size={22} color="#fff" strokeWidth={2.5} />
                            </View>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={route.key}
                        style={[styles.tabItem, { width: TAB_WIDTH }]}
                        onPress={onPress}
                        activeOpacity={0.75}
                    >
                        {/* Active indicator dot */}
                        {isFocused && <View style={styles.activeDot} />}

                        <View style={[
                            styles.iconWrap,
                            isFocused && styles.iconWrapActive,
                        ]}>
                            <Icon
                                size={20}
                                color={isFocused ? ORANGE : INACTIVE}
                                strokeWidth={isFocused ? 2.2 : 1.8}
                            />
                            {/* Notif badge */}
                            {index === 3 && unreadCount > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>
                                        {unreadCount > 9 ? "9+" : String(unreadCount)}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {label ? (
                            <Text style={[
                                styles.tabLabel,
                                { color: isFocused ? ORANGE : INACTIVE },
                                isFocused && styles.tabLabelActive,
                            ]}>
                                {label}
                            </Text>
                        ) : null}
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

export default function TabsLayout() {
    const { token, loadFromStorage } = useAuthStore();
    const router = useRouter();
    const [ready, setReady] = useState(false);

    useEffect(() => {
        loadFromStorage().finally(() => setReady(true));
    }, []);

    useEffect(() => {
        if (ready && !token) {
            router.replace("/(auth)/login" as any);
        }
    }, [ready, token]);

    if (!ready) return (
        <View style={{ flex: 1, backgroundColor: "#FFFCFA", alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color={ORANGE} />
        </View>
    );

    return (
        <Tabs
            tabBar={(props) => <SimpleTabBar {...props} />}
            screenOptions={{
                headerShown: false,
                // @ts-ignore
                contentStyle: { backgroundColor: "#FFFCFA" },
            }}
        >
            <Tabs.Screen name="index" />
            <Tabs.Screen name="explore" />
            <Tabs.Screen name="buat-laporan" />
            <Tabs.Screen name="notifikasi" />
            <Tabs.Screen name="profil" />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 68,
        flexDirection: "row",
        backgroundColor: "#fff",
        borderTopWidth: 0,
        shadowColor: "#1a0e08",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 12,
        position: "relative",
    },
    topBorder: {
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: 1,
        backgroundColor: "#f0e6dc",
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
        height: 68,
        gap: 3,
        position: "relative",
    },
    activeDot: {
        position: "absolute",
        top: 0,
        width: 24,
        height: 2.5,
        borderRadius: 99,
        backgroundColor: ORANGE,
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    iconWrapActive: {
        backgroundColor: ORANGE_LIGHT,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: "500",
        letterSpacing: 0.1,
    },
    tabLabelActive: {
        fontWeight: "700",
    },
    fab: {
        width: 50,
        height: 50,
        borderRadius: 16,
        backgroundColor: ORANGE,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: ORANGE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 10,
        elevation: 8,
        marginBottom: 8,
    },
    badge: {
        position: "absolute",
        top: 2,
        right: 2,
        minWidth: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#EF4444",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 3,
        borderWidth: 1.5,
        borderColor: "#fff",
    },
    badgeText: {
        fontSize: 8,
        fontWeight: "800",
        color: "#fff",
    },
});