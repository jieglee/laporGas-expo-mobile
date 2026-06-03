import { View, Text, StyleSheet } from "react-native";
import { ArrowBigUp, MessageCircle } from "lucide-react-native";
import type { Report } from "@/lib/report";
import type { Comment } from "@/lib/comments";

export default function LaporanStats({ report, comments }: { report: Report; comments: Comment[] }) {
    return (
        <View style={styles.card}>
            <View style={styles.item}>
                <View style={styles.iconWrap}>
                    <ArrowBigUp size={20} color="#E8541C" strokeWidth={1.8} />
                </View>
                <Text style={styles.val}>{report.upvote_count ?? 0}</Text>
                <Text style={styles.key}>Dukungan</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.item}>
                <View style={styles.iconWrap}>
                    <MessageCircle size={20} color="#E8541C" strokeWidth={1.8} />
                </View>
                <Text style={styles.val}>{comments.length}</Text>
                <Text style={styles.key}>Komentar</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 20, borderWidth: 0.5, borderColor: "#f0e6dc", flexDirection: "row", overflow: "hidden" },
    item: { flex: 1, alignItems: "center", paddingVertical: 18, gap: 4 },
    iconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#FFF5EE", alignItems: "center", justifyContent: "center", marginBottom: 4 },
    divider: { width: 0.5, backgroundColor: "#f5ede3", marginVertical: 16 },
    val: { fontSize: 26, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.5 },
    key: { fontSize: 11, color: "#a8856b", fontWeight: "500" },
});