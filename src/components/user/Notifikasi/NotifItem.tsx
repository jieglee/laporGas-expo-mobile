import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export type NotifGrup = "laporan" | "sosial" | "sistem";

export interface Notif {
    id: string;
    judul: string;
    deskripsi: string;
    waktu: string;
    dibaca: boolean;
    grup: NotifGrup;
    reportId?: number;
}

interface Props {
    notif: Notif;
    onRead: (id: string) => void;
}

export default function NotifItem({ notif, onRead }: Props) {
    return (
        <TouchableOpacity
            style={[styles.root, notif.dibaca ? styles.read : styles.unread]}
            onPress={() => onRead(notif.id)}
            activeOpacity={0.8}
        >
            {!notif.dibaca && <View style={styles.dot} />}
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text style={styles.judul} numberOfLines={1}>{notif.judul}</Text>
                    <Text style={styles.waktu}>{notif.waktu}</Text>
                </View>
                <Text style={styles.deskripsi} numberOfLines={2}>{notif.deskripsi}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    root: { flexDirection: "row", alignItems: "flex-start", paddingHorizontal: 16, paddingVertical: 14, gap: 10 },
    read: { backgroundColor: "#fff" },
    unread: { backgroundColor: "#FFF8F4" },
    dot: { width: 7, height: 7, borderRadius: 99, backgroundColor: "#E8541C", marginTop: 5 },
    content: { flex: 1, gap: 4 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
    judul: { fontSize: 13, fontWeight: "700", color: "#1a0e08", flex: 1 },
    waktu: { fontSize: 10, color: "#a8856b" },
    deskripsi: { fontSize: 12, color: "#8a6f5e", lineHeight: 18 },
});