import { useState, useRef, useEffect } from "react";
import {
    View, Text, TouchableOpacity, StyleSheet,
    Dimensions, Animated,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width } = Dimensions.get("window");
const ORANGE = "#E8541C";
const LOGO_PATH = "M16.84 19.16a16.5 16.5 0 0 0-2.175.949c-.18.11-.36.24-.539.369a2 2 0 0 1-.12-.14a9.4 9.4 0 0 0-1.527-1.217a.34.34 0 1 0-.449.509c.37.469.669.998.998 1.497l.09.14l-.09.08a15 15 0 0 0-1.527 1.815a.38.38 0 0 0 0 .55a.38.38 0 0 0 .54 0c.319-.3.648-.57.997-.839c.35-.27.54-.4.809-.589l.09.11c.399.489.808.948 1.197 1.427a.385.385 0 0 0 .637.017a.39.39 0 0 0 .012-.426c-.26-.569-.52-1.148-.839-1.717l-.11-.16l.24-.169c.659-.519 1.287-1.068 1.996-1.567a.34.34 0 0 0 .15-.459a.34.34 0 0 0-.38-.18m6.697-5.548a.341.341 0 1 0-.31-.609q-1.125.417-2.175.998a7 7 0 0 0-.549.37a.8.8 0 0 0-.12-.14a9 9 0 0 0-1.527-1.238a.34.34 0 0 0-.479 0a.327.327 0 0 0 0 .48c.38.478.679.997.998 1.506l.1.14l-.1.08a14 14 0 0 0-1.457 1.786a.38.38 0 0 0 0 .549a.39.39 0 0 0 .55 0c.318-.3.638-.569.997-.838c.36-.27.539-.4.808-.6l.09.12c.4.49.819.999 1.198 1.428a.39.39 0 0 0 .529.12a.4.4 0 0 0 .13-.53c-.27-.568-.53-1.147-.849-1.716c0 0-.07-.1-.1-.16l.23-.17c.659-.528 1.297-1.077 2.036-1.576m-5.2-1.178a.67.67 0 0 0 .34-.26c.09-.109.22-.418.26-.468s.149-.32.209-.49q.173-.49.29-.997l.139-.22c.1-.366.1-.752 0-1.117c-.12-.64-.42-1.437-.48-1.737c-.179-.659-.308-1.337-.478-1.996c-.11-.449-.23-.888-.36-1.337A49 49 0 0 0 17.26.469a.35.35 0 0 0-.42-.25a.44.44 0 0 0-.2.15a.3.3 0 0 0-.069-.22a.36.36 0 0 0-.529-.06c-.599.43-1.207.849-1.826 1.248c-.858.569-1.766 1.088-2.645 1.627c-.588.359-1.167.748-1.756 1.107q-.973.604-1.876 1.308a.83.83 0 0 0-.31.698L7.09 7.225q-.128.28-.2.579a.69.69 0 0 0 .11.599c.235.232.513.415.819.538a9.4 9.4 0 0 0 1.796.37a.38.38 0 0 0 .51-.31a.39.39 0 0 0-.25-.479c-.3-.12-.689-.309-1.088-.509c-.669-.319-.529-.12-.4-1.377l.45.09c.38.1.758.21 1.138.34c.379.129.998.379 1.546.578a6 6 0 0 1-.469 1.557a14.5 14.5 0 0 1-1.277 2.245c-.509.819-1.098 1.627-1.707 2.445q-.876 1.203-1.876 2.306a14 14 0 0 1-2.994 2.564a.33.33 0 0 0-.29.34a.33.33 0 0 0 .35.33a19 19 0 0 0 2.824-.14A9.3 9.3 0 0 0 8 18.9a10.2 10.2 0 0 0 2.395-1.227a11.5 11.5 0 0 0 1.996-1.797a20.4 20.4 0 0 0 3.692-6.666l1.996.868l.33.12c-1.268 1.447-.13 1.207-1.388.808a.39.39 0 0 0-.529.16a.4.4 0 0 0 .16.519q.466.406.998.718a1 1 0 0 0 .688.03m-2.754-4.27a.38.38 0 0 0-.499.219a.39.39 0 0 0 .23.499A22.6 22.6 0 0 1 12.2 14.06a14.7 14.7 0 0 1-2.615 2.545c-.64.489-1.332.904-2.065 1.237q-.795.36-1.647.55c-.32.079-.639.089-.998.139a15.4 15.4 0 0 0 2.814-2.235a18 18 0 0 0 1.996-2.455q.579-.867 1.068-1.787c.451-.8.832-1.638 1.138-2.505a7 7 0 0 0 .389-1.846a.37.37 0 0 0-.19-.34a.29.29 0 0 0-.1-.239a32 32 0 0 0-1.636-.838a9 9 0 0 0-.998-.43c.509-.299 1.097-.598 1.207-.668c.998-.688 2.086-1.377 3.084-2.116A42 42 0 0 0 16.571.708a.4.4 0 0 0 .1-.18a.3.3 0 0 0 0 .13c.33 1.587.509 3.184.778 4.78c.12.69.28 1.368.44 2.046l.448 1.517zM2.56 5.369c1.996.589 2.994-.46 2.994-1.926a1.996 1.996 0 0 0-1.667-2.096a3.05 3.05 0 0 0-2.395 1.377a1.7 1.7 0 0 0 .09 1.996c.255.307.595.533.978.649m.16-2.166c.303-.33.72-.533 1.167-.569c.42 0 .619.44.659.859c.16 1.387-.899 1.357-1.537 1.127a1.16 1.16 0 0 1-.61-.459c-.189-.359.05-.688.32-.958m1.926 7.734A1.996 1.996 0 0 0 3.01 8.842a3 3 0 0 0-2.455 1.367a1.7 1.7 0 0 0 .1 1.996c.264.298.612.51.997.609c1.986.638 2.974-.41 2.994-1.877m-3.153.719c-.22-.36 0-.689.29-.998c.303-.33.72-.537 1.167-.579c.419 0 .619.44.658.868c.21 1.837-1.736 1.358-2.115.709";

