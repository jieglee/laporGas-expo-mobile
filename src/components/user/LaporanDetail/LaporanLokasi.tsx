import { View, Text, StyleSheet } from "react-native";
import { MapPin } from "lucide-react-native";
import { WebView } from "react-native-webview";
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

    const mapHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                * { margin: 0; padding: 0; }
                html, body { width: 100%; height: 100%; }
                iframe { width: 100%; height: 100%; border: none; display: block; }
            </style>
        </head>
        <body>
            <iframe
                src="https://maps.google.com/maps?q=${report.latitude},${report.longitude}&z=15&output=embed"
                loading="lazy"
            ></iframe>
        </body>
        </html>
    `;

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.headerIcon}>
                    <MapPin size={13} color="#E8541C" strokeWidth={2} />
                </View>
                <Text style={styles.label}>Lokasi Kejadian</Text>
            </View>

            <View style={styles.mapWrap}>
                <WebView
                    source={{ html: mapHtml }}
                    style={styles.webview}
                    scrollEnabled={false}
                    scalesPageToFit={false}
                    originWhitelist={['*']}
                />
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
    webview: { flex: 1 },
    addressRow: { padding: 14, borderTopWidth: 0.5, borderTopColor: "#f5ede3" },
    address: { fontSize: 12, color: "#6b5546", lineHeight: 18 },
    empty: { backgroundColor: "#fff", borderRadius: 20, padding: 28, alignItems: "center", gap: 8, borderWidth: 0.5, borderColor: "#f0e6dc" },
    emptyIcon: { width: 44, height: 44, borderRadius: 99, backgroundColor: "#FFF5EE", alignItems: "center", justifyContent: "center" },
    emptyText: { fontSize: 13, color: "#a8856b" },
});