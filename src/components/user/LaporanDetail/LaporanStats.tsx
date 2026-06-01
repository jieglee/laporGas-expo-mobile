import { View, Text, StyleSheet } from "react-native";
import { ArrowBigUp, MessageCircle } from "lucide-react-native";
import type { Report } from "@/lib/report";
import type { Comment } from "@/lib/comments";

export default function LaporanStats({ report, comments }: { report: Report; comments: Comment[] }) {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>STATISTIK</Text>
            <View style={styles.row}>
                <View style={styles.item}>
                    <ArrowBigUp size={18} color="#E8541C" strokeWidth={1.8} />
                    <Text style={styles.val}>{report.upvote_count ?? 0}</Text>
                    <Text style={styles.key}>Dukungan</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.item}>
                    <MessageCircle size={18} color="#E8541C" strokeWidth={1.8} />
                    <Text style={styles.val}>{comments.length}</Text>
                    <Text style={styles.key}>Komentar</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: "#f0e6dc" },
    label: { fontSize: 9, fontWeight: "800", color: "#E8541C", letterSpacing: 1.5, marginBottom: 14 },
    row: { flexDirection: "row", alignItems: "center" },
    item: { flex: 1, alignItems: "center", gap: 4 },
    divider: { width: 0.5, height: 40, backgroundColor: "#f0e6dc" },
    val: { fontSize: 22, fontWeight: "800", color: "#1a0e08" },
    key: { fontSize: 11, color: "#a8856b" },
});