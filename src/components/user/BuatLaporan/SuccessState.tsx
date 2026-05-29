import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CheckCircle2, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

const ORANGE = "#E8541C";

interface Props { onReset: () => void; }

export default function SuccessState({ onReset }: Props) {
    const router = useRouter();
    return (
        <View style={styles.root}>
            <View style={styles.icon}><CheckCircle2 size={34} color="#fff" strokeWidth={2} /></View>
            <Text style={styles.title}>Laporan terkirim!</Text>
            <Text style={styles.sub}>Laporan kamu sudah kami terima dan sedang dalam proses verifikasi.</Text>
            <TouchableOpacity style={styles.btn} onPress={() => router.push("/(tabs)/profil" as any)} activeOpacity={0.85}>
                <Text style={styles.btnText}>Lihat laporan saya</Text>
                <ChevronRight size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondary} onPress={onReset}>
                <Text style={styles.secondaryText}>Buat laporan lain</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32, backgroundColor: "#FFFCFA" },
    icon: { width: 72, height: 72, borderRadius: 99, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", marginBottom: 20, shadowColor: ORANGE, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 6 },
    title: { fontSize: 24, fontWeight: "800", color: "#1a0e08", marginBottom: 10, textAlign: "center" },
    sub: { fontSize: 14, color: "#6b5546", lineHeight: 22, textAlign: "center", marginBottom: 28 },
    btn: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: ORANGE, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14, marginBottom: 12 },
    btnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
    secondary: { borderWidth: 0.5, borderColor: "#f0e6dc", borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14 },
    secondaryText: { fontSize: 14, fontWeight: "600", color: "#3d2817" },
});
