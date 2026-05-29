import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, Platform, ActionSheetIOS } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera, X, Plus, ImageIcon } from "lucide-react-native";

const ORANGE = "#E8541C";
const MAX = 5;

interface Props { images: string[]; onChange: (imgs: string[]) => void; }

export default function ImageUpload({ images, onChange }: Props) {
    const remaining = MAX - images.length;

    const pickImage = async (source: "camera" | "gallery") => {
        if (images.length >= MAX) { Alert.alert("Batas foto", "Maksimal 5 foto"); return; }

        let result;
        if (source === "camera") {
            if (Platform.OS !== "web") {
                const perm = await ImagePicker.requestCameraPermissionsAsync();
                if (!perm.granted) { Alert.alert("Izin kamera diperlukan"); return; }
            }
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsEditing: true,
            });
        } else {
            if (Platform.OS !== "web") {
                const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (!perm.granted) { Alert.alert("Izin galeri diperlukan"); return; }
            }
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                allowsMultipleSelection: true,
                selectionLimit: remaining,
            });
        }

        if (!result.canceled) {
            const uris = result.assets.map((a) => a.uri);
            onChange([...images, ...uris].slice(0, MAX));
        }
    };

    const showOptions = () => {
        if (Platform.OS === "web") {
            pickImage("gallery");
            return;
        }
        if (Platform.OS === "ios") {
            ActionSheetIOS.showActionSheetWithOptions(
                { options: ["Batal", "Kamera", "Pilih dari Galeri"], cancelButtonIndex: 0 },
                (i) => { if (i === 1) pickImage("camera"); else if (i === 2) pickImage("gallery"); }
            );
        } else {
            Alert.alert("Tambah Foto", "", [
                { text: "Kamera", onPress: () => pickImage("camera") },
                { text: "Galeri", onPress: () => pickImage("gallery") },
                { text: "Batal", style: "cancel" },
            ]);
        }
    };

    const remove = (i: number) => onChange(images.filter((_, idx) => idx !== i));

    return (
        <View style={styles.field}>
            <View style={styles.label}>
                <View style={styles.icon}><ImageIcon size={12} color={ORANGE} strokeWidth={2} /></View>
                <Text style={styles.labelText}>Foto bukti <Text style={styles.optional}>(opsional)</Text></Text>
            </View>
            <Text style={styles.hint}>Maks 5 foto. Foto pertama jadi cover laporan.</Text>

            {images.length < MAX && (
                <TouchableOpacity style={styles.uploadArea} onPress={showOptions} activeOpacity={0.8}>
                    <View style={styles.uploadIcon}><Camera size={22} color={ORANGE} strokeWidth={1.8} /></View>
                    <Text style={styles.uploadTitle}>Tambah foto</Text>
                    <Text style={styles.uploadSub}>
                        {Platform.OS === "web" ? "Pilih dari file" : "Kamera atau galeri"} • {remaining} slot tersisa
                    </Text>
                </TouchableOpacity>
            )}

            {images.length > 0 && (
                <View style={styles.grid}>
                    {images.map((uri, i) => (
                        <View key={i} style={styles.imgWrap}>
                            <Image source={{ uri }} style={styles.img} resizeMode="cover" />
                            {i === 0 && <View style={styles.cover}><Text style={styles.coverText}>Cover</Text></View>}
                            <TouchableOpacity style={styles.remove} onPress={() => remove(i)}>
                                <X size={10} color="#fff" strokeWidth={2.5} />
                            </TouchableOpacity>
                        </View>
                    ))}
                    {images.length < MAX && (
                        <TouchableOpacity style={styles.addBtn} onPress={showOptions} activeOpacity={0.8}>
                            <Plus size={20} color="#a8856b" strokeWidth={1.8} />
                            <Text style={styles.addText}>Tambah</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    field: { marginBottom: 20 },
    label: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 4 },
    icon: { width: 22, height: 22, borderRadius: 6, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center" },
    labelText: { fontSize: 12, fontWeight: "700", color: "#3d2817" },
    optional: { fontWeight: "400", color: "#a8856b" },
    hint: { fontSize: 11, color: "#a8856b", marginBottom: 10 },
    uploadArea: { borderWidth: 1.5, borderStyle: "dashed", borderColor: "#f0e6dc", borderRadius: 12, padding: 24, alignItems: "center", gap: 8, backgroundColor: "#fafaf8", marginBottom: 12 },
    uploadIcon: { width: 44, height: 44, borderRadius: 99, backgroundColor: "rgba(255,107,53,0.08)", alignItems: "center", justifyContent: "center" },
    uploadTitle: { fontSize: 14, fontWeight: "600", color: "#1a0e08" },
    uploadSub: { fontSize: 12, color: "#a8856b" },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
    imgWrap: { width: 90, height: 90, borderRadius: 10, overflow: "hidden" },
    img: { width: "100%", height: "100%" },
    cover: { position: "absolute", top: 4, left: 4, backgroundColor: "rgba(232,84,28,0.9)", borderRadius: 99, paddingHorizontal: 6, paddingVertical: 2 },
    coverText: { fontSize: 8, fontWeight: "700", color: "#fff", textTransform: "uppercase" },
    remove: { position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: 99, backgroundColor: "rgba(0,0,0,0.6)", alignItems: "center", justifyContent: "center" },
    addBtn: { width: 90, height: 90, borderRadius: 10, borderWidth: 1.5, borderStyle: "dashed", borderColor: "#f0e6dc", backgroundColor: "#fafaf8", alignItems: "center", justifyContent: "center", gap: 4 },
    addText: { fontSize: 10, fontWeight: "600", color: "#a8856b" },
});