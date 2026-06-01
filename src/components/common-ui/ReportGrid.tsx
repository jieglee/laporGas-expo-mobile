import { View, StyleSheet, Dimensions } from "react-native";
import type { Report } from "@/lib/report";
import ReportCard from "./ReportCard";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2; // 2 kolom dengan padding 16 kiri kanan + gap 16

interface Props {
    reports: Report[];
    variant?: "status" | "nearby";
}

export default function ReportGrid({ reports, variant = "status" }: Props) {
    // Pasangkan jadi baris 2 kolom
    const rows: Report[][] = [];
    for (let i = 0; i < reports.length; i += 2) {
        rows.push(reports.slice(i, i + 2));
    }

    return (
        <View style={styles.root}>
            {rows.map((row, i) => (
                <View key={i} style={styles.row}>
                    {row.map((report) => (
                        <View key={report.id} style={{ width: CARD_WIDTH }}>
                            <ReportCard report={report} variant={variant} compact />
                        </View>
                    ))}
                    {/* Kalau ganjil, isi dengan spacer */}
                    {row.length === 1 && <View style={{ width: CARD_WIDTH }} />}
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    root: { gap: 12 },
    row: { flexDirection: "row", gap: 16 },
});