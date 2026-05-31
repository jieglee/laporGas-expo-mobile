import { useState, useRef } from "react";
import {
  View, Text, TouchableOpacity, StyleSheet,
  Dimensions, FlatList, Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { MapPin, MessageCircle, CheckCircle } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const ORANGE = "#E8541C";

const SLIDES = [
  {
    id: "1",
    icon: MapPin,
    iconBg: "rgba(255,255,255,0.15)",
    title: "Laporkan Masalah\ndi Sekitar Kamu",
    sub: "Temukan dan laporkan masalah infrastruktur, kebersihan, dan fasilitas umum di lingkunganmu dengan mudah.",
  },
  {
    id: "2",
    icon: MessageCircle,
    iconBg: "rgba(255,255,255,0.15)",
    title: "Suaramu\nDidengar",
    sub: "Berikan dukungan dan komentar pada laporan warga lain. Bersama kita bisa mendorong perubahan nyata.",
  },
  {
    id: "3",
    icon: CheckCircle,
    iconBg: "rgba(255,255,255,0.15)",
    title: "Pantau Status\nLaporanmu",
    sub: "Lacak perkembangan laporanmu secara real-time. Dari pengajuan hingga penyelesaian, semua transparan.",
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
      setActiveIndex(activeIndex + 1);
    } else {
      handleDone();
    }
  };

  const handleDone = async () => {
    await AsyncStorage.setItem("onboarding_done", "true");
    router.replace("/(auth)/login" as any);
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem("onboarding_done", "true");
    router.replace("/(auth)/login" as any);
  };

  return (
    <View style={styles.root}>
      {/* Skip */}
      {activeIndex < SLIDES.length - 1 && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
          <Text style={styles.skipText}>Lewati</Text>
        </TouchableOpacity>
      )}

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(index);
        }}
        renderItem={({ item }) => {
          const Icon = item.icon;
          return (
            <View style={styles.slide}>
              {/* Decorative circles */}
              <View style={styles.circle1} />
              <View style={styles.circle2} />

              {/* Icon */}
              <View style={styles.iconWrap}>
                <Icon size={48} color="#fff" strokeWidth={1.5} />
              </View>

              {/* Text */}
              <View style={styles.textWrap}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.sub}>{item.sub}</Text>
              </View>
            </View>
          );
        }}
      />

      {/* Bottom */}
      <View style={styles.bottom}>
        {/* Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.4, 1, 0.4],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity }]}
              />
            );
          })}
        </View>

        {/* Button */}
        <TouchableOpacity style={styles.btn} onPress={handleNext} activeOpacity={0.85}>
          <Text style={styles.btnText}>
            {activeIndex === SLIDES.length - 1 ? "Mulai Sekarang" : "Lanjut"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ORANGE },

  skipBtn: {
    position: "absolute", top: 56, right: 24, zIndex: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 99, paddingHorizontal: 16, paddingVertical: 8,
  },
  skipText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  slide: {
    width, flex: 1,
    alignItems: "center", justifyContent: "center",
    paddingHorizontal: 32, gap: 32,
    overflow: "hidden",
  },

  circle1: {
    position: "absolute", width: 380, height: 380, borderRadius: 999,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    top: "30%", left: "50%", marginLeft: -190, marginTop: -190,
  },
  circle2: {
    position: "absolute", width: 560, height: 560, borderRadius: 999,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    top: "30%", left: "50%", marginLeft: -280, marginTop: -280,
  },

  iconWrap: {
    width: 120, height: 120, borderRadius: 36,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 8,
  },

  textWrap: { alignItems: "center", gap: 14 },
  title: {
    fontSize: 32, fontWeight: "800", color: "#fff",
    textAlign: "center", letterSpacing: -0.5, lineHeight: 38,
  },
  sub: {
    fontSize: 15, color: "rgba(255,255,255,0.7)",
    textAlign: "center", lineHeight: 24,
  },

  bottom: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    paddingHorizontal: 24, paddingBottom: 52, paddingTop: 24,
    alignItems: "center", gap: 24,
  },

  dots: { flexDirection: "row", gap: 6, alignItems: "center" },
  dot: {
    height: 8, borderRadius: 99,
    backgroundColor: "#fff",
  },

  btn: {
    width: "100%", backgroundColor: "#fff",
    borderRadius: 16, paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 12, elevation: 4,
  },
  btnText: { color: ORANGE, fontSize: 16, fontWeight: "800" },
});