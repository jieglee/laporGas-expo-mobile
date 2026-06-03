import { useEffect, useState, useRef } from "react";
import { Tabs, useRouter } from "expo-router";
import { Home, Compass, Plus, Bell, User } from "lucide-react-native";
import {
    StyleSheet, View, ActivityIndicator,
    Animated, TouchableOpacity, Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useAuthStore } from "@/store/auth.store";

const ORANGE = "#E8541C";
const BG = "#F5EDE3";
const ICON_INACTIVE = "#a8856b";
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

function buildPath(cx: number) {
    const r = 40;
    const d = 72; // full height — notch sampai atas
    const h = 72;
    return [
        `M0,0`,
        `L${cx - r - 20},0`,
        `C${cx - r},0 ${cx - r + 8},${d * 0.4} ${cx},${d * 0.45}`,
        `C${cx + r - 8},${d * 0.4} ${cx + r},0 ${cx + r + 20},0`,
        `L${width},0`,
        `L${width},${h}`,
        `L0,${h}`,
        `Z`,
    ].join(" ");
}

function AnimatedTabBar({ state, navigation }: any) {
    const notchX = useRef(
        new Animated.Value(TAB_WIDTH * state.index + TAB_WIDTH / 2)
    ).current;

    const bubbleX = useRef(
        new Animated.Value(TAB_WIDTH * state.index + TAB_WIDTH / 2 - 20)
    ).current;

    const [svgPath, setSvgPath] = useState(
        buildPath(TAB_WIDTH * state.index + TAB_WIDTH / 2)
    );

    useEffect(() => {
        const targetX = TAB_WIDTH * state.index + TAB_WIDTH / 2;

        const notchAnim = Animated.spring(notchX, {
            toValue: targetX,
            useNativeDriver: false,
            tension: 50,
            friction: 10,
        });

        Animated.spring(bubbleX, {
            toValue: targetX - 20,
            useNativeDriver: true,
            tension: 55,
            friction: 10,
        }).start();

        const listenerId = notchX.addListener(({ value }) => {
            setSvgPath(buildPath(value));
        });

        notchAnim.start();

        return () => notchX.removeListener(listenerId);
    }, [state.index]);

    return (
        <View style={styles.tabBar}>
            {/* SVG notch background */}
            <View style={StyleSheet.absoluteFill} pointerEvents="none">
                <Svg width={width} height={72}>
                    <Path d={svgPath} fill={BG} />
                </Svg>
            </View>

            {/* Sliding bubble */}
            <Animated.View
                style={[styles.bubble, { transform: [{ translateX: bubbleX }] }]}
                pointerEvents="none"
            />

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
                            activeOpacity={0.8}
                        >
                            <View style={styles.fab}>
                                <Plus size={24} color="#fff" strokeWidth={2.5} />
                            </View>
                        </TouchableOpacity>
                    );
                }

                return (
                    <TouchableOpacity
                        key={route.key}
                        style={[styles.tabItem, { width: TAB_WIDTH }]}
                        onPress={onPress}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconWrap}>
                            <Icon
                                size={22}
                                color={isFocused ? "#fff" : ICON_INACTIVE}
                                strokeWidth={isFocused ? 2.2 : 1.8}
                            />
                        </View>
                        <Animated.Text style={[
                            styles.tabLabel,
                            { color: isFocused ? ORANGE : ICON_INACTIVE }
                        ]}>
                            {label}
                        </Animated.Text>
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
    tabBar={(props) => <AnimatedTabBar {...props} />}
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
        height: 72,
        flexDirection: "row",
        backgroundColor: "transparent",
        position: "relative",
        overflow: "visible",
    },
    bubble: {
        position: "absolute",
        top: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: ORANGE,
        shadowColor: ORANGE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 8,
        zIndex: 0,
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
        height: 72,
        gap: 4,
        zIndex: 1,
        width: TAB_WIDTH,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: "600",
        letterSpacing: 0.2,
    },
    fab: {
        width: 54,
        height: 54,
        borderRadius: 27,
        backgroundColor: ORANGE,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: ORANGE,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
});