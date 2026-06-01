import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { ArrowRight } from "lucide-react-native";
import { useRouter } from "expo-router";
import type { Report } from "@/lib/report";
import ReportGrid from "@/components/common-ui/ReportGrid";

const ORANGE = "#E8541C";

interface Props { reports: Report[]; }

export default function NearbySection({ reports }: Props) {
    const router = useRouter();
    return (
        <View style={styles.section}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>Di sekitar kamu</Text>
                    <Text style={styles.sub}>Laporan terbaru dari lokasi terdekat</Text>
                </View>
                <TouchableOpacity style={styles.seeAll} onPress={() => router.push("/(tabs)/explore" as any)}>
                    <Text style={styles.seeAllText}>Lihat semua</Text>
                    <ArrowRight size={13} color={ORANGE} strokeWidth={2} />
                </TouchableOpacity>
            </View>
            <ReportGrid reports={reports} variant="nearby" />
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
});