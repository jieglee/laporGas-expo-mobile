import { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, ActivityIndicator, Alert,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth.store";
import { loginUser } from "@/lib/auth";

export default function LoginPage() {
    const { setAuth } = useAuthStore();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
        setError("Email dan password wajib diisi");
        return;
    }
    try {
        setLoading(true);
        const { token, user } = await loginUser({ email, password });
        await setAuth(token, user);
        router.replace("/(tabs)" as any);
    } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Email atau password salah";
        setError(msg);
        console.log("LOGIN ERROR:", err?.response?.data);
    } finally {
        setLoading(false);
    }
};

// Tambah di JSX sebelum button:
{error ? (
    <View style={styles.errorBox}>
        <Text style={styles.errorText}>{error}</Text>
    </View>
) : null}


    

    return (
        <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.header}>
                    <View style={styles.logoBox}>
                        <Text style={styles.logoText}>LG</Text>
                    </View>
                    <Text style={styles.title}>LaporGas</Text>
                    <Text style={styles.subtitle}>Platform Pengaduan Masyarakat</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Masuk</Text>
                    <Text style={styles.cardSubtitle}>Gunakan akun yang sudah terdaftar</Text>

                    <View style={styles.fields}>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="email@domain.com"
                                placeholderTextColor="#c9a892"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                        <View style={styles.fieldGroup}>
                            <Text style={styles.label}>Kata Sandi</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#c9a892"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.btn, loading && styles.btnDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.85}
                    >
                        {loading
                            ? <ActivityIndicator color="#fff" size="small" />
                            : <Text style={styles.btnText}>Masuk</Text>
                        }
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Belum punya akun? </Text>
                        <TouchableOpacity onPress={() => router.push("/(auth)/register" as any)}>
                            <Text style={styles.footerLink}>Daftar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const ORANGE = "#E8541C";


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
    errorBox: { backgroundColor: "#FEE2E2", borderRadius: 10, padding: 12, marginBottom: 12 },
    errorText: { fontSize: 13, color: "#B91C1C", textAlign: "center" },

});

