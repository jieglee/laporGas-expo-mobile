import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Search, X, Map, Building2, Landmark, Trash2, TrafficCone } from "lucide-react-native";
import { type Kategori, KATEGORI_TABS } from "./types";

const ORANGE = "#E8541C";

const ICONS: Record<Kategori, any> = {
    "all":            Map,
    "infrastruktur":  Building2,
    "fasilitas-umum": Landmark,
    "kebersihan":     Trash2,
    "lalu-lintas":    TrafficCone,
};

interface Props {
    search: string;
    onSearch: (v: string) => void;
    kategori: Kategori;
    onKategori: (v: Kategori) => void;
    totalCount: number;
}

export default function ExploreHeader({ search, onSearch, kategori, onKategori, totalCount }: Props) {
    return (
        <View style={styles.header}>
            <Text style={styles.title}>Explore</Text>
            <Text style={styles.subtitle}>
                <Text style={{ color: ORANGE, fontWeight: "700" }}>{totalCount}</Text>
                {" "}laporan dari komunitas
            </Text>

            <View style={styles.searchWrap}>
                <Search size={15} color="#a8856b" strokeWidth={2} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Cari laporan, lokasi, pelapor..."
                    placeholderTextColor="#c9a892"
                    value={search}
                    onChangeText={onSearch}
                    autoCorrect={false}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => onSearch("")} style={styles.searchClear}>
                        <X size={12} color="#a8856b" />
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {KATEGORI_TABS.map((tab) => {
                    const active = kategori === tab.value;
                    const Icon = ICONS[tab.value];
                    return (
                        <TouchableOpacity
                            key={tab.value}
                            style={[styles.tab, active && styles.tabActive]}
                            onPress={() => onKategori(tab.value)}
                            activeOpacity={0.8}
                        >
                            <Icon size={13} color={active ? "#fff" : "#6b5546"} strokeWidth={2} />
                            <Text style={[styles.tabText, active && styles.tabTextActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: { backgroundColor: "#fff", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, borderBottomWidth: 0.5, borderBottomColor: "#f0e6dc" },
    title: { fontSize: 26, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.5 },
    subtitle: { fontSize: 13, color: "#a8856b", marginTop: 2, marginBottom: 14 },
    searchWrap: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#fafaf8", borderWidth: 0.5, borderColor: "#f0e6dc", borderRadius: 12, paddingHorizontal: 14, height: 44, marginBottom: 12 },
    searchInput: { flex: 1, fontSize: 14, color: "#1a0e08" },
    searchClear: { width: 22, height: 22, borderRadius: 99, backgroundColor: "#f0e6dc", alignItems: "center", justifyContent: "center" },
    tab: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, borderWidth: 1.5, borderColor: "#f0e6dc", backgroundColor: "#fff", marginRight: 8 },
    tabActive: { backgroundColor: ORANGE, borderColor: ORANGE, shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.28, shadowRadius: 8, elevation: 4 },
    tabText: { fontSize: 12, fontWeight: "600", color: "#6b5546" },
    tabTextActive: { color: "#fff", fontWeight: "700" },
});