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
            <View style={[styles.mainImg, { height: IMG_HEIGHT }]}>
                <Image
                    source={{ uri: imgs[activeImg] }}
                    style={styles.img}
                    resizeMode="cover"
                />
            </View>

            {/* Thumbnails */}
            {imgs.length > 1 && (
                <View style={styles.thumbRow}>
                    {imgs.map((url, i) => (
                        <TouchableOpacity
                            key={i}
                            onPress={() => setActiveImg(i)}
                            style={[styles.thumb, i === activeImg && styles.thumbActive]}
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
    card: { backgroundColor: "#fff", borderRadius: 16, overflow: "hidden", borderWidth: 0.5, borderColor: "#f0e6dc" },
    mainImg: { width: "100%", backgroundColor: "#f5f0eb" },
    img: { width: "100%", height: "100%" },
    thumbRow: { flexDirection: "row", gap: 8, padding: 10, flexWrap: "wrap" },
    thumb: { width: 56, height: 56, borderRadius: 8, overflow: "hidden", borderWidth: 2, borderColor: "transparent", opacity: 0.6 },
    thumbActive: { borderColor: "#E8541C", opacity: 1 },
    thumbImg: { width: "100%", height: "100%" },
});