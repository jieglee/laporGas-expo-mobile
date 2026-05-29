export type Kategori = "all" | "infrastruktur" | "fasilitas-umum" | "kebersihan" | "lalu-lintas";

export const KATEGORI_TABS: { value: Kategori; label: string }[] = [
    { value: "all",            label: "Semua" },
    { value: "infrastruktur",  label: "Infrastruktur" },
    { value: "fasilitas-umum", label: "Fasilitas Umum" },
    { value: "kebersihan",     label: "Kebersihan" },
    { value: "lalu-lintas",    label: "Lalu Lintas" },
];

export function mapKategori(name: string | null): Exclude<Kategori, "all"> {
    switch (name?.toLowerCase()) {
        case "infrastruktur":  return "infrastruktur";
        case "fasilitas umum": return "fasilitas-umum";
        case "kebersihan":     return "kebersihan";
        case "lalu lintas":    return "lalu-lintas";
        default:               return "infrastruktur";
    }
}