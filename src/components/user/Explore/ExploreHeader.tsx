import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Search, X, Map, Building2, Landmark, Trash2, Car } from "lucide-react-native";
import { type Kategori, KATEGORI_TABS } from "./types";

interface Props {
    search: string;
    onSearch: (v: string) => void;
    kategori: Kategori;
    onKategori: (v: Kategori) => void;
    totalCount: number;
}

const KATEGORI_ICONS: Record<Kategori, React.ReactNode> = {
    all:              <Map size={13} color="inherit" strokeWidth={2} />,
    infrastruktur:    <Building2 size={13} color="inherit" strokeWidth={2} />,
    "fasilitas-umum": <Landmark size={13} color="inherit" strokeWidth={2} />,
    kebersihan:       <Trash2 size={13} color="inherit" strokeWidth={2} />,
    "lalu-lintas":    <Car size={13} color="inherit" strokeWidth={2} />,
};

const ORANGE = "#E8541C";

export default function ExploreHeader({ search, onSearch, kategori, onKategori, totalCount }: Props) {
    return (
        <View style={styles.root}>
            {/* Title */}
            <View style={styles.titleRow}>
                <Text style={styles.title}>Explore</Text>
                <Text style={styles.subtitle}>
                    <Text style={styles.count}>{totalCount}</Text> laporan dari komunitas
                </Text>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
                <Search size={15} color="#a8856b" strokeWidth={2} style={styles.searchIcon} />
                <TextInput
                    value={search}
                    onChangeText={onSearch}
                    placeholder="Filter laporan di peta..."
                    placeholderTextColor="#c9a892"
                    style={styles.searchInput}
                />
                {search.length > 0 && (
                    <TouchableOpacity onPress={() => onSearch("")} style={styles.clearBtn} activeOpacity={0.7}>
                        <X size={12} color="#a8856b" strokeWidth={2} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Kategori tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.tabList}
            >
                {KATEGORI_TABS.map((tab) => {
                    const active = kategori === tab.value;
                    const Icon = KATEGORI_ICONS[tab.value];
                    return (
                        <TouchableOpacity
                            key={tab.value}
                            onPress={() => onKategori(tab.value)}
                            activeOpacity={0.75}
                            style={[styles.tab, active ? styles.tabActive : styles.tabInactive]}
                        >
                            <View style={{ opacity: active ? 1 : 0.6 }}>
                                {Icon}
                            </View>
                            <Text style={[styles.tabText, active ? styles.tabTextActive : styles.tabTextInactive]}>
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
    root: {
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: "#f0e6dc",
    },
    titleRow: { marginBottom: 14 },
    title: {
        fontSize: 26,
        fontWeight: "800",
        color: "#1a0e08",
        letterSpacing: -0.5,
        marginBottom: 2,
    },
    subtitle: { fontSize: 13, color: "#a8856b" },
    count: { fontWeight: "700", color: ORANGE },

    searchWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fafaf8",
        borderWidth: 0.5,
        borderColor: "#f0e6dc",
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        marginBottom: 12,
    },
    searchIcon: { marginRight: 8 },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: "#1a0e08",
        height: "100%",
    },
    clearBtn: {
        width: 24, height: 24,
        borderRadius: 12,
        backgroundColor: "#f0e6dc",
        alignItems: "center",
        justifyContent: "center",
    },

    tabList: { gap: 8, paddingBottom: 2 },
    tab: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 99,
        borderWidth: 1.5,
    },
    tabActive: {
        backgroundColor: ORANGE,
        borderColor: ORANGE,
        shadowColor: ORANGE,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 8,
        elevation: 4,
    },
    tabInactive: {
        backgroundColor: "#fff",
        borderColor: "#f0e6dc",
    },
    tabText: { fontSize: 12, fontWeight: "600" },
    tabTextActive: { color: "#fff", fontWeight: "700" },
    tabTextInactive: { color: "#6b5546" },
});