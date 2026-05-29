import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";

const ORANGE = "#E8541C";

function getGreeting() {
    const h = new Date().getHours();
    if (h < 11) return "Selamat pagi";
    if (h < 15) return "Selamat siang";
    if (h < 18) return "Selamat sore";
    return "Selamat malam";
}

interface Props { firstName: string; }

export default function HeroSection({ firstName }: Props) {
    const router = useRouter();
    return (
        <View style={styles.hero}>
            <Text style={styles.greeting}>{getGreeting()}, {firstName} 👋</Text>
            <Text style={styles.heroTitle}>
                Suara yang biasanya{" "}
                <Text style={{ color: ORANGE, fontStyle: "italic" }}>terabaikan</Text>.
            </Text>
            <Text style={styles.heroSub}>
                Lihat laporan di sekitar, dukung yang penting, atau buat laporan baru.
            </Text>
            <TouchableOpacity
                style={styles.heroBtn}
                onPress={() => router.push("/(tabs)/buat-laporan" as any)}
                activeOpacity={0.85}
            >
                <Text style={styles.heroBtnText}>Buat Laporan</Text>
                <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    hero: { backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28, borderBottomWidth: 0.5, borderBottomColor: "#f0e6dc" },
    greeting: { fontSize: 13, fontWeight: "600", color: ORANGE, marginBottom: 8 },
    heroTitle: { fontSize: 26, fontWeight: "800", color: "#1a0e08", lineHeight: 32, marginBottom: 8, letterSpacing: -0.5 },
    heroSub: { fontSize: 13, color: "#6B7280", lineHeight: 20, marginBottom: 20 },
    heroBtn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: ORANGE, borderRadius: 99, paddingHorizontal: 20, paddingVertical: 12, alignSelf: "flex-start", shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 4 },
    heroBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});