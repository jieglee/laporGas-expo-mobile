import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { View, Text, Animated, StyleSheet, Dimensions } from "react-native";

const { height, width } = Dimensions.get("window");

interface Props {
  isVisible: boolean;
  onExitComplete?: () => void;
}

export default function SplashScreen({ isVisible, onExitComplete }: Props) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const logoY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(logoY, { toValue: 0, duration: 700, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.timing(translateY, {
        toValue: -height,
        duration: 1100,
        useNativeDriver: true,
      }).start(() => onExitComplete?.());
    }
  }, [isVisible]);

  // Web — pakai div biasa
  if (Platform.OS === "web") {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#E8541C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 24,
        transition: "transform 1.1s cubic-bezier(0.76,0,0.24,1)",
        transform: isVisible ? "translateY(0)" : "translateY(-100%)",
      }}>
        {/* Circles */}
        {[380, 560].map((size) => (
          <div key={size} style={{
            position: "absolute",
            width: size, height: size,
            borderRadius: "50%",
            border: `1px solid rgba(255,255,255,${size === 380 ? 0.1 : 0.07})`,
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }} />
        ))}

        {/* Logo */}
        <div style={{
          width: 72, height: 72, borderRadius: 20,
          backgroundColor: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", zIndex: 1,
        }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>LG</span>
        </div>

        {/* Text */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
          <h1 style={{
            fontSize: 42, fontWeight: 800, color: "#fff",
            letterSpacing: -1, margin: 0, lineHeight: 1,
          }}>
            Lapor<span style={{ color: "rgba(255,255,255,0.45)" }}>Gas</span>
          </h1>
          <p style={{
            fontSize: 11, color: "rgba(255,255,255,0.5)",
            letterSpacing: 3, fontWeight: 600,
            textTransform: "uppercase", marginTop: 12, marginBottom: 0,
          }}>
            Platform Pengaduan Publik
          </p>
        </div>
      </div>
    );
  }

  // Native
  return (
    <Animated.View style={[styles.root, { transform: [{ translateY }] }]}>
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <Animated.View style={[styles.content, { opacity, transform: [{ translateY: logoY }] }]}>
        <View style={styles.logoBox}>
          <Text style={styles.logoText}>LG</Text>
        </View>
        <View style={styles.textWrap}>
          <Text style={styles.title}>
            Lapor<Text style={styles.titleFade}>Gas</Text>
          </Text>
          <Text style={styles.sub}>PLATFORM PENGADUAN PUBLIK</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0, left: 0,
    width, height,
    backgroundColor: "#E8541C",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  circle1: {
    position: "absolute",
    width: 380, height: 380, borderRadius: 999,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.1)",
    top: "50%", left: "50%",
    marginTop: -190, marginLeft: -190,
  },
  circle2: {
    position: "absolute",
    width: 560, height: 560, borderRadius: 999,
    borderWidth: 1, borderColor: "rgba(255,255,255,0.07)",
    top: "50%", left: "50%",
    marginTop: -280, marginLeft: -280,
  },
  content: { alignItems: "center", gap: 24 },
  logoBox: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  logoText: { fontSize: 28, fontWeight: "800", color: "#fff" },
  textWrap: { alignItems: "center", gap: 10 },
  title: { fontSize: 42, fontWeight: "800", color: "#fff", letterSpacing: -1 },
  titleFade: { color: "rgba(255,255,255,0.45)" },
  sub: { fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: 3, fontWeight: "600" },
});