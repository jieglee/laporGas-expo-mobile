import { useState, useRef, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, Modal, ActivityIndicator,
} from "react-native";
import { X, Eye, EyeOff, CheckCircle } from "lucide-react-native";
import { verifyIdentity, resetPasswordByName } from "@/lib/auth";

const ORANGE = "#E8541C";
type Step = "identity" | "reset" | "success";

interface Props {
    visible: boolean;
    onClose: () => void;
}

export default function ForgotPasswordModal({ visible, onClose }: Props) {
    const [step, setStep] = useState<Step>("identity");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPw, setShowPw] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const mounted = useRef(true);

    useEffect(() => {
        mounted.current = true;
        return () => { mounted.current = false; };
    }, []);

    const reset = () => {
        setStep("identity");
        setEmail(""); setName(""); setPassword(""); setConfirm("");
        setError(""); setShowPw(false);
    };

    const handleClose = () => { reset(); onClose(); };

    const handleVerify = async () => {
        if (!email.trim() || !name.trim()) { setError("Email dan nama wajib diisi"); return; }
        setLoading(true); setError("");
        try {
            const res = await verifyIdentity(email, name);
            if (res.verified) setStep("reset");
            else setError(res.message ?? "Email dan nama tidak cocok.");
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Terjadi kesalahan. Coba lagi.";
            setError(msg);
        }
        finally { setLoading(false); }
    };

    const handleReset = async () => {
        if (password.length < 6) { setError("Password minimal 6 karakter"); return; }
        if (password !== confirm) { setError("Konfirmasi password tidak cocok"); return; }
        setLoading(true); setError("");
        try {
            const res = await resetPasswordByName(email, name, password);
            const successMsg = res.message ?? "";
            if (successMsg.toLowerCase().includes("berhasil") || successMsg.toLowerCase().includes("sukses") || successMsg.toLowerCase().includes("success")) {
                setStep("success");
                setTimeout(() => { if (mounted.current) handleClose(); }, 2000);
            } else setError(res.message ?? "Gagal mengubah password.");
        } catch (err: any) {
            const msg = err?.response?.data?.message || err?.message || "Terjadi kesalahan. Coba lagi.";
            setError(msg);
        }
        finally { setLoading(false); }
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={handleClose} />
            <View style={s.sheet}>
                <View style={s.handle} />
                <View style={s.accent} />

                <View style={s.header}>
                    <Text style={s.title}>
                        {step === "identity" && "Lupa Kata Sandi?"}
                        {step === "reset" && "Buat Password Baru"}
                        {step === "success" && "Berhasil!"}
                    </Text>
                    <TouchableOpacity onPress={handleClose} style={s.closeBtn}>
                        <X size={16} color="#a8856b" strokeWidth={2} />
                    </TouchableOpacity>
                </View>

                {step === "identity" && (
                    <View style={s.body}>
                        <Text style={s.sub}>Masukkan email dan nama lengkap yang terdaftar.</Text>
                        <View style={s.field}>
                            <Text style={s.label}>Email</Text>
                            <TextInput
                                style={s.input}
                                placeholder="email@domain.com"
                                placeholderTextColor="#c9a892"
                                value={email}
                                onChangeText={(v) => { setEmail(v); setError(""); }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                        <View style={s.field}>
                            <Text style={s.label}>Nama Lengkap</Text>
                            <TextInput
                                style={s.input}
                                placeholder="Nama sesuai saat daftar"
                                placeholderTextColor="#c9a892"
                                value={name}
                                onChangeText={(v) => { setName(v); setError(""); }}
                            />
                        </View>
                        {error ? <Text style={s.error}>{error}</Text> : null}
                        <TouchableOpacity
                            style={[s.btn, (!email || !name || loading) && s.btnOff]}
                            onPress={handleVerify}
                            disabled={!email || !name || loading}
                            activeOpacity={0.85}
                        >
                            {loading
                                ? <ActivityIndicator color="#fff" size="small" />
                                : <Text style={s.btnText}>Verifikasi Identitas</Text>
                            }
                        </TouchableOpacity>
                    </View>
                )}

                {step === "reset" && (
                    <View style={s.body}>
                        <Text style={s.sub}>
                            Untuk akun <Text style={{ fontWeight: "700", color: "#1a0e08" }}>{email}</Text>
                        </Text>
                        <View style={s.field}>
                            <Text style={s.label}>Password Baru</Text>
                            <View style={s.pwWrap}>
                                <TextInput
                                    style={[s.input, { flex: 1, borderWidth: 0 }]}
                                    placeholder="Minimal 6 karakter"
                                    placeholderTextColor="#c9a892"
                                    value={password}
                                    onChangeText={(v) => { setPassword(v); setError(""); }}
                                    secureTextEntry={!showPw}
                                />
                                <TouchableOpacity onPress={() => setShowPw(!showPw)} style={s.eyeBtn}>
                                    {showPw ? <EyeOff size={16} color="#a8856b" /> : <Eye size={16} color="#a8856b" />}
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={s.field}>
                            <Text style={s.label}>Konfirmasi Password</Text>
                            <TextInput
                                style={s.input}
                                placeholder="Ulangi password baru"
                                placeholderTextColor="#c9a892"
                                value={confirm}
                                onChangeText={(v) => { setConfirm(v); setError(""); }}
                                secureTextEntry={!showPw}
                            />
                        </View>
                        {confirm.length > 0 && (
                            <Text style={{ fontSize: 11, fontWeight: "600", color: password === confirm ? "#10B981" : "#EF4444" }}>
                                {password === confirm ? "✓ Password cocok" : "✗ Tidak cocok"}
                            </Text>
                        )}
                        {error ? <Text style={s.error}>{error}</Text> : null}
                        <View style={{ flexDirection: "row", gap: 10 }}>
                            <TouchableOpacity
                                style={s.btnSec}
                                onPress={() => { setStep("identity"); setError(""); setPassword(""); setConfirm(""); }}
                            >
                                <Text style={s.btnSecText}>← Kembali</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[s.btn, { flex: 1 }, (!password || !confirm || password !== confirm || loading) && s.btnOff]}
                                onPress={handleReset}
                                disabled={!password || !confirm || password !== confirm || loading}
                                activeOpacity={0.85}
                            >
                                {loading
                                    ? <ActivityIndicator color="#fff" size="small" />
                                    : <Text style={s.btnText}>Simpan Password</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {step === "success" && (
                    <View style={[s.body, { alignItems: "center", paddingVertical: 32 }]}>
                        <View style={s.successIcon}>
                            <CheckCircle size={32} color="#10B981" strokeWidth={1.8} />
                        </View>
                        <Text style={s.successTitle}>Password berhasil diubah!</Text>
                        <Text style={s.sub}>Modal akan menutup otomatis...</Text>
                    </View>
                )}

                {step !== "success" && (
                    <View style={s.dots}>
                        {(["identity", "reset"] as Step[]).map((st) => (
                            <View key={st} style={[s.dot, step === st && s.dotActive]} />
                        ))}
                    </View>
                )}
            </View>
        </Modal>
    );
}

const s = StyleSheet.create({
    overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" },
    sheet: {
        position: "absolute", bottom: 0, left: 0, right: 0,
        backgroundColor: "#fff", borderTopLeftRadius: 28, borderTopRightRadius: 28,
        paddingBottom: 40,
        shadowColor: "#000", shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1, shadowRadius: 20, elevation: 20,
    },
    handle: { width: 36, height: 4, borderRadius: 99, backgroundColor: "#f0e6dc", alignSelf: "center", marginTop: 12, marginBottom: 4 },
    accent: { height: 3, backgroundColor: ORANGE },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, paddingVertical: 16 },
    title: { fontSize: 18, fontWeight: "800", color: "#1a0e08" },
    closeBtn: { width: 32, height: 32, borderRadius: 99, backgroundColor: "#f5ede3", alignItems: "center", justifyContent: "center" },
    body: { paddingHorizontal: 24, gap: 14 },
    sub: { fontSize: 13, color: "#a8856b" },
    field: { gap: 6 },
    label: { fontSize: 12, fontWeight: "700", color: "#3d2817" },
    input: { borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#1a0e08", backgroundColor: "#fafaf8" },
    pwWrap: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 12, backgroundColor: "#fafaf8" },
    eyeBtn: { paddingHorizontal: 14 },
    error: { fontSize: 12, color: "#EF4444", fontWeight: "500" },
    btn: { backgroundColor: ORANGE, borderRadius: 14, paddingVertical: 14, alignItems: "center", shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 4 },
    btnOff: { opacity: 0.5 },
    btnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
    btnSec: { flex: 1, borderRadius: 14, paddingVertical: 14, alignItems: "center", borderWidth: 1, borderColor: "#f0e6dc", backgroundColor: "#fff" },
    btnSecText: { fontSize: 13, fontWeight: "600", color: "#a8856b" },
    dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 20 },
    dot: { width: 8, height: 8, borderRadius: 99, backgroundColor: "#f0e6dc" },
    dotActive: { width: 20, backgroundColor: ORANGE },
    successIcon: { width: 64, height: 64, borderRadius: 99, backgroundColor: "#D1FAE5", alignItems: "center", justifyContent: "center", marginBottom: 12 },
    successTitle: { fontSize: 16, fontWeight: "800", color: "#1a0e08", marginBottom: 4 },
});