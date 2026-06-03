import { View, Text, StyleSheet } from "react-native";
import type { Report } from "@/lib/report";
import { STATUS_CFG } from "@/constants/report-config";
import { MapPin, Clock, User } from "lucide-react-native";

const PRIORITY_CFG: Record<string, { label: string; color: string; bg: string }> = {
    low:    { label: "Rendah", color: "#065F46", bg: "#D1FAE5" },
    medium: { label: "Sedang", color: "#92400E", bg: "#FEF3C7" },
    high:   { label: "Tinggi", color: "#991B1B", bg: "#FEE2E2" },
    urgent: { label: "Urgent", color: "#fff",    bg: "#E8541C" },
};

function fmtDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    });
}

export default function LaporanHeader({ report }: { report: Report }) {
    const s = STATUS_CFG[report.status] ?? { label: report.status, color: "#374151", bg: "#F3F4F6", dot: "#9CA3AF" };
    const p = PRIORITY_CFG[report.priority] ?? { label: report.priority, color: "#374151", bg: "#F3F4F6" };

    return (
        <View style={styles.root}>
            {/* Badge row */}
            <View style={styles.badgeRow}>
                <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                    <View style={[styles.statusDot, { backgroundColor: s.dot }]} />
                    <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
                </View>
                <View style={[styles.priorityBadge, { backgroundColor: p.bg }]}>
                    <Text style={[styles.priorityText, { color: p.color }]}>↑ {p.label}</Text>
                </View>
                {report.category_name && (
                    <View style={styles.catBadge}>
                        <Text style={styles.catText}>{report.category_name}</Text>
                    </View>
                )}
            </View>

            {/* Title */}
            <Text style={styles.title}>{report.title}</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Meta */}
            <View style={styles.metaList}>
                <View style={styles.metaItem}>
                    <View style={styles.metaIcon}>
                        <User size={11} color="#E8541C" strokeWidth={2} />
                    </View>
                    <Text style={styles.metaText}>{report.user_name ?? "Anonim"}</Text>
                </View>
                <View style={styles.metaItem}>
                    <View style={styles.metaIcon}>
                        <Clock size={11} color="#E8541C" strokeWidth={2} />
                    </View>
                    <Text style={styles.metaText}>{fmtDate(report.created_at)}</Text>
                </View>
                {report.location && (
                    <View style={styles.metaItem}>
                        <View style={styles.metaIcon}>
                            <MapPin size={11} color="#E8541C" strokeWidth={2} />
                        </View>
                        <Text style={styles.metaText} numberOfLines={2}>{report.location}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { backgroundColor: "#fff", borderRadius: 20, padding: 18, borderWidth: 0.5, borderColor: "#f0e6dc", gap: 14 },
    badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
    statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 },
    statusDot: { width: 5, height: 5, borderRadius: 99 },
    statusText: { fontSize: 11, fontWeight: "700" },
    priorityBadge: { borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 },
    priorityText: { fontSize: 11, fontWeight: "700" },
    catBadge: { backgroundColor: "#F9FAFB", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 0.5, borderColor: "#E5E7EB" },
    catText: { fontSize: 11, color: "#6B7280", fontWeight: "600" },
    title: { fontSize: 22, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.5, lineHeight: 30 },
    divider: { height: 0.5, backgroundColor: "#f5ede3" },
    metaList: { gap: 8 },
    metaItem: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
    metaIcon: { width: 22, height: 22, borderRadius: 6, backgroundColor: "#FFF5EE", alignItems: "center", justifyContent: "center", shrink: 0 } as any,
    metaText: { fontSize: 12, color: "#6b5546", flex: 1, lineHeight: 18, paddingTop: 2 },
});