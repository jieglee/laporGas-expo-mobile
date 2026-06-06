import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell } from "lucide-react-native";
import { useAuthStore } from "@/store/auth.store";
import { getReports } from "@/lib/report";
import { getComments } from "@/lib/comments";
import NotifGroup from "@/components/user/Notifikasi/NotifGroup";
import { type Notif, type NotifGrup } from "@/components/user/Notifikasi/NotifItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNotifStore } from "@/store/notif.store";

const ORANGE = "#E8541C";
const GROUPS: NotifGrup[] = ["laporan", "sosial", "sistem"];

const STATUS_NOTIF: Record<string, { judul: string; deskripsi: (title: string) => string }> = {
    approved: {
        judul: "Laporan Disetujui ✅",
        deskripsi: (t) => `Laporan "${t}" telah disetujui oleh admin.`,
    },
    on_progress: {
        judul: "Laporan Sedang Diproses 🔄",
        deskripsi: (t) => `Laporan "${t}" sedang dalam proses penanganan.`,
    },
    completed: {
        judul: "Laporan Selesai 🎉",
        deskripsi: (t) => `Laporan "${t}" telah selesai ditangani. Terima kasih!`,
    },
    rejected: {
        judul: "Laporan Ditolak ❌",
        deskripsi: (t) => `Laporan "${t}" tidak dapat diproses.`,
    },
};

