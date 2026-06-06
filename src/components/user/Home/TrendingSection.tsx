import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { ArrowRight, Flame, MapPin, MessageCircle } from "lucide-react-native";
import type { Report } from "@/lib/report";

interface Props { reports: Report[]; }

const ORANGE = "#E8541C";

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
    pending:     { label: "Menunggu",  color: "#D97706", bg: "#FEF3C7" },
    approved:    { label: "Disetujui", color: "#2563EB", bg: "#DBEAFE" },
    on_progress: { label: "Diproses",  color: ORANGE,    bg: "#FFF5EE" },
    completed:   { label: "Selesai",   color: "#059669", bg: "#D1FAE5" },
    rejected:    { label: "Ditolak",   color: "#DC2626", bg: "#FEE2E2" },
};

export default function TrendingSection({ reports }: Props) {
    const router = useRouter();

    return (
        <View style={styles.section}>
            {/* Header */}
            <View style={styles.headerWrap}>
                <View style={styles.left}>
                    <View style={styles.labelRow}>
                        <View style={styles.labelLine} />
                        <Text style={styles.labelText}>Populer</Text>
                    </View>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>Trending minggu ini</Text>
                        <Flame size={16} color={ORANGE} />
                    </View>
                    <Text style={styles.sub}>Paling banyak dikomentari warga</Text>
                </View>
                <TouchableOpacity
                    style={styles.seeAll}
                    activeOpacity={0.7}
                    onPress={() => router.push("/(tabs)/explore" as any)}
                >
                    <Text style={styles.seeAllText}>Lihat semua</Text>
                    <ArrowRight size={13} color={ORANGE} strokeWidth={2} />
                </TouchableOpacity>
            </View>

            {/* List */}
            <View style={styles.card}>
                {reports.map((report, idx) => {
                    const s = STATUS_CFG[report.status] ?? { label: report.status, color: "#a8856b", bg: "#fafaf8" };
                    const isFirst = idx === 0;
                    const isLast = idx === reports.length - 1;

                    return (
                        <TouchableOpacity
                            key={report.id}
                            style={[styles.item, !isLast && styles.itemBorder]}
                            activeOpacity={0.8}
                            onPress={() => router.push(`/laporan/${report.id}` as any)}
                        >
                            {/* Rank */}
                            <View style={[styles.rank, isFirst && styles.rankFirst]}>
                                <Text style={[styles.rankText, isFirst && styles.rankTextFirst]}>
                                    {idx + 1}
                                </Text>
                            </View>

                            {/* Content */}
                            <View style={styles.content}>
                                <View style={styles.metaRow}>
                                    <Text style={styles.cat}>{report.category_name ?? "Umum"}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: s.bg }]}>
                                        <Text style={[styles.statusText, { color: s.color }]}>{s.label}</Text>
                                    </View>
                                </View>
                                <Text style={styles.itemTitle} numberOfLines={1}>{report.title}</Text>
                                {report.location && (
                                    <View style={styles.locRow}>
                                        <MapPin size={10} color="#a8856b" strokeWidth={1.8} />
                                        <Text style={styles.locText} numberOfLines={1}>{report.location}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Comment count */}
                            <View style={styles.commentBadge}>
                                <MessageCircle size={12} color={ORANGE} strokeWidth={1.8} />
                                <Text style={styles.commentText}>{report.comment_count ?? 0}</Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    section: { marginBottom: 24 },

    headerWrap: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 },
    left: { flex: 1 },
    labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
    labelLine: { width: 20, height: 1.5, backgroundColor: "#FF6B35", borderRadius: 1 },
    labelText: { fontSize: 10, fontWeight: "700", color: ORANGE, letterSpacing: 1.2, textTransform: "uppercase" },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
    title: { fontSize: 17, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.3 },
    sub: { fontSize: 12, color: "#a8856b" },
    seeAll: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
    seeAllText: { fontSize: 12, fontWeight: "600", color: ORANGE },

    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: "#f0e6dc",
        overflow: "hidden",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    itemBorder: { borderBottomWidth: 0.5, borderBottomColor: "#f5ede3" },

    rank: {
        width: 32, height: 32,
        borderRadius: 10,
        backgroundColor: "#FFF5EE",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    rankFirst: {
        backgroundColor: ORANGE,
        shadowColor: ORANGE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    rankText: { fontSize: 13, fontWeight: "800", color: ORANGE },
    rankTextFirst: { color: "#fff" },

    content: { flex: 1, minWidth: 0 },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 },
    cat: { fontSize: 10, fontWeight: "700", color: ORANGE, textTransform: "uppercase", letterSpacing: 0.5 },
    statusBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
    statusText: { fontSize: 10, fontWeight: "600" },
    itemTitle: { fontSize: 13, fontWeight: "600", color: "#1a0e08", marginBottom: 3 },
    locRow: { flexDirection: "row", alignItems: "center", gap: 3 },
    locText: { fontSize: 11, color: "#a8856b", flex: 1 },

    commentBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: "#FFF5EE",
        borderWidth: 0.5,
        borderColor: "rgba(232,84,28,0.12)",
        borderRadius: 99,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexShrink: 0,
    },
    commentText: { fontSize: 11, fontWeight: "600", color: ORANGE },
});