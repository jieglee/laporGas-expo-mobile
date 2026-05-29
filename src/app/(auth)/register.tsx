import { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, ActivityIndicator, Alert,
} from "react-native";
import { router } from "expo-router";
import { registerUser } from "@/lib/auth";

const ORANGE = "#E8541C";

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        if (!name.trim() || !email.trim() || !password.trim()) {
            Alert.alert("Lengkapi data", "Semua field wajib diisi");
            return;
        }
        if (password !== confirm) {
            Alert.alert("Password tidak cocok", "Konfirmasi password harus sama");
            return;
        }
        if (password.length < 6) {
            Alert.alert("Password terlalu pendek", "Minimal 6 karakter");
            return;
        }
        try {
            setLoading(true);
            await registerUser({ name, email, password });
            Alert.alert("Berhasil", "Akun berhasil dibuat. Silakan login.", [
                { text: "Login", onPress: () => router.replace("/(auth)/login" as any) },
            ]);
        } catch (err: any) {
            Alert.alert("Gagal", err?.response?.data?.message ?? "Registrasi gagal");
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <View style={styles.logoBox}><Text style={styles.logoText}>LG</Text></View>
                    <Text style={styles.title}>Buat Akun</Text>
                    <Text style={styles.subtitle}>Daftar dan mulai buat laporan</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Daftar</Text>
                    <Text style={styles.cardSubtitle}>Lengkapi data diri kamu</Text>

                    <View style={styles.fields}>
                        {[
                            { label: "Nama Lengkap", value: name, setter: setName, placeholder: "Nama lengkap", type: "default", secure: false },
                            { label: "Email", value: email, setter: setEmail, placeholder: "email@domain.com", type: "email-address", secure: false },
                            { label: "Password", value: password, setter: setPassword, placeholder: "Min. 6 karakter", type: "default", secure: true },
                            { label: "Konfirmasi Password", value: confirm, setter: setConfirm, placeholder: "Ulangi password", type: "default", secure: true },
                        ].map((f) => (
                            <View key={f.label} style={styles.fieldGroup}>
                                <Text style={styles.label}>{f.label}</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder={f.placeholder}
                                    placeholderTextColor="#c9a892"
                                    value={f.value}
                                    onChangeText={f.setter as any}
                                    keyboardType={f.type as any}
                                    autoCapitalize="none"
                                    secureTextEntry={f.secure}
                                />
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.btn, loading && styles.btnDisabled]}
                        onPress={handleRegister}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" size="small" />
                            : <Text style={styles.btnText}>Daftar Sekarang</Text>
                        }
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Sudah punya akun? </Text>
                        <TouchableOpacity onPress={() => router.back()}>
                            <Text style={styles.footerLink}>Masuk</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}


const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFCFA" },
    scroll: { flexGrow: 1, justifyContent: "center", padding: 24 },
    header: { alignItems: "center", marginBottom: 32 },
    logoBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", marginBottom: 12, shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
    logoText: { color: "#fff", fontSize: 20, fontWeight: "800" },
    title: { fontSize: 24, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.5 },
    subtitle: { fontSize: 13, color: "#a8856b", marginTop: 4 },
    card: { backgroundColor: "#fff", borderRadius: 20, padding: 24, borderWidth: 0.5, borderColor: "#f0e6dc", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3 },
    cardTitle: { fontSize: 18, fontWeight: "800", color: "#1a0e08", marginBottom: 4 },
    cardSubtitle: { fontSize: 12, color: "#a8856b", marginBottom: 24 },
    fields: { gap: 16, marginBottom: 20 },
    fieldGroup: { gap: 6 },
    label: { fontSize: 12, fontWeight: "700", color: "#3d2817" },
    input: { borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#1a0e08", backgroundColor: "#fafaf8" },
    btn: { backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 14, alignItems: "center", shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
    btnDisabled: { opacity: 0.6 },
    btnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
    footer: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
    footerText: { fontSize: 13, color: "#a8856b" },
    footerLink: { fontSize: 13, color: ORANGE, fontWeight: "700" },
});

