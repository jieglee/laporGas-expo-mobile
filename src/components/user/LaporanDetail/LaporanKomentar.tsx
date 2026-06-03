import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { createComment, deleteComment, type Comment } from "@/lib/comments";
import type { Report } from "@/lib/report";
import { Send, Trash2 } from "lucide-react-native";

function fmtDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function Avatar({ name, size = 32 }: { name: string; size?: number }) {
    const txt = (name ?? "?").split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase();
    return (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size }]}>
            <Text style={[styles.avatarText, { fontSize: size * 0.3 }]}>{txt}</Text>
        </View>
    );
}

interface Props {
    report: Report;
    publicComments: Comment[];
    onCommentAdded: (c: Comment) => void;
    onCommentDeleted: (id: number) => void;
}

export default function LaporanKomentar({ report, publicComments, onCommentAdded, onCommentDeleted }: Props) {
    const user = useAuthStore((s) => s.user);
    const [text, setText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!text.trim()) return;
        try {
            setSubmitting(true);
            const comment = await createComment({ report_id: report.id, comment: text });
            onCommentAdded(comment);
            setText("");
        } catch (err) { console.error(err); }
        finally { setSubmitting(false); }
    };

    const handleDelete = (commentId: number) => {
        if (Platform.OS === "web") {
            if (window.confirm("Hapus komentar ini?")) {
                deleteComment(commentId).then(() => onCommentDeleted(commentId));
            }
            return;
        }
        Alert.alert("Hapus komentar", "Yakin ingin menghapus?", [
            { text: "Batal", style: "cancel" },
            { text: "Hapus", style: "destructive", onPress: () => {
                deleteComment(commentId).then(() => onCommentDeleted(commentId));
            }},
        ]);
    };

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.label}>DISKUSI</Text>
                <Text style={styles.title}>
                    Komentar Publik{" "}
                    <Text style={styles.count}>({publicComments.length})</Text>
                </Text>
            </View>

            {/* Input */}
            {user ? (
                <View style={styles.inputWrap}>
                    <Avatar name={user.name ?? "U"} size={36} />
                    <View style={styles.inputInner}>
                        <TextInput
                            style={styles.input}
                            placeholder="Tulis komentar..."
                            placeholderTextColor="#c9a892"
                            value={text}
                            onChangeText={setText}
                            multiline
                        />
                        <TouchableOpacity
                            style={[styles.sendBtn, (!text.trim() || submitting) && styles.sendDisabled]}
                            onPress={handleSubmit}
                            disabled={!text.trim() || submitting}
                        >
                            <Send size={14} color="#fff" strokeWidth={2} />
                        </TouchableOpacity>
                    </View>
                </View>
            ) : (
                <View style={styles.loginPrompt}>
                    <Text style={styles.loginText}>Login untuk berkomentar</Text>
                </View>
            )}

            {/* Divider */}
            <View style={styles.divider} />

            {/* List */}
            {publicComments.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>Belum ada komentar. Jadilah yang pertama!</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {publicComments.map((c, i) => (
                        <View key={c.id} style={[styles.commentItem, i > 0 && styles.commentBorder]}>
                            <Avatar name={c.name ?? "U"} size={34} />
                            <View style={styles.commentBody}>
                                <View style={styles.commentTop}>
                                    <Text style={styles.commentName}>{c.name ?? "Anonim"}</Text>
                                    <Text style={styles.commentDate}>{fmtDate(c.created_at)}</Text>
                                    {user?.id === String(c.user_id) && (
                                        <TouchableOpacity onPress={() => handleDelete(c.id)} style={styles.deleteBtn}>
                                            <Trash2 size={12} color="#FCA5A5" strokeWidth={1.8} />
                                        </TouchableOpacity>
                                    )}
                                </View>
                                <Text style={styles.commentText}>{c.comment}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 20, padding: 18, borderWidth: 0.5, borderColor: "#f0e6dc", gap: 14 },
    header: { gap: 2 },
    label: { fontSize: 9, fontWeight: "800", color: "#E8541C", letterSpacing: 2 },
    title: { fontSize: 16, fontWeight: "700", color: "#1a0e08" },
    count: { color: "#a8856b", fontWeight: "400" },

    inputWrap: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    inputInner: { flex: 1, flexDirection: "row", alignItems: "flex-end", gap: 8, backgroundColor: "#fafaf8", borderRadius: 14, borderWidth: 1, borderColor: "#f0e6dc", paddingHorizontal: 12, paddingVertical: 8 },
    input: { flex: 1, fontSize: 13, color: "#1a0e08", maxHeight: 80, lineHeight: 20 },
    sendBtn: { width: 32, height: 32, borderRadius: 10, backgroundColor: "#E8541C", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    sendDisabled: { opacity: 0.35 },

    loginPrompt: { backgroundColor: "#fafaf8", borderRadius: 12, padding: 14, alignItems: "center" },
    loginText: { fontSize: 13, color: "#a8856b" },

    divider: { height: 0.5, backgroundColor: "#f5ede3" },

    empty: { paddingVertical: 20, alignItems: "center" },
    emptyText: { fontSize: 13, color: "#c9a892" },

    list: { gap: 0 },
    commentItem: { flexDirection: "row", gap: 10, paddingVertical: 12 },
    commentBorder: { borderTopWidth: 0.5, borderTopColor: "#f5ede3" },
    commentBody: { flex: 1, gap: 5 },
    commentTop: { flexDirection: "row", alignItems: "center", gap: 6 },
    commentName: { fontSize: 12, fontWeight: "700", color: "#1a0e08" },
    commentDate: { fontSize: 10, color: "#c9a892", flex: 1 },
    deleteBtn: { padding: 2 },
    commentText: { fontSize: 13, color: "#374151", lineHeight: 20 },

    avatar: { backgroundColor: "#E8541C", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    avatarText: { fontWeight: "700", color: "#fff" },
});