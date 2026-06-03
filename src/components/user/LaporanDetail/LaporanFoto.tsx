import { View, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { useState } from "react";
import type { Report } from "@/lib/report";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = (width - 32) * (9 / 16);

export default function LaporanFoto({ report }: { report: Report }) {
    const [activeImg, setActiveImg] = useState(0);
    const imgs = Array.isArray(report.images) && report.images.length > 0
        ? report.images
        : report.image_url ? [report.image_url] : [];

    if (imgs.length === 0) return null;

    return (
        <View style={styles.card}>
            {/* Main image */}
            <View style={[styles.mainWrap, { height: IMG_HEIGHT }]}>
                <Image
                    source={{ uri: imgs[activeImg] }}
                    style={styles.mainImg}
                    resizeMode="cover"
                />
                {/* Dot indicators */}
                {imgs.length > 1 && (
                    <View style={styles.dots}>
                        {imgs.map((_, i) => (
                            <View key={i} style={[styles.dot, i === activeImg && styles.dotActive]} />
                        ))}
                    </View>
                )}
            </View>

            {/* Thumbnails */}
            {imgs.length > 1 && (
                <View style={styles.thumbRow}>
                    {imgs.map((url, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => setActiveImg(i)}
                            style={[styles.thumb, i === activeImg && styles.thumbActive]}
                            activeOpacity={0.8}
                        >
                            <Image source={{ uri: url }} style={styles.thumbImg} resizeMode="cover" />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: "#fff", borderRadius: 20, overflow: "hidden", borderWidth: 0.5, borderColor: "#f0e6dc" },
    mainWrap: { width: "100%", backgroundColor: "#f5ede3", position: "relative" },
    mainImg: { width: "100%", height: "100%" },
    dots: { position: "absolute", bottom: 10, left: 0, right: 0, flexDirection: "row", justifyContent: "center", gap: 5 },
    dot: { width: 6, height: 6, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.5)" },
    dotActive: { backgroundColor: "#fff", width: 18 },
    thumbRow: { flexDirection: "row", gap: 8, padding: 12 },
    thumb: { width: 60, height: 60, borderRadius: 10, overflow: "hidden", borderWidth: 2, borderColor: "transparent", opacity: 0.55 },
    thumbActive: { borderColor: "#E8541C", opacity: 1 },
    thumbImg: { width: "100%", height: "100%" },
});