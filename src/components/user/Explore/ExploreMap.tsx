import { useMemo, useRef, useState } from "react";
import {
    View, Text, StyleSheet, Platform, Modal, TouchableOpacity,
    ScrollView
} from "react-native";
import { WebView } from "react-native-webview";
import { useRouter } from "expo-router";
import { X, MapPin, User, Calendar, ArrowBigUp } from "lucide-react-native";
import type { Report } from "@/lib/report";

const STATUS_COLORS: Record<string, string> = {
    pending:     "#F59E0B",
    approved:    "#3B82F6",
    on_progress: "#8B5CF6",
    completed:   "#10B981",
    rejected:    "#EF4444",
};
const STATUS_LABELS: Record<string, string> = {
    pending:     "Menunggu",
    approved:    "Disetujui",
    on_progress: "Diproses",
    completed:   "Selesai",
    rejected:    "Ditolak",
};

function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("id-ID", {
        day: "numeric", month: "short", year: "numeric",
    });
}

function buildMapHTML(reports: Report[]): string {
    const valid = reports.filter((r) => r.latitude && r.longitude);
    const center = valid.length > 0
        ? `[${valid[0].latitude}, ${valid[0].longitude}]`
        : `[-6.4, 106.8]`;

    const legend = Object.entries(STATUS_COLORS).map(([s, c]) =>
        `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">` +
        `<div style="width:9px;height:9px;border-radius:50%;background:${c}"></div>` +
        `<span style="font-size:10px;color:#6b5546">${STATUS_LABELS[s]}</span></div>`
    ).join("");

    const markers = valid.map((r) => {
        const color = STATUS_COLORS[r.status] ?? "#a8856b";
        const id = r.id;
        return `
(function() {
    var el = document.createElement('div');
    el.style.cssText = 'width:28px;height:28px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);cursor:pointer;pointer-events:auto;';
    var icon = L.divIcon({ className: 'custom-pin', html: el.outerHTML, iconSize:[28,28], iconAnchor:[14,28] });
    var marker = L.marker([${r.latitude},${r.longitude}], { icon: icon }).addTo(map);
    marker.on('click', function(e) {
        L.DomEvent.stopPropagation(e);
        var msg = String(${id});
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(msg);
        } else {
            window.parent.postMessage(msg, '*');
        }
    });
})();`;
    }).join("\n");

    const fitBounds = valid.length > 1
        ? `map.fitBounds([${valid.map((r) => `[${r.latitude},${r.longitude}]`).join(",")}],{padding:[40,40],maxZoom:14});`
        : "";

    return `<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body,#map{width:100%;height:100%;overflow:hidden;touch-action:auto}
.custom-pin{background:transparent!important;border:none!important;pointer-events:auto!important}
.leaflet-marker-icon{pointer-events:auto!important;cursor:pointer!important}
.leaflet-interactive{pointer-events:auto!important}
#legend{position:absolute;top:12px;left:12px;z-index:1000;background:rgba(255,255,255,0.95);border-radius:10px;border:0.5px solid #f0e6dc;padding:8px 10px;pointer-events:none}
#legend-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a8856b;margin-bottom:6px}
#count{position:absolute;top:12px;right:12px;z-index:1000;background:rgba(255,255,255,0.95);border-radius:10px;border:0.5px solid #f0e6dc;padding:6px 10px;font-size:11px;font-weight:600;color:#1a0e08;pointer-events:none}
</style>
</head>
<body>
<div id="map"></div>
<div id="legend"><div id="legend-title">STATUS</div>${legend}</div>
<script>
var map = L.map('map', {
    zoomControl: false,
    tap: true,
    tapTolerance: 15,
    touchZoom: true,
    dragging: true,
}).setView(${center}, 12);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{attribution:'&copy; CARTO'}).addTo(map);
${markers}
${fitBounds}
</script>
</body>
</html>`;
}

interface Props {
    reports: Report[];
}

