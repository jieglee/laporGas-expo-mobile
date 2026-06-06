import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, Platform, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth.store";
import { getReports, type Report } from "@/lib/report";
import { FileText } from "lucide-react-native";
import ProfileHeader from "@/components/user/Profile/ProfileHeader";
import EditProfileModal from "@/components/user/Profile/EditProfileModal";
import ReportGrid from "@/components/common-ui/ReportGrid";
import { useRouter } from "expo-router";

export default function ProfilPage() {
    const { user, logout, token, loadFromStorage } = useAuthStore();
    const [editOpen, setEditOpen] = useState(false);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);
    const router = useRouter();

    const nama = user?.name ?? "Pengguna";
    const email = user?.email ?? "-";
    const inisial = nama.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
    const joinedAt = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });

    useEffect(() => {
        loadFromStorage().finally(() => setAuthLoading(false));
    }, []);

    useEffect(() => {
        if (!authLoading && !token) {
            router.replace("/(auth)/login" as any);
        }
    }, [token, authLoading]);

    useFocusEffect(
        useCallback(() => {
            async function fetchReports() {
                if (!user?.id) return;
                setLoading(true);
                try {
                    const data = await getReports();
                    setReports(data.filter((r) => Number(r.user_id) === Number(user.id)));
                } catch { setReports([]); }
                finally { setLoading(false); }
            }
            fetchReports();
        }, [user?.id])
    );

    const handleLogout = () => {
        if (Platform.OS === "web") {
            const ok = window.confirm("Yakin ingin keluar?");
            if (ok) logout();
            return;
        }
        Alert.alert("Keluar", "Yakin ingin keluar?", [
            { text: "Batal", style: "cancel" },
            {
                text: "Keluar",
                style: "destructive",
                onPress: async () => {
                    await logout();
                },
            },
        ]);
    };

    if (authLoading) return (
        <View style={{ flex: 1, backgroundColor: "#FFFCFA", alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator color="#E8541C" />
        </View>
    );

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ProfileHeader
                    nama={nama}
                    email={email}
                    joinedAt={joinedAt}
                    inisial={inisial}
                    onEdit={() => setEditOpen(true)}
                    onLogout={handleLogout}
                />

                <View style={styles.body}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionIcon}>
                            <FileText size={15} color="#E8541C" strokeWidth={2} />
                        </View>
                        <View>
                            <Text style={styles.sectionTitle}>Laporan Saya</Text>
                            <Text style={styles.sectionSub}>
                                {loading ? "Memuat..." : `${reports.length} laporan dibuat`}
                            </Text>
                        </View>
                    </View>

                    {loading ? (
                        <View style={styles.loadingWrap}>
                            <ActivityIndicator color="#E8541C" />
                            <Text style={styles.loadingText}>Memuat laporan...</Text>
                        </View>
                    ) : reports.length === 0 ? (
                        <View style={styles.emptyWrap}>
                            <View style={styles.emptyIcon}>
                                <FileText size={24} color="#E8541C" strokeWidth={1.8} />
                            </View>
                            <Text style={styles.emptyTitle}>Belum ada laporan</Text>
                            <Text style={styles.emptySub}>Kamu belum pernah membuat laporan</Text>
                        </View>
                    ) : (
                        <ReportGrid reports={reports} />
                    )}
                </View>
            </ScrollView>

            <EditProfileModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                initial={{ nama, email, inisial }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFCFA" },
    body: { padding: 16 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 16 },
    sectionIcon: { width: 32, height: 32, borderRadius: 9, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center" },
    sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.3 },
    sectionSub: { fontSize: 11, color: "#a8856b", marginTop: 1 },
    loadingWrap: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 0.5, borderColor: "#f0e6dc", padding: 48, alignItems: "center", gap: 10 },
    loadingText: { fontSize: 13, color: "#a8856b" },
    emptyWrap: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 0.5, borderColor: "#f0e6dc", padding: 48, alignItems: "center" },
    emptyIcon: { width: 56, height: 56, borderRadius: 99, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
    emptyTitle: { fontSize: 14, fontWeight: "600", color: "#1a0e08", marginBottom: 4 },
    emptySub: { fontSize: 12, color: "#a8856b" },
});