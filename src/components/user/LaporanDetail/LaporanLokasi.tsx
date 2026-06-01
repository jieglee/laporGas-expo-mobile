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
                <MapPin size={14} color="#E8541C" strokeWidth={2} />
                <Text style={styles.label}>Lokasi Kejadian</Text>
            </View>

            <View style={styles.mapWrap}>
                {Platform.OS === "web" ? (
                    // @ts-ignore
                    <iframe
                        src={mapUrl}
                        width="100%"
                        height="200"
                        style={{ border: "none", display: "block" }}
                        loading="lazy"
                    />
                ) : (
                    // Lazy import biar ga crash di web
                    <NativeMap url={mapUrl} />
                )}
            </View>

            {report.location && (
                <View style={styles.addressRow}>
                    <MapPin size={11} color="#E8541C" strokeWidth={2} />
                    <Text style={styles.address}>{report.location}</Text>
                </View>
            )}
        </View>
    );
}

// Komponen terpisah untuk native agar WebView hanya di-import di native
function NativeMap({ url }: { url: string }) {
    const WebView = require("react-native-webview").WebView;
    return (
        <WebView
            source={{ uri: url }}
            style={{ height: 200 }}
            scrollEnabled={false}
        />
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", borderWidth: 0.5, borderColor: "#f0e6dc" },
    headerRow: { flexDirection: "row", alignItems: "center", gap: 6, padding: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0e6dc" },
    label: { fontSize: 13, fontWeight: "700", color: "#3d2817" },
    mapWrap: { height: 200 },
    addressRow: { flexDirection: "row", alignItems: "flex-start", gap: 6, padding: 12, borderTopWidth: 0.5, borderTopColor: "#f0e6dc" },
    address: { fontSize: 12, color: "#6b5546", flex: 1, lineHeight: 18 },
    empty: { backgroundColor: "#fff", borderRadius: 16, padding: 24, alignItems: "center", gap: 8, borderWidth: 0.5, borderColor: "#f0e6dc" },
    emptyIcon: { width: 40, height: 40, borderRadius: 99, backgroundColor: "#FFF5EE", alignItems: "center", justifyContent: "center" },
    emptyText: { fontSize: 13, color: "#a8856b" },
});