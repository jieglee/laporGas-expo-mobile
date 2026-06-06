import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Construction, Building2, Trash2, Car } from "lucide-react-native";

const CATEGORIES = [
    { slug: "infrastruktur",  label: "Infrastruktur",  icon: Construction, colors: ["#FF6B35", "#E8201A"] },
    { slug: "fasilitas-umum", label: "Fasilitas Umum", icon: Building2,    colors: ["#FF6B35", "#E8541C"] },
    { slug: "kebersihan",     label: "Kebersihan",     icon: Trash2,       colors: ["#E8541C", "#C0392B"] },
    { slug: "lalu-lintas",    label: "Lalu Lintas",    icon: Car,          colors: ["#FF8C42", "#E8541C"] },
];

export default function CategorySection() {
    const router = useRouter();

    return (
        <View style={styles.section}>
            {/* Header */}
            <View style={styles.headerWrap}>
                <View style={styles.labelRow}>
                    <View style={styles.labelLine} />
                    <Text style={styles.labelText}>Kategori</Text>
                </View>
                <Text style={styles.title}>Jelajahi kategori</Text>
                <Text style={styles.sub}>Pilih kategori untuk lihat laporan sejenis</Text>
            </View>

            {/* Grid 2x2 */}
            <View style={styles.grid}>
                {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    return (
                        <TouchableOpacity
                            key={cat.slug}
                            style={styles.card}
                            activeOpacity={0.8}
                            onPress={() => router.push(`/(tabs)/explore?kategori=${cat.slug}` as any)}
                        >
                            <View style={[styles.iconWrap, { backgroundColor: cat.colors[0] }]}>
                                <Icon size={22} color="#fff" strokeWidth={1.8} />
                            </View>
                            <Text style={styles.cardLabel}>{cat.label}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },

    headerWrap: { marginBottom: 14 },
    labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
    labelLine: { width: 20, height: 1.5, backgroundColor: "#FF6B35", borderRadius: 1 },
    labelText: { fontSize: 10, fontWeight: "700", color: "#E8541C", letterSpacing: 1.2, textTransform: "uppercase" },
    title: { fontSize: 17, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.3, marginBottom: 2 },
    sub: { fontSize: 12, color: "#a8856b" },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
    },
    card: {
        width: "47.5%",
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: "#f0e6dc",
        paddingVertical: 22,
        paddingHorizontal: 16,
        alignItems: "center",
        gap: 12,
    },
    iconWrap: {
        width: 48, height: 48,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#E8541C",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    cardLabel: {
        fontSize: 13,
        fontWeight: "600",
        color: "#3d2817",
        textAlign: "center",
    },
});