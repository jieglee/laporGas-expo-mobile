import { View, Text, TextInput, StyleSheet } from "react-native";
import { FileText } from "lucide-react-native";

const ORANGE = "#E8541C";

interface Props { value: string; onChange: (v: string) => void; }

export default function DescriptionField({ value, onChange }: Props) {
    return (
        <View style={styles.field}>
            <View style={styles.label}>
                <View style={styles.icon}><FileText size={12} color={ORANGE} strokeWidth={2} /></View>
                <Text style={styles.labelText}>Deskripsi <Text style={{ color: ORANGE }}>*</Text></Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Min. 20 karakter. Jelaskan masalah secara detail."
                placeholderTextColor="#c9a892"
                value={value}
                onChangeText={onChange}
                multiline numberOfLines={4}
                textAlignVertical="top"
                maxLength={1000}
            />
            <Text style={styles.counter}>{value.length}/1000</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    field: { marginBottom: 20 },
    label: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 8 },
    icon: { width: 22, height: 22, borderRadius: 6, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center" },
    labelText: { fontSize: 12, fontWeight: "700", color: "#3d2817" },
    input: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11, fontSize: 14, color: "#1a0e08", minHeight: 100 },
    counter: { fontSize: 10, color: "#c9a892", textAlign: "right", marginTop: 4 },
});