function IllustrasiBuatLaporan() {
    return (
        <Svg width={220} height={200} viewBox="0 0 220 200">
            <Rect x="60" y="20" width="100" height="160" rx="16" fill="#fff" stroke="#f0e6dc" strokeWidth="2" />
            <Rect x="68" y="36" width="84" height="120" rx="8" fill="#FFF5EE" />
            <Rect x="76" y="48" width="68" height="8" rx="4" fill="#f0e6dc" />
            <Rect x="76" y="62" width="50" height="6" rx="3" fill="#f0e6dc" />
            <Rect x="76" y="74" width="60" height="6" rx="3" fill="#f0e6dc" />
            <Rect x="76" y="120" width="68" height="22" rx="8" fill={ORANGE} />
            <Rect x="88" y="127" width="44" height="8" rx="4" fill="rgba(255,255,255,0.6)" />
            <Circle cx="168" cy="60" r="18" fill={ORANGE} opacity="0.15" />
            <Circle cx="168" cy="60" r="10" fill={ORANGE} />
            <Circle cx="168" cy="60" r="4" fill="#fff" />
            <Path d="M168 70 L168 80" stroke={ORANGE} strokeWidth="2.5" strokeLinecap="round" />
            <Rect x="28" y="80" width="48" height="28" rx="10" fill="#fff" stroke="#f0e6dc" strokeWidth="1.5" />
            <Circle cx="40" cy="94" r="5" fill={ORANGE} />
            <Rect x="50" y="90" width="20" height="4" rx="2" fill="#f0e6dc" />
            <Rect x="50" y="97" width="14" height="3" rx="1.5" fill="#f0e6dc" />
        </Svg>
    );
}

function IlustrasiSuara() {
    return (
        <Svg width={220} height={200} viewBox="0 0 220 200">
            <Circle cx="110" cy="90" r="55" fill="#FFF5EE" />
            <Path d="M85 75 L85 105 L100 105 L125 120 L125 60 L100 75 Z" fill={ORANGE} opacity="0.9" />
            <Rect x="75" y="80" width="12" height="22" rx="4" fill={ORANGE} />
            <Path d="M130 75 Q140 90 130 105" stroke={ORANGE} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7" />
            <Path d="M136 68 Q152 90 136 112" stroke={ORANGE} strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.4" />
            <Circle cx="55" cy="150" r="14" fill="#FFF5EE" stroke="#f0e6dc" strokeWidth="1.5" />
            <Circle cx="55" cy="145" r="5" fill={ORANGE} opacity="0.6" />
            <Path d="M45 158 Q55 152 65 158" stroke={ORANGE} strokeWidth="1.5" fill="none" opacity="0.6" />
            <Circle cx="110" cy="162" r="14" fill="#FFF5EE" stroke="#f0e6dc" strokeWidth="1.5" />
            <Circle cx="110" cy="157" r="5" fill={ORANGE} opacity="0.8" />
            <Path d="M100 170 Q110 164 120 170" stroke={ORANGE} strokeWidth="1.5" fill="none" opacity="0.8" />
            <Circle cx="165" cy="150" r="14" fill="#FFF5EE" stroke="#f0e6dc" strokeWidth="1.5" />
            <Circle cx="165" cy="145" r="5" fill={ORANGE} opacity="0.6" />
            <Path d="M155 158 Q165 152 175 158" stroke={ORANGE} strokeWidth="1.5" fill="none" opacity="0.6" />
        </Svg>
    );
}