export default function ExploreMap({ reports }: Props) {
    const router = useRouter();
    const html = useMemo(() => buildMapHTML(reports), [reports]);
    const [selected, setSelected] = useState<Report | null>(null);
    const iframeRef = useRef<any>(null);

    const handleId = (id: number) => {
        const report = reports.find((r) => r.id === id);
        if (report) setSelected(report);
    };

    // Web: listen postMessage dari iframe
    useMemo(() => {
        if (Platform.OS !== "web") return;
        const handler = (e: MessageEvent) => {
            const id = parseInt(e.data);
            if (!isNaN(id)) handleId(id);
        };
        window.addEventListener("message", handler);
        return () => window.removeEventListener("message", handler);
    }, [reports]);

    const statusColor = selected ? (STATUS_COLORS[selected.status] ?? "#a8856b") : "#a8856b";
    const statusLabel = selected ? (STATUS_LABELS[selected.status] ?? selected.status) : "";

    const BottomSheet = () => (
        <Modal
            visible={!!selected}
            transparent
            animationType="slide"
            statusBarTranslucent
            onRequestClose={() => setSelected(null)}
        >
            <View style={styles.modalWrap}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => setSelected(null)}
                />
                {selected && (
                    <View style={styles.sheet}>
                        <View style={styles.handle} />
                        <TouchableOpacity
                            style={styles.closeBtn}
                            onPress={() => setSelected(null)}
                            activeOpacity={0.7}
                        >
                            <X size={15} color="#6b5546" strokeWidth={2} />
                        </TouchableOpacity>

                        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                            {/* Badges */}
                            <View style={styles.badgeRow}>
                                <View style={[styles.badge, { backgroundColor: statusColor + "22" }]}>
                                    <View style={[styles.dot, { backgroundColor: statusColor }]} />
                                    <Text style={[styles.badgeText, { color: statusColor }]}>
                                        {statusLabel}
                                    </Text>
                                </View>
                                {selected.category_name && (
                                    <Text style={styles.categoryText}>· {selected.category_name}</Text>
                                )}
                            </View>

                            {/* Title */}
                            <Text style={styles.title}>{selected.title}</Text>

                            {/* Lokasi */}
                            {selected.location && (
                                <View style={styles.locationRow}>
                                    <MapPin size={12} color="#E8541C" strokeWidth={2} />
                                    <Text style={styles.locationText}>{selected.location}</Text>
                                </View>
                            )}

                            <View style={styles.divider} />

                            {/* Meta */}
                            <View style={styles.metaRow}>
                                <View style={styles.metaItem}>
                                    <User size={12} color="#a8856b" strokeWidth={1.8} />
                                    <Text style={styles.metaText}>{selected.user_name ?? "Anonim"}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Calendar size={12} color="#a8856b" strokeWidth={1.8} />
                                    <Text style={styles.metaText}>{fmtDate(selected.created_at)}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <ArrowBigUp size={12} color="#a8856b" strokeWidth={1.8} />
                                    <Text style={styles.metaText}>{selected.upvote_count ?? 0}</Text>
                                </View>
                            </View>

                            {/* CTA */}
                            <TouchableOpacity
                                style={styles.cta}
                                activeOpacity={0.85}
                                onPress={() => {
                                    setSelected(null);
                                    setTimeout(() => {
                                        router.push(`/laporan/${selected.id}` as any);
                                    }, 300);
                                }}
                            >
                                <Text style={styles.ctaText}>Lihat Detail →</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                )}
            </View>
        </Modal>
    );

    if (Platform.OS === "web") {
        return (
            <View style={styles.wrap}>
                {/* @ts-ignore */}
                <iframe
                    ref={iframeRef}
                    srcDoc={html}
                    style={{
                        position: "absolute",
                        top: 0, left: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                    }}
                />
                <BottomSheet />
            </View>
        );
    }

    return (
        <View style={styles.wrap}>
            <WebView
                style={styles.map}
                source={{ html }}
                originWhitelist={["*"]}
                javaScriptEnabled
                domStorageEnabled
                scrollEnabled={false}
                bounces={false}
                overScrollMode="never"
                onMessage={(e) => {
                    const id = parseInt(e.nativeEvent.data.trim());
                    if (!isNaN(id)) handleId(id);
                }}
            />
            <BottomSheet />
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: { flex: 1 },
    map: { flex: 1 },
    modalWrap: { flex: 1, justifyContent: "flex-end" },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    sheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 40,
        maxHeight: "78%",
    },
    handle: {
        width: 40, height: 4,
        backgroundColor: "#f0e6dc",
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 16,
    },
    closeBtn: {
        position: "absolute",
        top: 16, right: 20,
        width: 30, height: 30,
        borderRadius: 15,
        backgroundColor: "#f5ede3",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
    },
    badgeRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
    badge: {
        flexDirection: "row", alignItems: "center", gap: 5,
        paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99,
    },
    dot: { width: 6, height: 6, borderRadius: 3 },
    badgeText: { fontSize: 11, fontWeight: "700" },
    categoryText: { fontSize: 11, color: "#6b5546", fontWeight: "600" },
    title: {
        fontSize: 16, fontWeight: "800",
        color: "#1a0e08", letterSpacing: -0.3,
        marginBottom: 14, lineHeight: 22,
    },
    locationRow: { flexDirection: "row", alignItems: "flex-start", gap: 6, marginBottom: 10 },
    locationText: { fontSize: 12, color: "#a8856b", flex: 1, lineHeight: 18 },
    divider: { height: 0.5, backgroundColor: "#f0e6dc", marginVertical: 10 },
    metaRow: { flexDirection: "row", alignItems: "center", gap: 14, marginBottom: 16 },
    metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    metaText: { fontSize: 12, color: "#a8856b" },
    cta: {
        backgroundColor: "#E8541C",
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },
    ctaText: { color: "#fff", fontWeight: "700", fontSize: 14 },
});