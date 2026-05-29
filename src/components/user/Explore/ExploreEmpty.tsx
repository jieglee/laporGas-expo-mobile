import { View, Text, StyleSheet } from "react-native";
import { Search } from "lucide-react-native";

const ORANGE = "#E8541C";

export default function ExploreEmpty() {
    return (
        <View style={styles.root}>
            <View style={styles.icon}>
                <Search size={22} color={ORANGE} strokeWidth={1.8} />
            </View>
            <Text style={styles.title}>Tidak ada laporan ditemukan</Text>
            <Text style={styles.sub}>Coba ubah kata kunci atau kategori</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    root: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
    icon: { width: 52, height: 52, borderRadius: 99, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center", marginBottom: 14 },
    title: { fontSize: 15, fontWeight: "700", color: "#1a0e08", marginBottom: 6 },
    sub: { fontSize: 13, color: "#a8856b", textAlign: "center" },
});