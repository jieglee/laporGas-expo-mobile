import { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FileText, Sparkles, Loader2 } from "lucide-react-native";
import { createReport } from "@/lib/report";
import TitleField from "@/components/user/BuatLaporan/TitleField";
import DescriptionField from "@/components/user/BuatLaporan/DescriptionField";
import CategoryField from "@/components/user/BuatLaporan/CategoryField";
import PriorityField from "@/components/user/BuatLaporan/PriorityField";
import LocationField from "@/components/user/BuatLaporan/LocationField";
import ImageUpload from "@/components/user/BuatLaporan/ImageUpload";
import SubmitButton from "@/components/user/BuatLaporan/SubmitButton";
import SuccessState from "@/components/user/BuatLaporan/SuccessState";
import { type FormState, isFormValid } from "@/components/user/BuatLaporan/types";
import { useAICategorizer } from "@/hooks/useAICategorizer";

const ORANGE = "#E8541C";
const CATEGORY_NAMES: Record<string, string> = {
    "1": "Infrastruktur",
    "2": "Fasilitas Umum",
    "3": "Kebersihan",
    "4": "Lalu Lintas",
};

const EMPTY: FormState = {
    title: "",
    description: "",
    category_id: "",
    location: "",
    latitude: "",
    longitude: "",
    priority: "",
    images: [],
};

export default function BuatLaporanPage() {
    const [form, setForm] = useState<FormState>(EMPTY);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [aiApplied, setAiApplied] = useState(false);

    const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
        setForm((p) => ({ ...p, [key]: val }));

    const { loading: aiLoading, lastResult, error: aiError } = useAICategorizer({
        title: form.title,
        description: form.description,
        onResult: (result) => {
            setForm((prev) => ({
                ...prev,
                category_id: prev.category_id === "" ? (result.category_id || prev.category_id) : prev.category_id,
                priority: prev.priority === "" ? (result.priority || prev.priority) : prev.priority,
            }));
            setAiApplied(true);
        },
    });

    const progress =
        (form.title.trim().length >= 5 ? 25 : 0) +
        (form.description.trim().length >= 20 ? 25 : 0) +
        (form.category_id ? 25 : 0) +
        (form.priority ? 25 : 0);

    const handleSubmit = async () => {
        if (!isFormValid(form) || submitting) return;
        try {
            setSubmitting(true);
            await createReport({
                title: form.title,
                description: form.description,
                category_id: Number(form.category_id),
                priority: form.priority as any,
                location: form.location || undefined,
                latitude: form.latitude ? parseFloat(form.latitude) : undefined,
                longitude: form.longitude ? parseFloat(form.longitude) : undefined,
                images: form.images,
            });
            setSubmitted(true);
        } catch (err: any) {
            Alert.alert("Gagal", err?.response?.data?.message ?? "Gagal membuat laporan");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return <SuccessState onReset={() => { setForm(EMPTY); setSubmitted(false); setAiApplied(false); }} />;
    }

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerIcon}>
                        <FileText size={20} color={ORANGE} strokeWidth={1.8} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.headerTitle}>Buat Laporan</Text>
                        <Text style={styles.headerSub}>Laporkan masalah di sekitar kamu</Text>
                    </View>
                </View>
                

                {/* Progress */}
                <View style={styles.progressBg}>
                    <View style={[styles.progressFill, { width: `${progress}%` as any }]} />
                </View>

                {/* Form */}
                <View style={styles.body}>
                    <TitleField
                        value={form.title}
                        onChange={(v) => { set("title", v); setAiApplied(false); }}
                    />
                    <DescriptionField
                        value={form.description}
                        onChange={(v) => { set("description", v); setAiApplied(false); }}
                    />

                    {/* AI Badge */}
                    {(aiLoading || aiError || (aiApplied && lastResult)) && (
                        <View style={[
                            styles.aiBadge,
                            aiLoading && styles.aiBadgeLoading,
                            aiError && styles.aiBadgeError,
                            !aiLoading && !aiError && styles.aiBadgeSuccess,
                        ]}>
                            <Sparkles size={12} color={aiError ? "#a8856b" : ORANGE} strokeWidth={2} />
                            <Text style={[
                                styles.aiBadgeText,
                                aiError && { color: "#a8856b" },
                            ]}>
                                {aiLoading
                                    ? "AI sedang menganalisis..."
                                    : aiError
                                    ? "AI tidak tersedia"
                                    : `AI: ${Math.round((lastResult?.confidence ?? 0) * 100)}% yakin — ${CATEGORY_NAMES[lastResult?.category_id ?? ""] ?? "—"}, ${lastResult?.priority}`
                                }
                            </Text>
                        </View>
                    )}

                    {/* Klasifikasi label */}
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionLabel}>Klasifikasi</Text>
                        {aiApplied && !aiLoading && lastResult && (
                            <View style={styles.aiTag}>
                                <Text style={styles.aiTagText}>✦ Diisi oleh AI</Text>
                            </View>
                        )}
                    </View>

                    <CategoryField value={form.category_id} onChange={(v) => set("category_id", v)} />
                    <PriorityField value={form.priority} onChange={(v) => set("priority", v)} />
                    <View style={styles.divider} />
                    <LocationField
                        location={form.location}
                        latitude={form.latitude}
                        longitude={form.longitude}
                        onChange={(lat: string, lng: string, address: string) => {
                            set("latitude", lat);
                            set("longitude", lng);
                            set("location", address);
                        }}
                    />
                    <View style={styles.divider} />
                    <ImageUpload images={form.images} onChange={(imgs) => set("images", imgs)} />
                    <SubmitButton form={form} submitting={submitting} onSubmit={handleSubmit} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}



const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: "#FFFCFA" },
    header: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, backgroundColor: "#fff", borderBottomWidth: 0.5, borderBottomColor: "#f0e6dc" },
    headerIcon: { width: 46, height: 46, borderRadius: 13, backgroundColor: "#FFF5EE", borderWidth: 0.5, borderColor: "rgba(255,107,53,0.18)", alignItems: "center", justifyContent: "center" },
    headerTitle: { fontSize: 20, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.4 },
    headerSub: { fontSize: 12, color: "#a8856b", marginTop: 2 },
    progressBg: { height: 3, backgroundColor: "#f5ede3" },
    progressFill: { height: 3, backgroundColor: ORANGE, borderRadius: 3 },
    body: { padding: 16 },
    divider: { height: 0.5, backgroundColor: "#f5ede3", marginBottom: 20 },

    aiBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 99, borderWidth: 0.5, marginBottom: 16, alignSelf: "flex-start" },
    aiBadgeLoading: { backgroundColor: "#FFF5EE", borderColor: "rgba(232,84,28,0.2)" },
    aiBadgeError: { backgroundColor: "#fafaf8", borderColor: "#f0e6dc" },
    aiBadgeSuccess: { backgroundColor: "#FFF5EE", borderColor: "rgba(232,84,28,0.2)" },
    aiBadgeText: { fontSize: 11, fontWeight: "600", color: ORANGE },

    sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
    sectionLabel: { fontSize: 11, fontWeight: "700", color: "#c9a892", textTransform: "uppercase", letterSpacing: 1 },
    aiTag: { backgroundColor: "#FFF5EE", borderWidth: 0.5, borderColor: "rgba(232,84,28,0.15)", borderRadius: 99, paddingHorizontal: 8, paddingVertical: 3 },
    aiTagText: { fontSize: 10, fontWeight: "600", color: ORANGE },
});


