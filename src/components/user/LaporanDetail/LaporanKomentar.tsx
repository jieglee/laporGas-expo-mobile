
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { createComment, deleteComment, type Comment } from "@/lib/comments";
import type { Report } from "@/lib/report";
import { Trash2 } from "lucide-react-native";

function fmtDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function Avatar({ name }: { name: string }) {
    const txt = (name ?? "?").split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase();
    return (
        <View style={styles.avatar}>
            <Text style={styles.avatarText}>{txt}</Text>
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
            <Text style={styles.label}>DISKUSI</Text>
            <Text style={styles.title}>
                Komentar Publik <Text style={styles.count}>({publicComments.length})</Text>
            </Text>

            {/* Input */}
            {user ? (
                <View style={styles.inputRow}>
                    <Avatar name={user.name ?? "U"} />
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
                        <Text style={styles.sendText}>{submitting ? "..." : "Kirim"}</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.loginPrompt}>
                    <Text style={styles.loginText}>Login untuk berkomentar</Text>
                </View>
            )}

            {/* List */}
            {publicComments.length === 0 ? (
                <View style={styles.empty}>
                    <Text style={styles.emptyText}>Belum ada komentar. Jadilah yang pertama!</Text>
                </View>
            ) : (
                <View style={styles.list}>
                    {publicComments.map((c, i) => (
                        <View key={c.id} style={[styles.commentItem, i > 0 && styles.commentBorder]}>
                            <Avatar name={c.name ?? "U"} />
                            <View style={styles.commentContent}>
                                <View style={styles.commentRow}>
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
    card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, borderWidth: 0.5, borderColor: "#f0e6dc" },
    label: { fontSize: 9, fontWeight: "800", color: "#E8541C", letterSpacing: 1.5, marginBottom: 4 },
    title: { fontSize: 14, fontWeight: "700", color: "#111827", marginBottom: 14 },
    count: { color: "#9CA3AF", fontWeight: "400" },
    inputRow: { flexDirection: "row", alignItems: "flex-start", gap: 8, marginBottom: 16 },
    avatar: { width: 32, height: 32, borderRadius: 99, backgroundColor: "#E8541C", alignItems: "center", justifyContent: "center", marginTop: 2 },
    avatarText: { fontSize: 10, fontWeight: "700", color: "#fff" },
    input: { flex: 1, borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, fontSize: 13, color: "#1a0e08", backgroundColor: "#fafaf8", maxHeight: 80 },
    sendBtn: { backgroundColor: "#E8541C", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, alignSelf: "flex-end" },
    sendDisabled: { opacity: 0.4 },
    sendText: { color: "#fff", fontSize: 12, fontWeight: "700" },
    loginPrompt: { backgroundColor: "#fafaf8", borderRadius: 12, padding: 14, alignItems: "center", marginBottom: 16 },
    loginText: { fontSize: 13, color: "#a8856b" },
    empty: { paddingVertical: 24, alignItems: "center" },
    emptyText: { fontSize: 13, color: "#D1D5DB" },
    list: { gap: 0 },
    commentItem: { flexDirection: "row", gap: 10, paddingVertical: 12 },
    commentBorder: { borderTopWidth: 0.5, borderTopColor: "#f5f5f5" },
    commentContent: { flex: 1, gap: 4 },
    commentRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    commentName: { fontSize: 12, fontWeight: "700", color: "#111827" },
    commentDate: { fontSize: 10, color: "#D1D5DB" },
    deleteBtn: { marginLeft: "auto" },
    commentText: { fontSize: 13, color: "#374151", lineHeight: 19 },
});