function IlustrasiPantau() {
    return (
        <Svg width={220} height={200} viewBox="0 0 220 200">
            <Path d="M60 40 L60 170" stroke="#f0e6dc" strokeWidth="3" strokeLinecap="round" />
            <Circle cx="60" cy="55" r="12" fill={ORANGE} />
            <Path d="M54 55 L58 59 L66 51" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Rect x="82" y="47" width="110" height="16" rx="6" fill="#FFF5EE" />
            <Rect x="90" y="51" width="60" height="8" rx="3" fill={ORANGE} opacity="0.3" />
            <Circle cx="60" cy="100" r="12" fill={ORANGE} />
            <Path d="M54 100 L58 104 L66 96" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <Rect x="82" y="92" width="110" height="16" rx="6" fill="#FFF5EE" />
            <Rect x="90" y="96" width="80" height="8" rx="3" fill={ORANGE} opacity="0.3" />
            <Circle cx="60" cy="145" r="12" fill={ORANGE} opacity="0.3" />
            <Circle cx="60" cy="145" r="6" fill={ORANGE} />
            <Rect x="82" y="137" width="110" height="16" rx="6" fill={ORANGE} opacity="0.08" stroke={ORANGE} strokeWidth="1.5" />
            <Rect x="90" y="141" width="50" height="8" rx="3" fill={ORANGE} opacity="0.4" />
            <Circle cx="175" cy="55" r="16" fill={ORANGE} />
            <Path d="M168 55 L173 60 L182 50" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
    );
}

const SLIDES = [
    { id: "1", illustration: IllustrasiBuatLaporan, title: "Laporkan Masalah\nDengan Mudah", sub: "Kirim laporan hanya dalam beberapa langkah, tanpa proses yang rumit." },
    { id: "2", illustration: IlustrasiSuara, title: "Suaramu\nDidengar", sub: "Berikan dukungan pada laporan warga lain. Bersama kita dorong perubahan nyata." },
    { id: "3", illustration: IlustrasiPantau, title: "Pantau Status\nLaporanmu", sub: "Lacak perkembangan laporan secara real-time. Dari pengajuan hingga selesai, semua transparan." },
];

