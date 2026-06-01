import { View, Text, StyleSheet } from "react-native";
import type { Report } from "@/lib/report";

export default function LaporanDeskripsi({ report }: { report: Report }) {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>KRONOLOGI</Text>
            <Text style={styles.desc}>{report.description}</Text>

            {report.status === "rejected" && report.reject_reason && (
                <View style={styles.rejectBox}>
                    <Text style={styles.rejectLabel}>✕ Alasan Penolakan</Text>
                    <Text style={styles.rejectText}>{report.reject_reason}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: "#f0e6dc" },
    label: { fontSize: 9, fontWeight: "800", color: "#E8541C", letterSpacing: 1.5, marginBottom: 10 },
    desc: { fontSize: 14, color: "#374151", lineHeight: 22 },
    rejectBox: { marginTop: 14, backgroundColor: "#FEF2F2", borderRadius: 12, padding: 14, borderWidth: 0.5, borderColor: "#FECACA" },
    rejectLabel: { fontSize: 9, fontWeight: "800", color: "#EF4444", letterSpacing: 1, marginBottom: 6 },
    rejectText: { fontSize: 13, color: "#991B1B", lineHeight: 20 },
});