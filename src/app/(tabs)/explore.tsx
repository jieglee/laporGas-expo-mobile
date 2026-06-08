import { useEffect, useMemo, useState, useCallback } from "react";
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import { LayoutGrid, Map } from "lucide-react-native";
import { getReports, type Report } from "@/lib/report";
import ExploreHeader from "@/components/user/Explore/ExploreHeader";
import ExploreMap from "@/components/user/Explore/ExploreMap";
import ExploreEmpty from "@/components/user/Explore/ExploreEmpty";
import ReportCard from "@/components/common-ui/ReportCard";
import { type Kategori, mapKategori } from "@/components/user/Explore/types";

const ORANGE = "#E8541C";
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 16 * 2 - 10) / 2;

export default function ExplorePage() {
    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState<Kategori>("all");
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"map" | "grid">("map");

    useFocusEffect(
        useCallback(() => {
            async function fetchData() {
                try {
                    setLoading(true);
                    const data = await getReports({ sort: "newest" });
                    setReports(data);
                } catch (err) { console.error(err); }
                finally { setLoading(false); }
            }
            fetchData();
        }, [])
    );

    const filtered = useMemo(() => {
        let result = [...reports];
        if (kategori !== "all") {
            result = result.filter((r) => mapKategori(r.category_name) === kategori);
        }
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter((r) =>
                (r.title ?? "").toLowerCase().includes(q) ||
                (r.location ?? "").toLowerCase().includes(q) ||
                (r.user_name ?? "").toLowerCase().includes(q)
            );
        }
        return result;
    }, [search, kategori, reports]);

    return (
        <SafeAreaView style={styles.root}>
            <ExploreHeader
                search={search}
                onSearch={setSearch}
                kategori={kategori}
                onKategori={setKategori}
                totalCount={filtered.length}
            />

            {/* Toggle */}
            <View style={styles.toggleWrap}>
                <Text style={styles.countText}>{filtered.length} laporan</Text>
                <View style={styles.toggle}>
                    <TouchableOpacity
                        style={[styles.toggleBtn, viewMode === "map" && styles.toggleBtnActive]}
                        onPress={() => setViewMode("map")}
                        activeOpacity={0.8}
                    >
                        <Map size={13} color={viewMode === "map" ? ORANGE : "#a8856b"} strokeWidth={2} />
                        <Text style={[styles.toggleText, viewMode === "map" && styles.toggleTextActive]}>Peta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.toggleBtn, viewMode === "grid" && styles.toggleBtnActive]}
                        onPress={() => setViewMode("grid")}
                        activeOpacity={0.8}
                    >
                        <LayoutGrid size={13} color={viewMode === "grid" ? ORANGE : "#a8856b"} strokeWidth={2} />
                        <Text style={[styles.toggleText, viewMode === "grid" && styles.toggleTextActive]}>Grid</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={ORANGE} />
                    <Text style={styles.loadingText}>Memuat laporan...</Text>
                </View>
            ) : filtered.length === 0 ? (
                <ExploreEmpty />
            ) : viewMode === "map" ? (
                <View style={{ flex: 1 }}>
                    <ExploreMap reports={filtered} />
                </View>
            ) : (
                <ScrollView
                    contentContainerStyle={styles.grid}
                    showsVerticalScrollIndicator={false}
                >
                    {filtered.map((report) => (
                        <View key={report.id} style={{ width: CARD_WIDTH }}>
                            <ReportCard report={report} variant="status" compact />
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFCFA" },

    toggleWrap: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#f0e6dc",
        backgroundColor: "#fff",
    },
    countText: { fontSize: 12, color: "#a8856b" },
    toggle: {
        flexDirection: "row",
        backgroundColor: "#fafaf8",
        borderWidth: 0.5,
        borderColor: "#f0e6dc",
        borderRadius: 10,
        padding: 3,
        gap: 2,
    },
    toggleBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 8,
    },
    toggleBtnActive: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    toggleText: { fontSize: 12, fontWeight: "600", color: "#a8856b" },
    toggleTextActive: { color: ORANGE },

    center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
    loadingText: { fontSize: 13, color: "#a8856b" },

    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 16,
        gap: 10,
        paddingBottom: 32,
    },
});