function fmtWaktu(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function getReadKey(userId: string) { return `notif_read_${userId}`; }

async function getReadIds(userId: string): Promise<Set<string>> {
    try {
        const raw = await AsyncStorage.getItem(getReadKey(userId));
        return new Set(raw ? JSON.parse(raw) : []);
    } catch { return new Set(); }
}

async function saveReadIds(userId: string, ids: Set<string>) {
    try {
        await AsyncStorage.setItem(getReadKey(userId), JSON.stringify([...ids]));
    } catch { }
}

async function generateNotifs(userId: string, readIds: Set<string>): Promise<Notif[]> {
    const allReports = await getReports();
    const myReports = allReports.filter((r) => String(r.user_id) === userId);
    const notifs: Notif[] = [];

    for (const report of myReports) {
        const statusCfg = STATUS_NOTIF[report.status];
        if (statusCfg) {
            const id = `status_${report.id}_${report.status}`;
            notifs.push({
                id,
                judul: statusCfg.judul,
                deskripsi: statusCfg.deskripsi(report.title),
                waktu: fmtWaktu(report.updated_at),
                dibaca: readIds.has(id),
                grup: "laporan",
                reportId: report.id,
            });
        }

        try {
            const comments = await getComments(report.id);
            const others = comments.filter((c) => String(c.user_id) !== userId);
            if (others.length > 0) {
                const latest = others[others.length - 1];
                const id = `comment_${report.id}_${latest.id}`;
                notifs.push({
                    id,
                    judul: "Komentar Baru 💬",
                    deskripsi: `${latest.name ?? "Seseorang"} berkomentar di "${report.title}": "${latest.comment.slice(0, 60)}${latest.comment.length > 60 ? "..." : ""}"`,
                    waktu: fmtWaktu(latest.created_at),
                    dibaca: readIds.has(id),
                    grup: "sosial",
                    reportId: report.id,
                });
            }
        } catch { }
    }

    const sistemId = "sistem_welcome";
    notifs.push({
        id: sistemId,
        judul: "Selamat datang di LaporGas 👋",
        deskripsi: "Buat laporan pengaduan dan pantau statusnya secara real-time.",
        waktu: "Hari ini",
        dibaca: readIds.has(sistemId),
        grup: "sistem",
    });

    return notifs.sort((a, b) => (a.dibaca !== b.dibaca ? (a.dibaca ? 1 : -1) : 0));
}

export default function NotifikasiPage() {
    const user = useAuthStore((s) => s.user);
    const { setUnreadCount } = useNotifStore(); // ← di dalam komponen
    const [notifs, setNotifs] = useState<Notif[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = user?.id ?? "";

    useFocusEffect(
        useCallback(() => {
            if (!userId) return;
            async function load() {
                try {
                    setLoading(true);
                    const readIds = await getReadIds(userId);
                    const result = await generateNotifs(userId, readIds);
                    setNotifs(result);

                    // Auto mark all read saat halaman dibuka
                    const unread = result.filter((n) => !n.dibaca);
                    if (unread.length > 0) {
                        const newReadIds = new Set(readIds);
                        unread.forEach((n) => newReadIds.add(n.id));
                        await saveReadIds(userId, newReadIds);
                        setNotifs(result.map((n) => ({ ...n, dibaca: true })));
                    }

                    setUnreadCount(0);
                } finally {
                    setLoading(false);
                }
            }
            load();
        }, [userId])
    );

    const unreadTotal = notifs.filter((n) => !n.dibaca).length;

    const handleRead = async (id: string) => {
        const readIds = await getReadIds(userId);
        readIds.add(id);
        await saveReadIds(userId, readIds);
        setNotifs((prev) => prev.map((n) => n.id === id ? { ...n, dibaca: true } : n));
        setUnreadCount(notifs.filter((n) => !n.dibaca && n.id !== id).length);
    };

    const handleMarkAllRead = async () => {
        const readIds = await getReadIds(userId);
        notifs.forEach((n) => readIds.add(n.id));
        await saveReadIds(userId, readIds);
        setNotifs((prev) => prev.map((n) => ({ ...n, dibaca: true })));
        setUnreadCount(0);
    };

    const byGrup = (grup: NotifGrup) => notifs.filter((n) => n.grup === grup);

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <View>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>Notifikasi</Text>
                        {unreadTotal > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{unreadTotal} baru</Text>
                            </View>
                        )}
                    </View>
                    <Text style={styles.subtitle}>Update terbaru seputar laporan & aktivitasmu</Text>
                </View>
                {unreadTotal > 0 && (
                    <TouchableOpacity onPress={handleMarkAllRead}>
                        <Text style={styles.markAll}>Tandai semua dibaca</Text>
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator color={ORANGE} />
                    <Text style={styles.loadingText}>Memuat notifikasi...</Text>
                </View>
            ) : notifs.length === 0 ? (
                <View style={styles.center}>
                    <View style={styles.emptyIcon}>
                        <Bell size={22} color={ORANGE} strokeWidth={1.8} />
                    </View>
                    <Text style={styles.emptyTitle}>Tidak ada notifikasi</Text>
                    <Text style={styles.emptySub}>Kamu sudah up to date!</Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                    {GROUPS.map((grup) => {
                        const items = byGrup(grup);
                        if (items.length === 0) return null;
                        return (
                            <NotifGroup
                                key={grup}
                                grup={grup}
                                notifs={items}
                                onRead={handleRead}
                            />
                        );
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFCFA" },
    header: {
        flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between",
        paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12,
        backgroundColor: "#fff", borderBottomWidth: 0.5, borderBottomColor: "#f0e6dc",
    },
    titleRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
    title: { fontSize: 22, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.4 },
    badge: { backgroundColor: ORANGE, borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
    badgeText: { fontSize: 10, fontWeight: "700", color: "#fff" },
    subtitle: { fontSize: 12, color: "#a8856b" },
    markAll: { fontSize: 12, fontWeight: "600", color: ORANGE, marginTop: 4 },
    list: { padding: 16, paddingBottom: 32 },
    center: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
    loadingText: { fontSize: 13, color: "#a8856b" },
    emptyIcon: { width: 52, height: 52, borderRadius: 99, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center", marginBottom: 4 },
    emptyTitle: { fontSize: 15, fontWeight: "700", color: "#1a0e08" },
    emptySub: { fontSize: 13, color: "#a8856b" },
});