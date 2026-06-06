import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { getReports, type Report } from "@/lib/report";
import ExploreHeader from "@/components/user/Explore/ExploreHeader";
import ExploreMap from "@/components/user/Explore/ExploreMap";
import ExploreEmpty from "@/components/user/Explore/ExploreEmpty";
import { type Kategori, mapKategori } from "@/components/user/Explore/types";

export default function ExplorePage() {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [kategori, setKategori] = useState<Kategori>("all");
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getReports({ sort: "newest" });
                setReports(data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        }
        fetchData();
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
            <ExploreHeader
                search={search}
                onSearch={setSearch}
                kategori={kategori}
                onKategori={setKategori}
                totalCount={filtered.length}
            />

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color="#E8541C" />
                    <Text style={styles.loadingText}>Memuat laporan...</Text>
                </View>
            ) : filtered.length === 0 ? (
                <ExploreEmpty />
            ) : (
                <ExploreMap
                    reports={filtered}
                    onPressReport={(id) => router.push(`/laporan/${id}` as any)}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFCFA" },
    center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
    loadingText: { fontSize: 13, color: "#a8856b" },
});