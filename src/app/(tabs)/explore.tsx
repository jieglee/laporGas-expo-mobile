import { useEffect, useMemo, useState } from "react";
import {
    View, Text, ScrollView, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X, Map, Building2, Landmark, Trash2, TrafficCone } from "lucide-react-native";
import { getReports, type Report } from "@/lib/report";
import ReportCard from "@/components/common-ui/ReportCard";

const ORANGE = "#E8541C";

type Kategori = "all" | "infrastruktur" | "fasilitas-umum" | "kebersihan" | "lalu-lintas";

const KATEGORI_TABS: { value: Kategori; label: string; icon: any }[] = [
    { value: "all", label: "Semua", icon: Map },
    { value: "infrastruktur", label: "Infrastruktur", icon: Building2 },
    { value: "fasilitas-umum", label: "Fasilitas Umum", icon: Landmark },
    { value: "kebersihan", label: "Kebersihan", icon: Trash2 },
    { value: "lalu-lintas", label: "Lalu Lintas", icon: TrafficCone },
];

function mapKategori(name: string | null): Exclude<Kategori, "all"> {
    switch (name?.toLowerCase()) {
        case "infrastruktur": return "infrastruktur";
        case "fasilitas umum": return "fasilitas-umum";
        case "kebersihan": return "kebersihan";
        case "lalu lintas": return "lalu-lintas";
        default: return "infrastruktur";
    }
}

export default function ExplorePage() {
    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState<Kategori>("all");
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetch() {
            try {
                const data = await getReports({ sort: "newest" });
                setReports(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        fetch();
    }, []);

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
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Explore</Text>
                <Text style={styles.subtitle}>
                    <Text style={{ color: ORANGE, fontWeight: "700" }}>{filtered.length}</Text>
                    {" "}laporan dari komunitas
                </Text>

                {/* Search */}
                <View style={styles.searchWrap}>
                    <Search size={15} color="#a8856b" strokeWidth={2} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari laporan, lokasi, pelapor..."
                        placeholderTextColor="#c9a892"
                        value={search}
                        onChangeText={setSearch}
                        autoCorrect={false}
                    />
                    {search.length > 0 && (
                        <TouchableOpacity onPress={() => setSearch("")} style={styles.searchClear}>
                            <X size={12} color="#a8856b" />
                        </TouchableOpacity>
                    )}
                </View>


                {/* Kategori tabs */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
                    {KATEGORI_TABS.map((tab) => {
                        const active = kategori === tab.value;
                        const Icon = tab.icon;
                        return (
                            <TouchableOpacity
                                key={tab.value}
                                style={[styles.tab, active && styles.tabActive]}
                                onPress={() => setKategori(tab.value)}
                                activeOpacity={0.8}
                            >
                                <Icon size={13} color={active ? "#fff" : "#6b5546"} strokeWidth={2} />
                                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                                    {tab.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* Content */}
            {loading ? (
                <ActivityIndicator color={ORANGE} style={{ marginTop: 48 }} />
            ) : filtered.length === 0 ? (
                <View style={styles.empty}>
                    <View style={styles.emptyIcon}>
                        <Search size={22} color={ORANGE} strokeWidth={1.8} />
                    </View>
                    <Text style={styles.emptyTitle}>Tidak ada laporan ditemukan</Text>
                    <Text style={styles.emptySub}>Coba ubah kata kunci atau kategori</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={(item) => String(item.id)}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => <ReportCard report={item} variant="status" />}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFCFA" },

    header: {
        backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
        borderBottomWidth: 0.5, borderBottomColor: "#f0e6dc",
    },
    title: { fontSize: 26, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.5 },
    subtitle: { fontSize: 13, color: "#a8856b", marginTop: 2, marginBottom: 14 },

    searchWrap: {
        flexDirection: "row", alignItems: "center", gap: 10,
        backgroundColor: "#fafaf8", borderWidth: 0.5, borderColor: "#f0e6dc",
        borderRadius: 12, paddingHorizontal: 14, height: 44, marginBottom: 12,
    },
    searchInput: { flex: 1, fontSize: 14, color: "#1a0e08" },
    searchClear: {
        width: 22, height: 22, borderRadius: 99,
        backgroundColor: "#f0e6dc", alignItems: "center", justifyContent: "center",
    },

    tabs: { flexDirection: "row" },
    tab: {
        flexDirection: "row", alignItems: "center", gap: 5,
        paddingHorizontal: 14, paddingVertical: 7,
        borderRadius: 99, borderWidth: 1.5, borderColor: "#f0e6dc",
        backgroundColor: "#fff", marginRight: 8,
    },
    tabActive: {
        backgroundColor: ORANGE, borderColor: ORANGE,
        shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28, shadowRadius: 8, elevation: 4,
    },
    tabText: { fontSize: 12, fontWeight: "600", color: "#6b5546" },
    tabTextActive: { color: "#fff", fontWeight: "700" },

    list: { padding: 16 },

    empty: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
    emptyIcon: {
        width: 52, height: 52, borderRadius: 99,
        backgroundColor: "rgba(255,107,53,0.08)",
        alignItems: "center", justifyContent: "center", marginBottom: 14,
    },
    emptyTitle: { fontSize: 15, fontWeight: "700", color: "#1a0e08", marginBottom: 6 },
    emptySub: { fontSize: 13, color: "#a8856b", textAlign: "center" },
});
