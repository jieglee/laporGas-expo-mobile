import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Flag } from "lucide-react-native";
import { PRIORITIES } from "./types";

const ORANGE = "#E8541C";

interface Props { value: string; onChange: (v: string) => void; }

export default function PriorityField({ value, onChange }: Props) {
    return (
        <View style={styles.field}>
            <View style={styles.label}>
                <View style={styles.icon}><Flag size={12} color={ORANGE} strokeWidth={2} /></View>
                <Text style={styles.labelText}>Prioritas <Text style={{ color: ORANGE }}>*</Text></Text>
            </View>
            <View style={styles.grid}>
                {PRIORITIES.map((pr) => {
                    const active = value === pr.value;
                    return (
                        <TouchableOpacity
                            key={pr.value}
                            style={[styles.card, active && { backgroundColor: pr.bg, borderColor: pr.dot }]}
                            onPress={() => onChange(pr.value)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.dot, { backgroundColor: pr.dot }]} />
                            <Text style={[styles.label2, active && { color: pr.color, fontWeight: "700" }]}>{pr.label}</Text>
                            <Text style={styles.desc}>{pr.desc}</Text>
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
    grid: { flexDirection: "row", gap: 8 },
    card: { flex: 1, backgroundColor: "#fff", borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 10, padding: 10, alignItems: "center", gap: 4 },
    dot: { width: 8, height: 8, borderRadius: 99 },
    label2: { fontSize: 11, fontWeight: "600", color: "#3d2817" },
    desc: { fontSize: 9, color: "#a8856b", textAlign: "center", lineHeight: 13 },
});
