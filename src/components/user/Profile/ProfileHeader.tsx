import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Mail, Calendar, LogOut, Pencil } from "lucide-react-native";

const ORANGE = "#E8541C";

interface Props {
    nama: string;
    email: string;
    joinedAt: string;
    inisial: string;
    avatarUrl?: string | null;
    onEdit: () => void;
    onLogout: () => void;
}

export default function ProfileHeader({ nama, email, joinedAt, inisial, onEdit, onLogout }: Props) {
    return (
        <View style={styles.card}>
            {/* Banner */}
            <View style={styles.banner}>
                <View style={styles.circle1} />
                <View style={styles.circle2} />
                <View style={styles.circle3} />
            </View>

            <View style={styles.content}>
                {/* Avatar + actions */}
                <View style={styles.topRow}>
                    <View style={styles.avatarWrap}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{inisial}</Text>
                        </View>
                        <View style={styles.onlineDot} />
                    </View>
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.editBtn} onPress={onEdit} activeOpacity={0.85}>
                            <Pencil size={12} color="#fff" strokeWidth={2.5} />
                            <Text style={styles.editBtnText}>Edit Profil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.8}>
                            <LogOut size={12} color="#6b5546" strokeWidth={2} />
                            <Text style={styles.logoutBtnText}>Keluar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Name */}
                <Text style={styles.nama}>{nama}</Text>
                <Text style={styles.role}>Warga Pelapor Aktif</Text>

                {/* Divider */}
                <View style={styles.divider} />

                {/* Meta */}
                <View style={styles.meta}>
                    <View style={styles.metaItem}>
                        <View style={styles.metaIcon}><Mail size={11} color={ORANGE} strokeWidth={2} /></View>
                        <Text style={styles.metaText}>{email}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <View style={styles.metaIcon}><Calendar size={11} color={ORANGE} strokeWidth={2} /></View>
                        <Text style={styles.metaText}>Bergabung {joinedAt}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", borderWidth: 0.5, borderColor: "#f0e6dc", margin: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },

    banner: { height: 130, backgroundColor: ORANGE, overflow: "hidden" },
    circle1: { position: "absolute", width: 160, height: 160, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.05)", top: -32, right: -32 },
    circle2: { position: "absolute", width: 96, height: 96, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.05)", top: -16, right: 64 },
    circle3: { position: "absolute", width: 128, height: 128, borderRadius: 99, backgroundColor: "rgba(0,0,0,0.05)", bottom: 0, left: -16 },

    content: { paddingHorizontal: 20, paddingBottom: 20 },
    topRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginTop: -44, marginBottom: 16 },

    avatarWrap: { position: "relative" },
    avatar: { width: 88, height: 88, borderRadius: 99, backgroundColor: ORANGE, borderWidth: 4, borderColor: "#fff", alignItems: "center", justifyContent: "center", shadowColor: ORANGE, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 16, elevation: 4 },
    avatarText: { fontSize: 28, fontWeight: "800", color: "#fff" },
    onlineDot: { position: "absolute", bottom: 4, right: 4, width: 16, height: 16, borderRadius: 99, backgroundColor: "#34D399", borderWidth: 2, borderColor: "#fff" },

    actions: { flexDirection: "row", gap: 8, marginBottom: 4 },
    editBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: ORANGE, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 3 },
    editBtnText: { color: "#fff", fontSize: 12, fontWeight: "700" },
    logoutBtn: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: "#f0e6dc" },
    logoutBtnText: { color: "#6b5546", fontSize: 12, fontWeight: "600" },

    nama: { fontSize: 22, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.4, marginBottom: 2 },
    role: { fontSize: 12, color: "#a8856b", fontWeight: "500", marginBottom: 16 },

    divider: { height: 0.5, backgroundColor: "#f0e6dc", marginBottom: 16 },

    meta: { gap: 8 },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 8 },
    metaIcon: { width: 24, height: 24, borderRadius: 6, backgroundColor: "#FFF5EE", alignItems: "center", justifyContent: "center" },
    metaText: { fontSize: 13, color: "#6b5546" },
});