export default function OnboardingPage() {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [showChoice, setShowChoice] = useState(false);
    const flatListRef = useRef<Animated.FlatList<typeof SLIDES[0]>>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const [layoutReady, setLayoutReady] = useState(false);
    const choiceAnim = useRef(new Animated.Value(300)).current;

    useEffect(() => {
        if (showChoice) {
            Animated.spring(choiceAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 11,
            }).start();
        } else {
            choiceAnim.setValue(300);
        }
    }, [showChoice]);

    const handleNext = () => {
        if (activeIndex < SLIDES.length - 1) {
            const next = activeIndex + 1;
            (flatListRef.current as any)?.scrollToOffset({ offset: next * width, animated: true });
            setActiveIndex(next);
        } else {
            setShowChoice(true);
        }
    };

    const handleSkip = () => setShowChoice(true);

    const goLogin = async () => {
        await AsyncStorage.setItem("onboarding_done", "true");
        router.replace("/(auth)/login" as any);
    };

    const goRegister = async () => {
        await AsyncStorage.setItem("onboarding_done", "true");
        router.replace("/(auth)/register" as any);
    };

    return (
        <View style={[styles.root, { opacity: layoutReady ? 1 : 0 }]}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoWrap}>
                    <Svg width={28} height={28} viewBox="0 0 24 24">
                        <Path fill={ORANGE} fillRule="evenodd" d={LOGO_PATH} clipRule="evenodd" />
                    </Svg>
                    <Text style={styles.logoText}>LaporGas</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                    {/* DEV ONLY — hapus sebelum production */}
                    <TouchableOpacity onPress={async () => {
                        await AsyncStorage.removeItem("onboarding_done");
                        alert("Reset! Restart app.");
                    }}>
                    </TouchableOpacity>

                    {activeIndex < SLIDES.length - 1 && (
                        <TouchableOpacity onPress={handleSkip}>
                            <Text style={styles.skipText}>Lewati</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Slides */}
            <Animated.FlatList
                ref={flatListRef as any}
                data={SLIDES}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                onLayout={() => setLayoutReady(true)}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false }
                )}
                onMomentumScrollEnd={(e) => {
                    const index = Math.round(e.nativeEvent.contentOffset.x / width);
                    setActiveIndex(index);
                }}
                renderItem={({ item }) => {
                    const Illustration = item.illustration;
                    return (
                        <View style={styles.slide}>
                            <View style={styles.illustrationWrap}>
                                <View style={styles.illustrationBg}>
                                    <Illustration />
                                </View>
                            </View>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.sub}>{item.sub}</Text>
                        </View>
                    );
                }}
            />

            {/* Bottom */}
            <View style={styles.bottom}>
                <View style={styles.dots}>
                    {SLIDES.map((_, i) => {
                        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                        const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 24, 8], extrapolate: "clamp" });
                        const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: "clamp" });
                        return <Animated.View key={i} style={[styles.dot, { width: dotWidth, opacity }]} />;
                    })}
                </View>
                <TouchableOpacity style={styles.btn} onPress={handleNext} activeOpacity={0.85}>
                    <Text style={styles.btnText}>
                        {activeIndex === SLIDES.length - 1 ? "Mulai Sekarang →" : "Selanjutnya →"}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Choice Modal */}
            {showChoice && (
                <View style={styles.overlay}>
                    <TouchableOpacity style={StyleSheet.absoluteFill} onPress={() => setShowChoice(false)} />
                    <Animated.View style={[styles.choiceCard, { transform: [{ translateY: choiceAnim }] }]}>
                        <View style={styles.choiceLogoWrap}>
                            <Svg width={32} height={32} viewBox="0 0 24 24">
                                <Path fill={ORANGE} fillRule="evenodd" d={LOGO_PATH} clipRule="evenodd" />
                            </Svg>
                        </View>

                        <Text style={styles.choiceTitle}>Selamat Datang!</Text>
                        <Text style={styles.choiceSub}>Sudah punya akun atau mau daftar dulu?</Text>

                        <TouchableOpacity style={styles.choicePrimary} onPress={goLogin} activeOpacity={0.85}>
                            <Text style={styles.choicePrimaryText}>Masuk</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.choiceSecondary} onPress={goRegister} activeOpacity={0.85}>
                            <Text style={styles.choiceSecondaryText}>Daftar Akun Baru</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFCFA" },

    header: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16,
    },
    logoWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
    logoText: { fontSize: 18, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.3 },
    skipText: { fontSize: 13, fontWeight: "600", color: "#a8856b" },

    slide: { width, paddingHorizontal: 32, alignItems: "center", justifyContent: "center", paddingBottom: 160 },
    illustrationWrap: { marginBottom: 40 },
    illustrationBg: { width: 280, height: 260, backgroundColor: "#FFF5EE", borderRadius: 32, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#f0e6dc" },

    title: { fontSize: 28, fontWeight: "800", color: "#1a0e08", textAlign: "center", letterSpacing: -0.5, lineHeight: 36, marginBottom: 14 },
    sub: { fontSize: 14, color: "#a8856b", textAlign: "center", lineHeight: 22 },

    bottom: { position: "absolute", bottom: 0, left: 0, right: 0, paddingHorizontal: 24, paddingBottom: 48, paddingTop: 16, backgroundColor: "#FFFCFA", alignItems: "center", gap: 20 },
    dots: { flexDirection: "row", gap: 6, alignItems: "center" },
    dot: { height: 8, borderRadius: 99, backgroundColor: ORANGE },
    btn: { width: "100%", backgroundColor: ORANGE, borderRadius: 16, paddingVertical: 16, alignItems: "center", shadowColor: ORANGE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5 },
    btnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

    // Choice modal
    overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end", zIndex: 99 },
    choiceCard: { backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 28, paddingBottom: 48, alignItems: "center", gap: 12 },
    choiceLogoWrap: { width: 56, height: 56, borderRadius: 16, backgroundColor: "#FFF5EE", alignItems: "center", justifyContent: "center", marginBottom: 4 },
    choiceTitle: { fontSize: 22, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.4 },
    choiceSub: { fontSize: 13, color: "#a8856b", textAlign: "center", marginBottom: 8 },
    choicePrimary: { width: "100%", backgroundColor: ORANGE, borderRadius: 14, paddingVertical: 15, alignItems: "center", shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
    choicePrimaryText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    choiceSecondary: { width: "100%", backgroundColor: "#fff", borderRadius: 14, paddingVertical: 15, alignItems: "center", borderWidth: 1.5, borderColor: "#f0e6dc" },
    choiceSecondaryText: { color: "#1a0e08", fontSize: 15, fontWeight: "600" },
});