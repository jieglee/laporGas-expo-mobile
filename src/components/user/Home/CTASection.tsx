import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";

const ORANGE = "#E8541C";

export default function CTASection() {
    const router = useRouter();
    return (
        <View style={styles.cta}>
            <View style={styles.glow} />
            <Text style={styles.badge}>Mulai Sekarang</Text>
            <Text style={styles.title}>
                Masalahmu penting.{"\n"}
                <Text style={{ color: ORANGE }}>Suaramu didengar.</Text>
            </Text>
            <Text style={styles.sub}>Satu laporan bisa mengubah kondisi ribuan orang di sekitarmu.</Text>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => router.push("/(tabs)/buat-laporan" as any)}
                activeOpacity={0.85}
            >
                <Text style={styles.btnText}>Buat Laporan Sekarang</Text>
                <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    cta: { backgroundColor: "#1a0e08", borderRadius: 20, padding: 24, marginBottom: 16, overflow: "hidden" },
    glow: { position: "absolute", width: 200, height: 200, borderRadius: 99, backgroundColor: "rgba(255,107,53,0.15)", top: -80, right: -40 },
    badge: { fontSize: 10, fontWeight: "700", color: ORANGE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
    title: { fontSize: 22, fontWeight: "800", color: "#fff", lineHeight: 28, marginBottom: 10, letterSpacing: -0.3 },
    sub: { fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 20, marginBottom: 20 },
    btn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: ORANGE, borderRadius: 99, paddingHorizontal: 20, paddingVertical: 13, alignSelf: "flex-start", shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 4 },
    btnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});