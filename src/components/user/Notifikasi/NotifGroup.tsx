import { View, Text, StyleSheet } from "react-native";
import NotifItem, { type Notif, type NotifGrup } from "./NotifItem";

const GRUP_CONFIG: Record<NotifGrup, { label: string }> = {
    laporan: { label: "Laporan" },
    sosial:  { label: "Sosial" },
    sistem:  { label: "Sistem" },
};

interface Props {
    grup: NotifGrup;
    notifs: Notif[];
    onRead: (id: string) => void;
}

export default function NotifGroup({ grup, notifs, onRead }: Props) {
    const cfg = GRUP_CONFIG[grup];
    const unread = notifs.filter((n) => !n.dibaca).length;

    return (
        <View style={styles.root}>
            <View style={styles.grupHeader}>
                <Text style={styles.grupLabel}>{cfg.label.toUpperCase()}</Text>
                {unread > 0 && (
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{unread}</Text>
                    </View>
                )}
            </View>
            <View style={styles.card}>
                {notifs.map((n, i) => (
                    <View key={n.id}>
                        <NotifItem notif={n} onRead={onRead} />
                        {i < notifs.length - 1 && <View style={styles.divider} />}
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { marginBottom: 8 },
    grupHeader: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 4, paddingTop: 18, paddingBottom: 8 },
    grupLabel: { fontSize: 11, fontWeight: "700", color: "#a8856b", letterSpacing: 1 },
    badge: { backgroundColor: "#FF6B35", borderRadius: 99, paddingHorizontal: 6, paddingVertical: 2 },
    badgeText: { fontSize: 9, fontWeight: "800", color: "#fff" },
    card: { backgroundColor: "#fff", borderRadius: 14, borderWidth: 0.5, borderColor: "#f0e6dc", overflow: "hidden" },
    divider: { height: 0.5, backgroundColor: "#f5ede3" },
});