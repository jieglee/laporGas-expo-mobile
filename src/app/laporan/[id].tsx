import { useEffect, useState } from "react";
import {
    View, Text, ScrollView, StyleSheet,
    ActivityIndicator, TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import { getReportById, type Report } from "@/lib/report";
import { getComments, type Comment } from "@/lib/comments";
import LaporanHeader from "@/components/user/LaporanDetail/LaporanHeader";
import LaporanFoto from "@/components/user/LaporanDetail/LaporanFoto";
import LaporanDeskripsi from "@/components/user/LaporanDetail/LaporanDeskripsi";
import LaporanLokasi from "@/components/user/LaporanDetail/LaporanLokasi";
import LaporanStats from "@/components/user/LaporanDetail/LaporanStats";
import LaporanTindakLanjut from "@/components/user/LaporanDetail/LaporanTindakLanjut";
import LaporanKomentar from "@/components/user/LaporanDetail/LaporanKomentar";

export default function LaporanDetailPage() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [report, setReport] = useState<Report | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const goBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace("/(tabs)" as any);
        }
    };

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const [reportData, commentsData] = await Promise.all([
                    getReportById(Number(id)),
                    getComments(Number(id)),
                ]);
                setReport(reportData);
                setComments(commentsData);
            } catch { setError("Laporan tidak ditemukan"); }
            finally { setLoading(false); }
        }
        fetchData();
    }, [id]);

    const handleCommentAdded = (comment: Comment) => {
        setComments((prev) => [...prev, comment]);
    };

    const handleCommentDeleted = (commentId: number) => {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    };

    if (loading) return (
        <View style={styles.center}>
            <ActivityIndicator color="#E8541C" />
            <Text style={styles.loadingText}>Memuat laporan...</Text>
        </View>
    );

    if (error || !report) return (
        <View style={styles.center}>
            <Text style={styles.errorText}>{error ?? "Terjadi kesalahan"}</Text>
            <TouchableOpacity onPress={goBack}>
                <Text style={styles.backLink}>Kembali</Text>
            </TouchableOpacity>
        </View>
    );

    const officialComments = comments.filter((c) => c.type === "official");
    const publicComments = comments.filter((c) => c.type === "public");

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={goBack} style={styles.backBtn}>
                    <ArrowLeft size={18} color="#3d2817" strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.topBarTitle} numberOfLines={1}>Detail Laporan</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
                <LaporanHeader report={report} />
                <LaporanFoto report={report} />
                <LaporanDeskripsi report={report} />
                <LaporanLokasi report={report} />
                <LaporanStats report={report} comments={comments} />
                {officialComments.length > 0 && (
                    <LaporanTindakLanjut
                        comments={officialComments}
                        onDelete={handleCommentDeleted}
                    />
                )}
                <LaporanKomentar
                    report={report}
                    publicComments={publicComments}
                    onCommentAdded={handleCommentAdded}
                    onCommentDeleted={handleCommentDeleted}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFCFA" },
    topBar: {
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        paddingHorizontal: 16, paddingVertical: 12,
        backgroundColor: "#fff", borderBottomWidth: 0.5, borderBottomColor: "#f0e6dc",
    },
    backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#fafaf8", alignItems: "center", justifyContent: "center", borderWidth: 0.5, borderColor: "#f0e6dc" },
    topBarTitle: { fontSize: 15, fontWeight: "700", color: "#1a0e08", flex: 1, textAlign: "center", marginHorizontal: 8 },
    scroll: { padding: 16, gap: 12, paddingBottom: 40 },
    center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: "#FFFCFA" },
    loadingText: { fontSize: 13, color: "#a8856b" },
    errorText: { fontSize: 14, color: "#C0392B" },
    backLink: { fontSize: 13, color: "#E8541C", textDecorationLine: "underline" },
});