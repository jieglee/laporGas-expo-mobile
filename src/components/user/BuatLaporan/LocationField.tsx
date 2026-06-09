import { useState, useEffect } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ActivityIndicator, Alert, Platform,
} from "react-native";
import * as Location from "expo-location";
import { MapPin, Search, X, Navigation } from "lucide-react-native";

const ORANGE = "#E8541C";

// Lazy load WebView hanya untuk native
const WebView = Platform.OS !== "web"
    ? require("react-native-webview").WebView
    : null;

interface NominatimResult {
    place_id: number;
    display_name: string;
    lat: string;
    lon: string;
}

interface Props {
    location: string;
    latitude: string;
    longitude: string;
    onChange: (lat: string, lng: string, address: string) => void;
}

function getLeafletHTML(lat: number, lng: number) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>* { margin:0; padding:0; } #map { width:100vw; height:100vh; }</style>
</head>
<body>
  <div id="map"></div>
  <script>
    const map = L.map('map', { zoomControl:false, attributionControl:false }).setView([${lat},${lng}], 15);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { subdomains:'abcd', maxZoom:20 }).addTo(map);
    const icon = L.divIcon({ html:'<div style="width:16px;height:16px;border-radius:50%;background:#E8541C;border:3px solid white;box-shadow:0 2px 8px rgba(232,84,28,0.4)"></div>', iconSize:[16,16], iconAnchor:[8,8], className:'' });
    L.marker([${lat},${lng}], { icon }).addTo(map);
  </script>
