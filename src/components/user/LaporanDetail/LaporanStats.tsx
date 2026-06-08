import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { ArrowBigUp, MessageCircle } from "lucide-react-native";
import type { Report } from "@/lib/report";
import type { Comment } from "@/lib/comments";

const ORANGE = "#E8541C";

interface Props {
    report: Report;
    comments: Comment[];
    upvoted: boolean;
    upvoteCount: number;
    upvoteLoading: boolean;
    onUpvote: () => void;
}

export default function LaporanStats({ comments, upvoted, upvoteCount, upvoteLoading, onUpvote }: Props) {
    return (
        <View style={styles.card}>
            {/* Upvote */}
            <TouchableOpacity
                style={[styles.item, upvoted && styles.itemActive]}
                onPress={onUpvote}
                disabled={upvoteLoading}
                activeOpacity={0.8}
            >
                <View style={[styles.iconWrap, upvoted && styles.iconWrapActive]}>
                    {upvoteLoading ? (
                        <ActivityIndicator size="small" color={upvoted ? "#fff" : ORANGE} />
                    ) : (
                        <ArrowBigUp
                            size={20}
                            color={upvoted ? "#fff" : ORANGE}
                            strokeWidth={1.8}
                            fill={upvoted ? "#fff" : "none"}
                        />
                    )}
                </View>
                <Text style={[styles.val, upvoted && styles.valActive]}>{upvoteCount}</Text>
                <Text style={[styles.key, upvoted && styles.keyActive]}>
                    {upvoted ? "Didukung" : "Dukung"}
                </Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            {/* Komentar */}
            <View style={styles.item}>
                <View style={styles.iconWrap}>
                    <MessageCircle size={20} color={ORANGE} strokeWidth={1.8} />
                </View>
                <Text style={styles.val}>{comments.length}</Text>
                <Text style={styles.key}>Komentar</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        borderWidth: 0.5,
        borderColor: "#f0e6dc",
        flexDirection: "row",
        overflow: "hidden",
    },
    item: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 18,
        gap: 4,
    },
    itemActive: {
        backgroundColor: ORANGE,
    },
    iconWrap: {
        width: 40, height: 40,
        borderRadius: 12,
        backgroundColor: "#FFF5EE",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    iconWrapActive: {
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    divider: { width: 0.5, backgroundColor: "#f5ede3", marginVertical: 16 },
    val: { fontSize: 26, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.5 },
    valActive: { color: "#fff" },
    key: { fontSize: 11, color: "#a8856b", fontWeight: "500" },
    keyActive: { color: "rgba(255,255,255,0.8)" },
});