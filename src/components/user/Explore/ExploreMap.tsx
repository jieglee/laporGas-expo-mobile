import { useMemo } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { WebView } from "react-native-webview";
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

function buildMapHTML(reports: Report[]): string {
    const valid = reports.filter((r) => r.latitude && r.longitude);
    const center = valid.length > 0
        ? `[${valid[0].latitude}, ${valid[0].longitude}]`
        : `[-6.4, 106.8]`;

    const markers = valid.map((r) => {
        const color = STATUS_COLORS[r.status] ?? "#a8856b";
        const label = STATUS_LABELS[r.status] ?? r.status;
        const title = (r.title ?? "").replace(/'/g, "\\'").replace(/"/g, "&quot;");
        const loc = (r.location ?? "Lokasi tidak tersedia").replace(/'/g, "\\'");
        const user = (r.user_name ?? "Anonim").replace(/'/g, "\\'");
        const cat = r.category_name ? `· ${r.category_name}` : "";
        const upvote = r.upvote_count ?? 0;
        const img = r.image_url
            ? `<img src='${r.image_url}' style='width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px;display:block'/>`
            : "";

        return `
L.marker([${r.latitude},${r.longitude}], {
    icon: L.divIcon({
        className: '',
        html: '<div style="width:26px;height:26px;background:${color};border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:2.5px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.25);"></div>',
        iconSize: [26,26], iconAnchor: [13,26], popupAnchor: [0,-30]
    })
}).addTo(map).bindPopup(
    '<div style="font-family:system-ui;min-width:190px;padding:2px">' +
    '<div style="display:flex;align-items:center;gap:4px;margin-bottom:8px;flex-wrap:wrap">' +
        '<span style="display:inline-flex;align-items:center;gap:3px;font-size:10px;font-weight:700;background:${color}25;color:${color};border-radius:99px;padding:2px 7px">' +
            '<span style="width:4px;height:4px;border-radius:50%;background:${color};display:inline-block"></span>${label}' +
        '</span>' +
        '<span style="font-size:10px;color:#6b5546;font-weight:600">${cat}</span>' +
    '</div>' +
    '<p style="font-size:13px;font-weight:700;color:#1a0e08;margin:0 0 6px;line-height:1.4">${title}</p>' +
    '${img}' +
    '<p style="font-size:11px;color:#a8856b;margin:0 0 6px">📍 ${loc}</p>' +
    '<div style="display:flex;gap:8px;font-size:11px;color:#a8856b;border-top:0.5px solid #f0e6dc;padding-top:6px">' +
        '<span>👤 ${user}</span><span>↑ ${upvote}</span>' +
    '</div>' +
    '<a onclick="window.ReactNativeWebView.postMessage(\'${r.id}\')" style="display:block;margin-top:10px;background:#E8541C;color:#fff;text-align:center;border-radius:8px;padding:7px 12px;font-size:12px;font-weight:700;text-decoration:none;cursor:pointer">Lihat Detail →</a>' +
    '</div>'
);`;
    }).join("\n");

    const legend = Object.entries(STATUS_COLORS).map(([s, c]) =>
        `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px">` +
        `<div style="width:9px;height:9px;border-radius:50%;background:${c}"></div>` +
        `<span style="font-size:10px;color:#6b5546">${STATUS_LABELS[s]}</span></div>`
    ).join("");

    const fitBounds = valid.length > 1
        ? `map.fitBounds([${valid.map((r) => `[${r.latitude},${r.longitude}]`).join(",")}], {padding:[40,40],maxZoom:14});`
        : "";

    return `<!DOCTYPE html><html>
<head>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
html,body,#map{width:100%;height:100%}
.leaflet-popup-content-wrapper{border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,0.12);border:0.5px solid #f0e6dc}
.leaflet-popup-tip{background:white}
#legend{position:absolute;top:12px;left:12px;z-index:1000;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);border-radius:10px;border:0.5px solid #f0e6dc;padding:8px 10px;box-shadow:0 2px 8px rgba(0,0,0,0.06)}
#legend-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a8856b;margin-bottom:6px}
#count{position:absolute;top:12px;right:12px;z-index:1000;background:rgba(255,255,255,0.92);backdrop-filter:blur(8px);border-radius:10px;border:0.5px solid #f0e6dc;padding:6px 10px;box-shadow:0 2px 8px rgba(0,0,0,0.06);font-size:11px;font-weight:600;color:#1a0e08}
</style>
</head>
<body>
<div id="map"></div>
<div id="legend"><div id="legend-title">STATUS</div>${legend}</div>
<div id="count">${valid.length} laporan di peta</div>
<script>
var map = L.map('map',{zoomControl:false}).setView(${center},12);
L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{attribution:'&copy; CARTO'}).addTo(map);
${markers}
${fitBounds}
</script>
</body></html>`;
}

interface Props {
    reports: Report[];
    onPressReport?: (id: number) => void;
}

export default function ExploreMap({ reports, onPressReport }: Props) {
    const valid = reports.filter((r) => r.latitude && r.longitude);
    const html = useMemo(() => buildMapHTML(reports), [reports]);

    if (Platform.OS === "web") {
        return (
            <View style={styles.fallback}>
                <Text style={styles.fallbackText}>Buka di device untuk melihat peta</Text>
            </View>
        );
    }

    return (
        <WebView
            style={styles.map}
            source={{ html }}
            scrollEnabled={false}
            originWhitelist={["*"]}
            javaScriptEnabled
            onMessage={(e) => {
                const id = parseInt(e.nativeEvent.data);
                if (!isNaN(id)) onPressReport?.(id);
            }}
        />
    );
}

const styles = StyleSheet.create({
    map: { flex: 1 },
    fallback: { flex: 1, alignItems: "center", justifyContent: "center" },
    fallbackText: { fontSize: 13, color: "#a8856b" },
});