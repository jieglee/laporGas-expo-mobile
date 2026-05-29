import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight, Flame, MessageCircle, MapPin } from "lucide-react-native";
import { useRouter } from "expo-router";
import type { Report } from "@/lib/report";
import { STATUS_CFG } from "@/constants/report-config";

const ORANGE = "#E8541C";

interface Props { reports: Report[]; }

export default function TrendingSection({ reports }: Props) {
    const router = useRouter();
    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                        <Text style={styles.title}>Trending minggu ini</Text>
                        <Flame size={16} color={ORANGE} />
                    </View>
                    <Text style={styles.sub}>Paling banyak dikomentari warga</Text>
                </View>
                <TouchableOpacity style={styles.seeAll} onPress={() => router.push("/(tabs)/explore" as any)}>
                    <Text style={styles.seeAllText}>Lihat semua</Text>
                    <ArrowRight size={13} color={ORANGE} strokeWidth={2} />
                </TouchableOpacity>
            </View>

            <View style={styles.card}>
                {reports.map((r, idx) => {
                    const s = STATUS_CFG[r.status] ?? { label: r.status, color: "#374151", bg: "#F3F4F6" };
                    return (
                        <TouchableOpacity
                            key={r.id}
                            style={[styles.item, idx < reports.length - 1 && styles.border]}
                            onPress={() => router.push(`/laporan/${r.id}` as any)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.rank}>
                                <Text style={styles.rankText}>{idx + 1}</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 }}>
                                    <Text style={styles.cat}>{r.category_name ?? "Umum"}</Text>
                                    <Text style={[styles.status, { color: s.color }]}>· {s.label}</Text>
                                </View>
                                <Text style={styles.itemTitle} numberOfLines={1}>{r.title}</Text>
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 }}>
                                    <MapPin size={10} color="#9CA3AF" />
                                    <Text style={styles.loc} numberOfLines={1}>{r.location ?? "Lokasi tidak diketahui"}</Text>
                                </View>
                            </View>
                            <View style={styles.count}>
                                <MessageCircle size={12} color="#6B7280" />
                                <Text style={styles.countText}>{r.comment_count ?? 0}</Text>
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
    header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 },
    title: { fontSize: 16, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.3 },
    sub: { fontSize: 12, color: "#a8856b", marginTop: 2 },
    seeAll: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
    seeAllText: { fontSize: 12, fontWeight: "600", color: ORANGE },
    card: { backgroundColor: "#fff", borderRadius: 16, borderWidth: 0.5, borderColor: "#f0e6dc", overflow: "hidden" },
    item: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
    border: { borderBottomWidth: 0.5, borderBottomColor: "#f5f5f5" },
    rank: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#FFF5EE", alignItems: "center", justifyContent: "center" },
    rankText: { fontSize: 13, fontWeight: "800", color: ORANGE },
    cat: { fontSize: 10, fontWeight: "600", color: ORANGE, textTransform: "uppercase" },
    status: { fontSize: 10, fontWeight: "600" },
    itemTitle: { fontSize: 13, fontWeight: "600", color: "#111827" },
    loc: { fontSize: 11, color: "#9CA3AF" },
    count: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#F3F4F6", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5 },
    countText: { fontSize: 11, fontWeight: "600", color: "#6B7280" },
});