import { View, Text, StyleSheet } from "react-native";
import type { Report } from "@/lib/report";
import { STATUS_CFG } from "@/constants/report-config";
import { MapPin, Calendar, User } from "lucide-react-native";

const PRIORITY_CFG: Record<string, { label: string; color: string; bg: string }> = {
    low: { label: "Rendah", color: "#0F6E56", bg: "#DCFCE7" },
    medium: { label: "Sedang", color: "#92400E", bg: "#FEF3C7" },
    high: { label: "Tinggi", color: "#991B1B", bg: "#FEE2E2" },
    urgent: { label: "Urgent", color: "#fff", bg: "#E8541C" },
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
        <View style={styles.card}>
            {/* Badges */}
            <View style={styles.badgeRow}>
                <View style={[styles.badge, { backgroundColor: s.bg }]}>
                    <View style={[styles.dot, { backgroundColor: s.dot }]} />
                    <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: p.bg }]}>
                    <Text style={[styles.badgeText, { color: p.color }]}>↑ {p.label}</Text>
                </View>
                {report.category_name && (
                    <View style={styles.catBadge}>
                        <Text style={styles.catText}>{report.category_name}</Text>
                    </View>
                )}
            </View>

            {/* Title */}
            <Text style={styles.title}>{report.title}</Text>

            {/* Meta */}
            <View style={styles.meta}>
                <View style={styles.metaItem}>
                    <User size={12} color="#a8856b" strokeWidth={1.8} />
                    <Text style={styles.metaText}>{report.user_name ?? "Anonim"}</Text>
                </View>
                <View style={styles.metaItem}>
                    <Calendar size={12} color="#a8856b" strokeWidth={1.8} />
                    <Text style={styles.metaText}>{fmtDate(report.created_at)}</Text>
                </View>
                {report.location && (
                    <View style={styles.metaItem}>
                        <MapPin size={12} color="#a8856b" strokeWidth={1.8} />
                        <Text style={styles.metaText} numberOfLines={1}>{report.location}</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: "#f0e6dc" },
    badgeRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 },
    badge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 },
    dot: { width: 5, height: 5, borderRadius: 99 },
    badgeText: { fontSize: 10, fontWeight: "700" },
    catBadge: { backgroundColor: "#F9FAFB", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 0.5, borderColor: "#F3F4F6" },
    catText: { fontSize: 10, color: "#6B7280" },
    title: { fontSize: 20, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.4, lineHeight: 26, marginBottom: 12 },
    meta: { gap: 6 },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 6 },
    metaText: { fontSize: 12, color: "#a8856b", flex: 1 },
});