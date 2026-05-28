import { useEffect, useMemo, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl,
} from "react-native";
import { useRouter } from "expo-router";
import { Construction, Building2, Trash2, Car, ArrowRight, Flame, MessageCircle, MapPin } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth.store";
import { getReports, type Report } from "@/lib/report";
import ReportCard from "@/components/common-ui/ReportCard";
import { STATUS_CFG } from "@/constants/report-config";

const ORANGE = "#E8541C";

const CATEGORIES = [
  { id: "1", label: "Infrastruktur", icon: Construction },
  { id: "2", label: "Fasilitas Umum", icon: Building2 },
  { id: "3", label: "Kebersihan", icon: Trash2 },
  { id: "4", label: "Lalu Lintas", icon: Car },
];

function fmt(n: number) {
  return n >= 1000 ? (n / 1000).toFixed(1) + "K" : String(n);
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 11) return "Selamat pagi";
  if (h < 15) return "Selamat siang";
  if (h < 18) return "Selamat sore";
  return "Selamat malam";
}

export default function BerandaPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const firstName = user?.name?.split(" ")[0] ?? "Warga";

  const fetchReports = async () => {
    try {
      const data = await getReports({ sort: "newest" });
      setReports(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { fetchReports(); }, []);

  const nearbyReports = useMemo(() => reports.slice(0, 3), [reports]);
  const trendingReports = useMemo(() =>
    [...reports].sort((a, b) => (b.comment_count ?? 0) - (a.comment_count ?? 0)).slice(0, 5),
    [reports]
  );

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchReports(); }} tintColor={ORANGE} />}
      >
        {/* ── HERO ── */}
        <View style={styles.hero}>
          <Text style={styles.greeting}>{getGreeting()}, {firstName} 👋</Text>
          <Text style={styles.heroTitle}>
            Suara yang biasanya{" "}
            <Text style={{ color: ORANGE, fontStyle: "italic" }}>terabaikan</Text>.
          </Text>
          <Text style={styles.heroSub}>
            Lihat laporan di sekitar, dukung yang penting, atau buat laporan baru.
          </Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => router.push("/(tabs)/buat-laporan" as any)}
            activeOpacity={0.85}
          >
            <Text style={styles.heroBtnText}>Buat Laporan</Text>
            <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {/* ── KATEGORI ── */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Jelajahi Kategori</Text>
            <Text style={styles.sectionSub}>Pilih kategori untuk lihat laporan sejenis</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={styles.categoryCard}
                    onPress={() => router.push(`/(tabs)/explore?kategori=${cat.id}` as any)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.categoryIcon}>
                      <Icon size={20} color={ORANGE} strokeWidth={1.8} />
                    </View>
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {loading ? (
            <ActivityIndicator color={ORANGE} style={{ marginVertical: 32 }} />
          ) : (
            <>
              {/* ── NEARBY ── */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View>
                    <Text style={styles.sectionTitle}>Di sekitar kamu</Text>
                    <Text style={styles.sectionSub}>Laporan terbaru dari lokasi terdekat</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.seeAll}
                    onPress={() => router.push("/(tabs)/explore" as any)}
                  >
                    <Text style={styles.seeAllText}>Lihat semua</Text>
                    <ArrowRight size={13} color={ORANGE} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
                {nearbyReports.map((r) => (
                  <ReportCard key={r.id} report={r} variant="nearby" distance="< 1 km" />
                ))}
              </View>

              {/* ── TRENDING ── */}
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                      <Text style={styles.sectionTitle}>Trending minggu ini</Text>
                      <Flame size={16} color={ORANGE} />
                    </View>
                    <Text style={styles.sectionSub}>Paling banyak dikomentari warga</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.seeAll}
                    onPress={() => router.push("/(tabs)/explore" as any)}
                  >
                    <Text style={styles.seeAllText}>Lihat semua</Text>
                    <ArrowRight size={13} color={ORANGE} strokeWidth={2} />
                  </TouchableOpacity>
                </View>

                <View style={styles.trendingCard}>
                  {trendingReports.map((r, idx) => {
                    const s = STATUS_CFG[r.status] ?? { label: r.status, color: "#374151", bg: "#F3F4F6" };
                    return (
                      <TouchableOpacity
                        key={r.id}
                        style={[styles.trendingItem, idx < trendingReports.length - 1 && styles.trendingBorder]}
                        onPress={() => router.push(`/laporan/${r.id}` as any)}
                        activeOpacity={0.8}
                      >
                        <View style={styles.trendingRank}>
                          <Text style={styles.trendingRankText}>{idx + 1}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 }}>
                            <Text style={styles.trendingCat}>{r.category_name ?? "Umum"}</Text>
                            <Text style={[styles.trendingStatus, { color: s.color }]}>· {s.label}</Text>
                          </View>
                          <Text style={styles.trendingTitle} numberOfLines={1}>{r.title}</Text>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 3, marginTop: 2 }}>
                            <MapPin size={10} color="#9CA3AF" />
                            <Text style={styles.trendingLoc} numberOfLines={1}>{r.location ?? "Lokasi tidak diketahui"}</Text>
                          </View>
                        </View>
                        <View style={styles.trendingCount}>
                          <MessageCircle size={12} color="#6B7280" />
                          <Text style={styles.trendingCountText}>{r.comment_count ?? 0}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* ── CTA ── */}
              <View style={styles.cta}>
                <View style={styles.ctaGlow} />
                <Text style={styles.ctaBadgeText}>Mulai Sekarang</Text>
                <Text style={styles.ctaTitle}>
                  Masalahmu penting.{"\n"}
                  <Text style={{ color: ORANGE }}>Suaramu didengar.</Text>
                </Text>
                <Text style={styles.ctaSub}>
                  Satu laporan bisa mengubah kondisi ribuan orang di sekitarmu.
                </Text>
                <TouchableOpacity
                  style={styles.ctaBtn}
                  onPress={() => router.push("/(tabs)/buat-laporan" as any)}
                  activeOpacity={0.85}
                >
                  <Text style={styles.ctaBtnText}>Buat Laporan Sekarang</Text>
                  <ArrowRight size={16} color="#fff" strokeWidth={2.5} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#FFFCFA" },

  // Hero
  hero: {
    backgroundColor: "#fff", paddingHorizontal: 20, paddingTop: 24, paddingBottom: 28,
    borderBottomWidth: 0.5, borderBottomColor: "#f0e6dc",
  },
  greeting: { fontSize: 13, fontWeight: "600", color: ORANGE, marginBottom: 8 },
  heroTitle: { fontSize: 26, fontWeight: "800", color: "#1a0e08", lineHeight: 32, marginBottom: 8, letterSpacing: -0.5 },
  heroSub: { fontSize: 13, color: "#6B7280", lineHeight: 20, marginBottom: 20 },
  heroBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: ORANGE, borderRadius: 99, paddingHorizontal: 20, paddingVertical: 12,
    alignSelf: "flex-start",
    shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  heroBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },

  body: { padding: 16, gap: 8 },

  // Section
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1a0e08", letterSpacing: -0.3 },
  sectionSub: { fontSize: 12, color: "#a8856b", marginTop: 2 },
  seeAll: { flexDirection: "row", alignItems: "center", gap: 3, marginTop: 4 },
  seeAllText: { fontSize: 12, fontWeight: "600", color: ORANGE },

  // Category
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 14 },
  categoryCard: {
    width: "47%", backgroundColor: "#fff", borderRadius: 16,
    borderWidth: 0.5, borderColor: "#f0e6dc",
    padding: 16, alignItems: "center", gap: 10,
  },
  categoryIcon: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: "rgba(255,107,53,0.08)",
    alignItems: "center", justifyContent: "center",
  },
  categoryLabel: { fontSize: 13, fontWeight: "600", color: "#3d2817" },

  // Trending
  trendingCard: {
    backgroundColor: "#fff", borderRadius: 16,
    borderWidth: 0.5, borderColor: "#f0e6dc", overflow: "hidden",
  },
  trendingItem: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  trendingBorder: { borderBottomWidth: 0.5, borderBottomColor: "#f5f5f5" },
  trendingRank: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: "#FFF5EE", alignItems: "center", justifyContent: "center",
  },
  trendingRankText: { fontSize: 13, fontWeight: "800", color: ORANGE },
  trendingCat: { fontSize: 10, fontWeight: "600", color: ORANGE, textTransform: "uppercase" },
  trendingStatus: { fontSize: 10, fontWeight: "600" },
  trendingTitle: { fontSize: 13, fontWeight: "600", color: "#111827" },
  trendingLoc: { fontSize: 11, color: "#9CA3AF" },
  trendingCount: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "#F3F4F6", borderRadius: 99, paddingHorizontal: 10, paddingVertical: 5,
  },
  trendingCountText: { fontSize: 11, fontWeight: "600", color: "#6B7280" },

  // CTA
  cta: {
    backgroundColor: "#1a0e08", borderRadius: 20,
    padding: 24, marginBottom: 16, overflow: "hidden",
  },
  ctaGlow: {
    position: "absolute", width: 200, height: 200, borderRadius: 99,
    backgroundColor: "rgba(255,107,53,0.15)", top: -80, right: -40,
  },
  ctaBadgeText: { fontSize: 10, fontWeight: "700", color: ORANGE, textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 },
  ctaTitle: { fontSize: 22, fontWeight: "800", color: "#fff", lineHeight: 28, marginBottom: 10, letterSpacing: -0.3 },
  ctaSub: { fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 20, marginBottom: 20 },
  ctaBtn: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: ORANGE, borderRadius: 99,
    paddingHorizontal: 20, paddingVertical: 13, alignSelf: "flex-start",
    shadowColor: ORANGE, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 8, elevation: 4,
  },
  ctaBtnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});