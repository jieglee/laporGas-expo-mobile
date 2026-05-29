import { useState, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert, Platform,
} from "react-native";
import { X, Eye, EyeOff } from "lucide-react-native";
import { updateProfile } from "@/lib/users";
import { useAuthStore } from "@/store/auth.store";

const ORANGE = "#E8541C";

interface Props {
    open: boolean;
    onClose: () => void;
    initial: { nama: string; email: string; inisial: string; avatarUrl?: string | null };
}

export default function EditProfileModal({ open, onClose, initial }: Props) {
    const { user, setAuth, token } = useAuthStore();
    const [nama, setNama] = useState(initial.nama);
    const [email, setEmail] = useState(initial.email);
    const [password, setPassword] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setNama(initial.nama);
            setEmail(initial.email);
            setPassword("");
        }
    }, [open, initial.nama, initial.email]);

    const handleSubmit = async () => {
        if (!nama.trim() || !email.trim()) return;
        try {
            setSaving(true);
            const updated = await updateProfile({
                name: nama.trim(),
                email: email.trim(),
                ...(password.length >= 6 ? { password } : {}),
            });
            if (token && user) {
                await setAuth(token, {
                    ...user,
                    name: updated.name,
                    email: updated.email,
                });
            }
            Alert.alert("Berhasil", "Profil berhasil diperbarui");
            onClose();
        } catch (err: any) {
            Alert.alert("Gagal", err?.response?.data?.message ?? "Gagal memperbarui profil");
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <View style={styles.overlay}>
            <TouchableOpacity style={StyleSheet.absoluteFill} onPress={onClose} />
            <View style={styles.modal}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Edit Profil</Text>
                        <Text style={styles.sub}>Perbarui informasi akun kamu</Text>
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <X size={19} color="#a8856b" />
                    </TouchableOpacity>
                </View>

                {/* Body */}
                <View style={styles.body}>
                    <View style={styles.avatarCenter}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{initial.inisial}</Text>
                        </View>
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Nama lengkap</Text>
                        <TextInput
                            style={styles.input}
                            value={nama}
                            onChangeText={setNama}
                            placeholder="Nama lengkap"
                            placeholderTextColor="#c9a892"
                        />
                    </View>

                    <View style={styles.field}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="email@example.com"
                            placeholderTextColor="#c9a892"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>


                    <View style={styles.field}>
                        <Text style={styles.label}>
                            Password baru{" "}
                            <Text style={{ fontWeight: "400", color: "#a8856b" }}>(kosongkan jika tidak diubah)</Text>
                        </Text>
                        <View style={styles.pwWrap}>
                            <TextInput
                                style={[styles.input, { flex: 1, borderWidth: 0 }]}
                                value={password}
                                onChangeText={setPassword}
                                placeholder="Min. 6 karakter"
                                placeholderTextColor="#c9a892"
                                secureTextEntry={!showPw}
                            />
                            <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.pwToggle}>
                                {showPw ? <EyeOff size={15} color="#a8856b" /> : <Eye size={15} color="#a8856b" />}
                            </TouchableOpacity>
                        </View>
                        {password.length > 0 && password.length < 6 && (
                            <Text style={styles.pwHint}>Minimal 6 karakter</Text>
                        )}
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                        <Text style={styles.cancelText}>Batal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.saveBtn, (!nama.trim() || !email.trim()) && styles.saveBtnDisabled]}
                        onPress={handleSubmit}
                        disabled={saving || !nama.trim() || !email.trim()}
                        activeOpacity={0.85}
                    >
                        {saving
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <Text style={styles.saveText}>Simpan</Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: "absolute" as any,
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        zIndex: 999,
    },
    modal: { backgroundColor: "#fff", borderRadius: 20, width: "100%", maxWidth: 480, overflow: "hidden" },
    header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", borderBottomWidth: 0.5, borderBottomColor: "#f5ede3", paddingHorizontal: 24, paddingVertical: 20 },
    title: { fontSize: 16, fontWeight: "800", color: "#1a0e08" },
    sub: { fontSize: 11, color: "#a8856b", marginTop: 2 },
    closeBtn: { padding: 4 },
    body: { padding: 24, gap: 16 },
    avatarCenter: { alignItems: "center", marginBottom: 8 },
    avatar: { width: 72, height: 72, borderRadius: 99, backgroundColor: ORANGE, borderWidth: 3, borderColor: "#f0e6dc", alignItems: "center", justifyContent: "center" },
    avatarText: { fontSize: 22, fontWeight: "800", color: "#fff" },
    field: { gap: 6 },
    label: { fontSize: 11, fontWeight: "700", color: "#3d2817" },
    input: { backgroundColor: "#fafaf8", borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: "#1a0e08" },
    pwWrap: { flexDirection: "row", alignItems: "center", backgroundColor: "#fafaf8", borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 10, paddingRight: 12 },
    pwToggle: { padding: 4 },
    pwHint: { fontSize: 10, color: "#EF4444", marginTop: 2 },
    footer: { flexDirection: "row", gap: 10, borderTopWidth: 0.5, borderTopColor: "#f5ede3", backgroundColor: "#fafaf8", paddingHorizontal: 24, paddingVertical: 16 },
    cancelBtn: { flex: 1, borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 12, paddingVertical: 12, alignItems: "center", backgroundColor: "#fff" },
    cancelText: { fontSize: 13, fontWeight: "600", color: "#3d2817" },
    saveBtn: { flex: 1, backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 12, alignItems: "center", shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 3 },
    saveBtnDisabled: { backgroundColor: "#f0e6dc", shadowOpacity: 0, elevation: 0 },
    saveText: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

