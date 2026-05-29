import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Tag } from "lucide-react-native";
import { CATEGORIES } from "./types";

const ORANGE = "#E8541C";

interface Props { value: string; onChange: (v: string) => void; }

export default function CategoryField({ value, onChange }: Props) {
    return (
        <View style={styles.field}>
            <View style={styles.label}>
                <View style={styles.icon}><Tag size={12} color={ORANGE} strokeWidth={2} /></View>
                <Text style={styles.labelText}>Kategori <Text style={{ color: ORANGE }}>*</Text></Text>
            </View>
            <View style={styles.grid}>
                {CATEGORIES.map((cat) => {
                    const active = value === cat.id;
                    return (
                        <TouchableOpacity
                            key={cat.id}
                            style={[styles.card, active && { backgroundColor: cat.bg, borderColor: cat.dot }]}
                            onPress={() => onChange(cat.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.cardTop}>
                                <View style={[styles.dot, { backgroundColor: active ? cat.dot : "#D1D5DB" }]} />
                                {active && (
                                    <View style={[styles.check, { backgroundColor: cat.dot }]}>
                                        <Text style={{ color: "#fff", fontSize: 8, fontWeight: "800" }}>✓</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={[styles.cardLabel, active && { color: cat.dot }]}>{cat.label}</Text>
                            <Text style={[styles.cardDesc, active && { color: cat.dot, opacity: 0.7 }]}>{cat.desc}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    field: { marginBottom: 20 },
    label: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 8 },
    icon: { width: 22, height: 22, borderRadius: 6, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center" },
    labelText: { fontSize: 12, fontWeight: "700", color: "#3d2817" },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    card: { width: "47.5%", backgroundColor: "#fff", borderWidth: 1.5, borderColor: "#f0e6dc", borderRadius: 12, padding: 14, gap: 5 },
    cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    dot: { width: 8, height: 8, borderRadius: 99 },
    check: { width: 18, height: 18, borderRadius: 99, alignItems: "center", justifyContent: "center" },
    cardLabel: { fontSize: 13, fontWeight: "700", color: "#1a0e08" },
    cardDesc: { fontSize: 11, color: "#a8856b", lineHeight: 15 },
});