</body>
</html>`;
}

export default function LocationField({ location, latitude, longitude, onChange }: Props) {
    const [query, setQuery] = useState(location || "");
    const [results, setResults] = useState<NominatimResult[]>([]);
    const [searching, setSearching] = useState(false);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (location && !query) setQuery(location);
    }, [location]);

    const doSearch = async (q: string) => {
        if (q.trim().length < 3) { setResults([]); setShowDropdown(false); return; }
        try {
            setSearching(true);
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&countrycodes=id`,
                { headers: { "Accept-Language": "id" } }
            );
            const data: NominatimResult[] = await res.json();
            setResults(data);
            setShowDropdown(data.length > 0);
        } catch { setResults([]); }
        finally { setSearching(false); }
    };

    const pick = (r: NominatimResult) => {
        const short = r.display_name.split(",").slice(0, 3).join(", ");
        setQuery(short);
        setResults([]);
        setShowDropdown(false);
        onChange(r.lat, r.lon, r.display_name);
    };

    const clear = () => {
        setQuery(""); setResults([]); setShowDropdown(false);
        onChange("", "", "");
    };

    const reverseGeocode = async (lat: number, lng: number) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=id`
            );
            const data = await res.json();
            return data.display_name ?? `${lat}, ${lng}`;
        } catch {
            return `${lat}, ${lng}`;
        }
    };

    const getGPS = async () => {
        try {
            setGpsLoading(true);
            if (Platform.OS === "web") {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        const { latitude: lat, longitude: lng } = pos.coords;
                        const address = await reverseGeocode(lat, lng);
                        const short = address.split(",").slice(0, 3).join(", ");
                        setQuery(short);
                        onChange(String(lat), String(lng), address);
                        setGpsLoading(false);
                    },
                    () => { Alert.alert("Gagal", "Pastikan GPS aktif."); setGpsLoading(false); }
                );
                return;
            }
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") { Alert.alert("Izin lokasi diperlukan"); setGpsLoading(false); return; }
            const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
            const { latitude: lat, longitude: lng } = loc.coords;
            const address = await reverseGeocode(lat, lng);
            const short = address.split(",").slice(0, 3).join(", ");
            setQuery(short);
            onChange(String(lat), String(lng), address);
        } catch { Alert.alert("Gagal mendapatkan lokasi"); }
        finally { setGpsLoading(false); }
    };

    const hasLocation = !!latitude && !!longitude;

    // Render map berdasarkan platform
    const renderMap = () => {
        if (!hasLocation) {
            return (
                <View style={styles.mapPlaceholder}>
                    <View style={styles.placeholderIcon}>
                        <MapPin size={20} color={ORANGE} strokeWidth={1.8} />
                    </View>
                    <Text style={styles.placeholderText}>
                        Cari lokasi atau tekan{" "}
                        <Text style={{ color: ORANGE, fontWeight: "700" }}>GPS</Text>
                        {" "}untuk lokasi saat ini
                    </Text>
                </View>
            );
        }

        return (
            <>
                {Platform.OS === "web" ? (
                    // @ts-ignore — iframe hanya untuk web
                    <iframe
                        src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
                        width="100%"
                        height="180"
                        style={{ border: "none", display: "block" }}
                        loading="lazy"
                    />
                ) : (
                    WebView && (
                        <WebView
                            style={styles.map}
                            source={{ html: getLeafletHTML(parseFloat(latitude), parseFloat(longitude)) }}
                            scrollEnabled={false}
                            javaScriptEnabled
                        />
                    )
                )}
                <View style={styles.addressBadge}>
                    <MapPin size={11} color={ORANGE} strokeWidth={2} />
                    <Text style={styles.addressText} numberOfLines={2}>{location}</Text>
                </View>
            </>
        );
    };

    return (
        <View style={styles.field}>
            <View style={styles.labelRow}>
                <View style={styles.icon}><MapPin size={12} color={ORANGE} strokeWidth={2} /></View>
                <Text style={styles.labelText}>Lokasi kejadian <Text style={{ color: ORANGE }}>*</Text></Text>
            </View>

            {/* Search + GPS */}
            <View style={styles.searchRow}>
                <View style={styles.searchWrap}>
                    {searching
                        ? <ActivityIndicator size="small" color={ORANGE} style={{ marginLeft: 12 }} />
                        : <Search size={15} color="#a8856b" strokeWidth={2} style={{ marginLeft: 12 }} />
                    }
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Cari lokasi..."
                        placeholderTextColor="#c9a892"
                        value={query}
                        onChangeText={(v) => { setQuery(v); doSearch(v); }}
                        onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={clear} style={styles.clearBtn}>
                            <X size={12} color="#a8856b" />
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity style={styles.gpsBtn} onPress={getGPS} disabled={gpsLoading} activeOpacity={0.8}>
                    {gpsLoading
                        ? <ActivityIndicator size="small" color="#fff" />
                        : <Navigation size={16} color="#fff" strokeWidth={2} />
                    }
                </TouchableOpacity>
            </View>

            {/* Dropdown */}
            {showDropdown && results.length > 0 && (
                <View style={styles.dropdown}>
                    {results.map((r, i) => {
                        const parts = r.display_name.split(",");
                        return (
                            <TouchableOpacity
                                key={r.place_id}
                                style={[styles.dropItem, i > 0 && styles.dropBorder]}
                                onPress={() => pick(r)}
                                activeOpacity={0.8}
                            >
                                <MapPin size={13} color={ORANGE} strokeWidth={2} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.dropMain} numberOfLines={1}>{parts.slice(0, 2).join(",").trim()}</Text>
                                    {parts.length > 2 && <Text style={styles.dropSub} numberOfLines={1}>{parts.slice(2, 5).join(",").trim()}</Text>}
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}

            {/* Map */}
            <View style={styles.mapWrap}>
                {renderMap()}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    field: { marginBottom: 20 },
    labelRow: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 8 },
    icon: { width: 22, height: 22, borderRadius: 6, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center" },
    labelText: { fontSize: 12, fontWeight: "700", color: "#3d2817" },
    searchRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
    searchWrap: { flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 10, height: 44 },
    searchInput: { flex: 1, fontSize: 14, color: "#1a0e08", paddingHorizontal: 10 },
    clearBtn: { width: 28, height: 28, alignItems: "center", justifyContent: "center", marginRight: 4 },
    gpsBtn: { width: 44, height: 44, borderRadius: 10, backgroundColor: ORANGE, alignItems: "center", justifyContent: "center", shadowColor: ORANGE, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3 },
    dropdown: { backgroundColor: "#fff", borderWidth: 1, borderColor: "#f0e6dc", borderRadius: 10, overflow: "hidden", marginBottom: 8, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
    dropItem: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12 },
    dropBorder: { borderTopWidth: 0.5, borderTopColor: "#f5ede3" },
    dropMain: { fontSize: 13, fontWeight: "600", color: "#1a0e08" },
    dropSub: { fontSize: 11, color: "#a8856b", marginTop: 1 },
    mapWrap: { borderRadius: 12, overflow: "hidden", borderWidth: 0.5, borderColor: "#f0e6dc", height: 180 },
    map: { width: "100%", height: "100%" },
    addressBadge: { position: "absolute", bottom: 8, left: 8, right: 8, backgroundColor: "rgba(255,255,255,0.95)", borderRadius: 8, padding: 8, flexDirection: "row", alignItems: "flex-start", gap: 6, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
    addressText: { fontSize: 11, color: "#3d2817", flex: 1, lineHeight: 16 },
    mapPlaceholder: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#fafaf8", gap: 10, padding: 20 },
    placeholderIcon: { width: 44, height: 44, borderRadius: 99, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center" },
    placeholderText: { fontSize: 13, color: "#6b5546", textAlign: "center", lineHeight: 20 },
});