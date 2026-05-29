import { useEffect, useMemo, useState } from "react";
import { StyleSheet, ActivityIndicator, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getReports, type Report } from "@/lib/report";
import ReportCard from "@/components/common-ui/ReportCard";
import ExploreHeader from "@/components/user/Explore/ExploreHeader";
import ExploreEmpty from "@/components/user/Explore/ExploreEmpty";
import { type Kategori, mapKategori } from "@/components/user/Explore/types";

export default function ExplorePage() {
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
                <ActivityIndicator color="#E8541C" style={{ marginTop: 48 }} />
            ) : filtered.length === 0 ? (
                <ExploreEmpty />
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
    list: { padding: 16 },
});