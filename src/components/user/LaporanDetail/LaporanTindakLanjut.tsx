import { View, Text, StyleSheet } from "react-native";
import { Building2 } from "lucide-react-native";
import type { Comment } from "@/lib/comments";

function fmtDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

interface Props {
    comments: Comment[];
    onDelete: (id: number) => void;
}

export default function LaporanTindakLanjut({ comments }: Props) {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.headerIcon}>
                    <Building2 size={15} color="#fff" strokeWidth={2} />
                </View>
                <View>
                    <Text style={styles.headerSub}>Tindak Lanjut</Text>
                    <Text style={styles.headerTitle}>Catatan resmi instansi</Text>
                </View>
            </View>

            <View style={styles.list}>
                {comments.map((c, i) => (
                    <View key={c.id} style={[styles.item, i > 0 && styles.itemBorder]}>
                        <View style={styles.line} />
                        <View style={styles.content}>
                            <View style={styles.row}>
                                <Text style={styles.name}>{c.name ?? "Admin"}</Text>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>INSTANSI</Text>
                                </View>
                                <Text style={styles.date}>{fmtDate(c.created_at)}</Text>
                            </View>
                            <Text style={styles.comment}>{c.comment}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#EFF6FF", borderRadius: 20, padding: 16, borderWidth: 0.5, borderColor: "#BFDBFE", gap: 14 },
    header: { flexDirection: "row", alignItems: "center", gap: 10 },
    headerIcon: { width: 36, height: 36, borderRadius: 11, backgroundColor: "#3B82F6", alignItems: "center", justifyContent: "center" },
    headerSub: { fontSize: 9, fontWeight: "800", color: "#93C5FD", letterSpacing: 1.5, marginBottom: 1 },
    headerTitle: { fontSize: 14, fontWeight: "700", color: "#1E40AF" },
    list: { gap: 12 },
    item: { flexDirection: "row", gap: 10 },
    itemBorder: { paddingTop: 12, borderTopWidth: 0.5, borderTopColor: "#BFDBFE" },
    line: { width: 3, borderRadius: 99, backgroundColor: "#3B82F6", alignSelf: "stretch", minHeight: 40 },
    content: { flex: 1, gap: 5 },
    row: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
    name: { fontSize: 12, fontWeight: "700", color: "#1E3A8A" },
    badge: { backgroundColor: "#DBEAFE", borderRadius: 99, paddingHorizontal: 6, paddingVertical: 2 },
    badgeText: { fontSize: 8, fontWeight: "800", color: "#1D4ED8" },
    date: { fontSize: 10, color: "#93C5FD" },
    comment: { fontSize: 13, color: "#1E40AF", lineHeight: 20 },
});