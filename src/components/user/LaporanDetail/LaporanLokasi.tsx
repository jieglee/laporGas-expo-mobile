import { View, Text, StyleSheet, Platform } from "react-native";
import { MapPin } from "lucide-react-native";
import type { Report } from "@/lib/report";

export default function LaporanLokasi({ report }: { report: Report }) {
    if (!report.latitude || !report.longitude) return (
        <View style={styles.empty}>
            <View style={styles.emptyIcon}>
                <MapPin size={18} color="#E8541C" strokeWidth={1.8} />
            </View>
            <Text style={styles.emptyText}>Lokasi tidak tersedia</Text>
        </View>
    );

    const mapUrl = `https://maps.google.com/maps?q=${report.latitude},${report.longitude}&z=15&output=embed`;

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.headerIcon}>
                    <MapPin size={13} color="#E8541C" strokeWidth={2} />
                </View>
                <Text style={styles.label}>Lokasi Kejadian</Text>
            </View>

            <View style={styles.mapWrap}>
                {Platform.OS === "web" ? (
                    // @ts-ignore
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="200"
                        style={{ border: "none", display: "block", width: "100%", height: "100%" }}
                        loading="lazy"
                    />
                ) : (
                    <Text style={styles.nativeText}>Buka di perangkat untuk melihat peta</Text>
                )}
            </View>

            {report.location && (
                <View style={styles.addressRow}>
                    <Text style={styles.address}>{report.location}</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", borderWidth: 0.5, borderColor: "#f0e6dc" },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 8, padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f5ede3" },
    headerIcon: { width: 26, height: 26, borderRadius: 8, backgroundColor: "#FFF5EE", alignItems: "center", justifyContent: "center" },
    label: { fontSize: 13, fontWeight: "700", color: "#1a0e08" },
    mapWrap: { height: 200 },
    nativeText: { padding: 16, color: "#a8856b", fontSize: 12, textAlign: "center", marginTop: 60 },
    addressRow: { padding: 14, borderTopWidth: 0.5, borderTopColor: "#f5ede3" },
    address: { fontSize: 12, color: "#6b5546", lineHeight: 18 },
    empty: { backgroundColor: "#fff", borderRadius: 20, padding: 28, alignItems: "center", gap: 8, borderWidth: 0.5, borderColor: "#f0e6dc" },
    emptyIcon: { width: 44, height: 44, borderRadius: 99, backgroundColor: "#FFF5EE", alignItems: "center", justifyContent: "center" },
    emptyText: { fontSize: 13, color: "#a8856b" },
});