import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { MapPin, ArrowBigUp, MessageCircle, ImageIcon } from "lucide-react-native";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { toggleUpvote, getUpvoteStatus, type Report } from "@/lib/report";
import { STATUS_CFG } from "@/constants/report-config";

const AVATAR_COLORS = [
    ["#FF6B35", "#E8541C"],
    ["#5DCAA5", "#0F6E56"],
    ["#AFA9EC", "#3C3489"],
    ["#F0997B", "#993C1D"],
    ["#85B7EB", "#0C447C"],
];

function avatarColor(name: string) {
    const hash = (name ?? "?").split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function getInisial(name: string) {
    return (name ?? "?").split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

function fmt(n: number) {
    return n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
}

function fmtDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} hari lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

interface Props {
    report: Report;
    variant?: "status" | "nearby";
    distance?: string;
    compact?: boolean;
}

export default function ReportCard({ report, variant = "status", distance, compact = false }: Props) {
    const router = useRouter();
    const user = useAuthStore((s) => s.user);
    const s = STATUS_CFG[report.status] ?? { label: report.status, color: "#374151", bg: "#F3F4F6", dot: "#9CA3AF" };
    const inisial = getInisial(report.user_name ?? "?");
    const [avatarFrom, avatarTo] = avatarColor(report.user_name ?? "?");

    const [upvoteCount, setUpvoteCount] = useState(report.upvote_count ?? 0);
    const [upvoted, setUpvoted] = useState(false);
    const [upvoting, setUpvoting] = useState(false);

    useEffect(() => {
        if (!user?.id) return;
        getUpvoteStatus(report.id).then((data) => {
            setUpvoted(data.upvoted);
            setUpvoteCount(data.upvote_count);
        }).catch(() => { });
    }, [report.id, user?.id]);

    const handleUpvote = async () => {
        if (!user) { router.push("/(auth)/login" as any); return; }
        if (upvoting) return;
        try {
            setUpvoting(true);
            const result = await toggleUpvote(report.id);
            setUpvoteCount(result.upvote_count);
            setUpvoted(result.upvoted);
        } catch (err) { console.error(err); }
        finally { setUpvoting(false); }
    };

    return (
        <TouchableOpacity
            style={[styles.card, compact && styles.cardCompact]}
            onPress={() => router.push(`/laporan/${report.id}` as any)}
            activeOpacity={0.85}
        >
            {/* Thumbnail */}
            <View style={[styles.thumb, compact && styles.thumbCompact]}>
                {report.image_url ? (
                    <Image source={{ uri: report.image_url }} style={styles.thumbImg} resizeMode="cover" />
                ) : (
                    <View style={styles.thumbPlaceholder}>
                        <ImageIcon size={compact ? 18 : 24} color="rgba(255,255,255,0.4)" strokeWidth={1.5} />
                    </View>
                )}
                {variant === "nearby" && distance ? (
                    <View style={styles.badgeWrap}>
                        <MapPin size={9} color="#E8541C" strokeWidth={2.5} />
                        <Text style={styles.badgeText}>{distance}</Text>
                    </View>
                ) : (
                    <View style={[styles.badgeWrap, { backgroundColor: s.bg }]}>
                        <View style={[styles.dot, { backgroundColor: s.dot }]} />
                        <Text style={[styles.badgeText, { color: s.color }]}>{s.label}</Text>
                    </View>
                )}
            </View>

            {/* Content */}
            <View style={[styles.content, compact && styles.contentCompact]}>
                {/* User + date */}
                <View style={styles.row}>
                    <View style={[styles.avatar, { backgroundColor: avatarFrom }]}>
                        <Text style={styles.avatarText}>{inisial}</Text>
                    </View>
                    {!compact && <Text style={styles.userName} numberOfLines={1}>{report.user_name ?? "Anonim"}</Text>}
                    <Text style={[styles.date, compact && { fontSize: 9 }]}>{fmtDate(report.created_at)}</Text>
                </View>

                {/* Title */}
                <Text style={[styles.title, compact && styles.titleCompact]} numberOfLines={2}>
                    {report.title}
                </Text>

                {/* Location */}
                <View style={styles.row}>
                    <MapPin size={9} color="#a8856b" strokeWidth={2} />
                    <Text style={[styles.location, compact && { fontSize: 10 }]} numberOfLines={1}>
                        {report.location ?? "Lokasi tidak diketahui"}
                    </Text>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.upvoteBtn} onPress={handleUpvote} disabled={upvoting}>
                        <ArrowBigUp
                            size={compact ? 12 : 15}
                            color={upvoted ? "#E8541C" : "#6b5546"}
                            fill={upvoted ? "#E8541C" : "none"}
                            strokeWidth={upvoted ? 2.5 : 1.8}
                        />
                        <Text style={[styles.footerText, upvoted && { color: "#E8541C" }]}>{fmt(upvoteCount)}</Text>
                    </TouchableOpacity>
                    <View style={styles.row}>
                        <MessageCircle size={compact ? 10 : 11} color="#a8856b" strokeWidth={1.8} />
                        <Text style={styles.footerText}>{fmt(report.comment_count ?? 0)}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff", borderRadius: 14, overflow: "hidden",
        borderWidth: 0.5, borderColor: "#f0e6dc",
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
        marginBottom: 12,
    },
    thumb: { width: "100%", height: 160, backgroundColor: "#e0dcd8" },
    thumbImg: { width: "100%", height: "100%" },
    thumbPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center" },
    badgeWrap: {
        position: "absolute", top: 9, left: 9,
        flexDirection: "row", alignItems: "center", gap: 4,
        backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 99,
        paddingHorizontal: 8, paddingVertical: 3,
    },
    badgeText: { fontSize: 10, fontWeight: "700", color: "#3d2817" },
    dot: { width: 5, height: 5, borderRadius: 99 },
    content: { padding: 12, gap: 6 },
    row: { flexDirection: "row", alignItems: "center", gap: 5 },
    avatar: {
        width: 22, height: 22, borderRadius: 99,
        alignItems: "center", justifyContent: "center",
    },
    avatarText: { fontSize: 8, fontWeight: "700", color: "#fff" },
    userName: { fontSize: 11, fontWeight: "600", color: "#3d2817", flex: 1 },
    date: { fontSize: 10, color: "#c9a892" },
    title: { fontSize: 13, fontWeight: "700", color: "#1a0e08", lineHeight: 18 },
    location: { fontSize: 11, color: "#a8856b", flex: 1 },
    footer: {
        flexDirection: "row", alignItems: "center", gap: 10,
        paddingTop: 8, borderTopWidth: 0.5, borderTopColor: "#f5ede3", marginTop: 4,
    },
    upvoteBtn: { flexDirection: "row", alignItems: "center", gap: 3 },
    footerText: { fontSize: 11, color: "#6b5546" },
    catBadge: { marginLeft: "auto", backgroundColor: "#FFF5EE", borderRadius: 99, paddingHorizontal: 7, paddingVertical: 2 },
    catText: { fontSize: 9, fontWeight: "700", color: "#E8541C" },

    cardCompact: { marginBottom: 0 },
    thumbCompact: { height: 110 },
    contentCompact: { padding: 8, gap: 4 },
    titleCompact: { fontSize: 11, lineHeight: 15 },
});

