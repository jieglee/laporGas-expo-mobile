import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { type FormState, isFormValid } from "./types";

const ORANGE = "#E8541C";

interface Props { form: FormState; submitting: boolean; onSubmit: () => void; }

export default function SubmitButton({ form, submitting, onSubmit }: Props) {
    const valid = isFormValid(form);
    return (
        <TouchableOpacity
            style={[styles.btn, !valid && styles.disabled]}
            onPress={onSubmit}
            disabled={!valid || submitting}
            activeOpacity={0.85}
        >
            {submitting
                ? <ActivityIndicator color="#fff" size="small" />
                : <><Text style={styles.text}>Kirim Laporan</Text><ChevronRight size={18} color="#fff" strokeWidth={2.5} /></>
            }
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: { backgroundColor: ORANGE, borderRadius: 12, paddingVertical: 15, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8, marginBottom: 24, shadowColor: ORANGE, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
    disabled: { backgroundColor: "#f0e6dc", shadowOpacity: 0, elevation: 0 },
    text: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
