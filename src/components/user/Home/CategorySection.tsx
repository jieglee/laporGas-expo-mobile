import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Construction, Building2, Trash2, Car } from "lucide-react-native";
import { useRouter } from "expo-router";

const ORANGE = "#E8541C";

const CATEGORIES = [
    { id: "1", label: "Infrastruktur", icon: Construction },
    { id: "2", label: "Fasilitas Umum", icon: Building2 },
    { id: "3", label: "Kebersihan", icon: Trash2 },
    { id: "4", label: "Lalu Lintas", icon: Car },
];

export default function CategorySection() {
    const router = useRouter();
    return (
        <View style={styles.section}>
            <Text style={styles.title}>Jelajahi Kategori</Text>
            <Text style={styles.sub}>Pilih kategori untuk lihat laporan sejenis</Text>
            <View style={styles.grid}>
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <TouchableOpacity
                            key={cat.id}
                            style={styles.card}
                            onPress={() => router.push(`/(tabs)/explore?kategori=${cat.id}` as any)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconWrap}>
                                <Icon size={20} color={ORANGE} strokeWidth={1.8} />
                            </View>
                            <Text style={styles.label}>{cat.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },
    title: { fontSize: 16, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.3 },
    sub: { fontSize: 12, color: "#a8856b", marginTop: 2 },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
    card: { width: "47%", backgroundColor: "#fff", borderRadius: 16, borderWidth: 0.5, borderColor: "#f0e6dc", padding: 16, alignItems: "center", gap: 10 },
    iconWrap: { width: 48, height: 48, borderRadius: 12, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center" },
    label: { fontSize: 13, fontWeight: "600", color: "#3d2817" },
});