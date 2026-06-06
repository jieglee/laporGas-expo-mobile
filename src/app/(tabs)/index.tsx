import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth.store";
import { getReports, type Report } from "@/lib/report";
import HeroSection from "@/components/user/Home/HeroSection";
import CategorySection from "@/components/user/Home/CategorySection";
import NearbySection from "@/components/user/Home/NearbySection";
import TrendingSection from "@/components/user/Home/TrendingSection";
import { View } from "react-native";

export default function BerandaPage() {
    const user = useAuthStore((s) => s.user);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const firstName = user?.name?.split(" ")[0] ?? "Warga";

    const fetchReports = async () => {
        try {
            const data = await getReports({ sort: "newest" });
            setReports(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); setRefreshing(false); }
    };

    useEffect(() => { fetchReports(); }, []);

    const nearbyReports = useMemo(() => reports.slice(0, 3), [reports]);
    const trendingReports = useMemo(() =>
        [...reports].sort((a, b) => (b.comment_count ?? 0) - (a.comment_count ?? 0)).slice(0, 5),
        [reports]
    );

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => { setRefreshing(true); fetchReports(); }}
                        tintColor="#E8541C"
                    />
                }
            >
                <HeroSection firstName={firstName} />

                <View style={styles.body}>
                    <CategorySection />

                    {loading ? (
                        <ActivityIndicator color="#E8541C" style={{ marginVertical: 32 }} />
                    ) : (
                        <>
                            <NearbySection reports={nearbyReports} />
                            <TrendingSection reports={trendingReports} />
                        </>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFCFA" },
    body: { padding: 16 },
});