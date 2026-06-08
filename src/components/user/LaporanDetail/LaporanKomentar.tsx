import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { createComment, deleteComment, type Comment } from "@/lib/comments";
import type { Report } from "@/lib/report";
import { Send, Trash2, CornerDownRight } from "lucide-react-native";

const ORANGE = "#E8541C";

function fmtDate(dateStr: string) {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 3600) return `${Math.floor(diff / 60)} mnt lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

function Avatar({ name, size = 32, official = false }: { name: string; size?: number; official?: boolean }) {
    const txt = (name ?? "?").split(" ").slice(0, 2).map((n: string) => n[0]).join("").toUpperCase();
    return (
        <View style={[styles.avatar, { width: size, height: size, borderRadius: size, backgroundColor: official ? "#3B82F6" : ORANGE }]}>
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
    const [replyTo, setReplyTo] = useState<{ id: number; name: string } | null>(null);
    const [replyText, setReplyText] = useState("");
    const [submittingReply, setSubmittingReply] = useState(false);

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

    const handleSubmitReply = async (parentId: number) => {
        if (!replyText.trim()) return;
        try {
            setSubmittingReply(true);
            const comment = await createComment({
                report_id: report.id,
                comment: replyText,
                parent_id: parentId,
            });
            onCommentAdded(comment);
            setReplyText("");
            setReplyTo(null);
        } catch (err) { console.error(err); }
        finally { setSubmittingReply(false); }
    };

    const handleDelete = (commentId: number) => {
        const doDelete = () => deleteComment(commentId).then(() => onCommentDeleted(commentId));
        if (Platform.OS === "web") {
            if (window.confirm("Hapus komentar ini?")) doDelete();
            return;
        }
        Alert.alert("Hapus komentar", "Yakin ingin menghapus?", [
            { text: "Batal", style: "cancel" },
            { text: "Hapus", style: "destructive", onPress: doDelete },
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

            {/* Input utama */}
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
                                {/* Header komentar */}
                                <View style={styles.commentTop}>
                                    <Text style={styles.commentName}>{c.name ?? "Anonim"}</Text>
                                    <Text style={styles.commentDate}>{fmtDate(c.created_at)}</Text>
                                    <View style={styles.commentActions}>
                                        {user && (
                                            <TouchableOpacity
                                                onPress={() => setReplyTo(replyTo?.id === c.id ? null : { id: c.id, name: c.name })}
                                                style={styles.replyBtn}
                                            >
                                                <CornerDownRight size={11} color="#a8856b" strokeWidth={2} />
                                                <Text style={styles.replyBtnText}>
                                                    {replyTo?.id === c.id ? "Batal" : "Balas"}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        {user?.id === String(c.user_id) && (
                                            <TouchableOpacity onPress={() => handleDelete(c.id)} style={styles.deleteBtn}>
                                                <Trash2 size={12} color="#FCA5A5" strokeWidth={1.8} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                <Text style={styles.commentText}>{c.comment}</Text>

                                {/* Input reply */}
                                {replyTo?.id === c.id && (
                                    <View style={styles.replyInputWrap}>
                                        <View style={styles.replyInputInner}>
                                            <TextInput
                                                style={styles.replyInput}
                                                placeholder={`Balas ${c.name}...`}
                                                placeholderTextColor="#c9a892"
                                                value={replyText}
                                                onChangeText={setReplyText}
                                                autoFocus
                                                multiline
                                            />
                                            <TouchableOpacity
                                                style={[styles.sendBtn, (!replyText.trim() || submittingReply) && styles.sendDisabled]}
                                                onPress={() => handleSubmitReply(c.id)}
                                                disabled={!replyText.trim() || submittingReply}
                                            >
                                                <Send size={12} color="#fff" strokeWidth={2} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}

                                {/* Replies */}
                                {(c.replies ?? []).length > 0 && (
                                    <View style={styles.repliesList}>
                                        {(c.replies ?? []).map((reply) => (
                                            <View key={reply.id} style={styles.replyItem}>
                                                <View style={styles.replyLine} />
                                                <Avatar name={reply.name ?? "U"} size={24} official={reply.type === "official"} />
                                                <View style={styles.replyBody}>
                                                    <View style={styles.commentTop}>
                                                        <Text style={styles.replyName}>{reply.name ?? "Anonim"}</Text>
                                                        {reply.type === "official" && (
                                                            <View style={styles.officialBadge}>
                                                                <Text style={styles.officialBadgeText}>INSTANSI</Text>
                                                            </View>
                                                        )}
                                                        <Text style={styles.commentDate}>{fmtDate(reply.created_at)}</Text>
                                                        {user?.id === String(reply.user_id) && (
                                                            <TouchableOpacity onPress={() => handleDelete(reply.id)} style={styles.deleteBtn}>
                                                                <Trash2 size={10} color="#FCA5A5" strokeWidth={1.8} />
                                                            </TouchableOpacity>
                                                        )}
                                                    </View>
                                                    <Text style={styles.replyText}>{reply.comment}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>
                                )}
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
    label: { fontSize: 9, fontWeight: "800", color: ORANGE, letterSpacing: 2 },
    title: { fontSize: 16, fontWeight: "700", color: "#1a0e08" },
    count: { color: "#a8856b", fontWeight: "400" },

    inputWrap: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
    inputInner: { flex: 1, flexDirection: "row", alignItems: "flex-end", gap: 8, backgroundColor: "#fafaf8", borderRadius: 14, borderWidth: 1, borderColor: "#f0e6dc", paddingHorizontal: 12, paddingVertical: 8 },
    input: { flex: 1, fontSize: 13, color: "#1a0e08", maxHeight: 80, lineHeight: 20 },
    sendBtn: { width: 30, height: 30, borderRadius: 9, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", flexShrink: 0 },
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
    commentTop: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
    commentName: { fontSize: 12, fontWeight: "700", color: "#1a0e08" },
    commentDate: { fontSize: 10, color: "#c9a892", flex: 1 },
    commentActions: { flexDirection: "row", alignItems: "center", gap: 8 },
    commentText: { fontSize: 13, color: "#374151", lineHeight: 20 },

    replyBtn: { flexDirection: "row", alignItems: "center", gap: 3 },
    replyBtnText: { fontSize: 10, fontWeight: "600", color: "#a8856b" },
    deleteBtn: { padding: 2 },

    replyInputWrap: { marginTop: 8 },
    replyInputInner: { flexDirection: "row", alignItems: "flex-end", gap: 8, backgroundColor: "#fafaf8", borderRadius: 12, borderWidth: 1, borderColor: "#f0e6dc", paddingHorizontal: 10, paddingVertical: 6 },
    replyInput: { flex: 1, fontSize: 12, color: "#1a0e08", maxHeight: 60, lineHeight: 18 },

    repliesList: { marginTop: 8, gap: 8, paddingLeft: 4 },
    replyItem: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
    replyLine: { width: 2, backgroundColor: "#f0e6dc", borderRadius: 1, alignSelf: "stretch", marginLeft: 2 },
    replyBody: { flex: 1, gap: 3 },
    replyName: { fontSize: 11, fontWeight: "700", color: "#1a0e08" },
    replyText: { fontSize: 12, color: "#374151", lineHeight: 18 },

    officialBadge: { backgroundColor: "#DBEAFE", borderWidth: 0.5, borderColor: "#BFDBFE", borderRadius: 99, paddingHorizontal: 6, paddingVertical: 1 },
    officialBadgeText: { fontSize: 8, fontWeight: "800", color: "#1D4ED8" },

    avatar: { alignItems: "center", justifyContent: "center", flexShrink: 0 },
    avatarText: { fontWeight: "700", color: "#fff" },
});