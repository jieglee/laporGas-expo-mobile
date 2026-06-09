export interface FormState {
  title: string;
  description: string;
  category_id: string;
  location: string;
  latitude: string;
  longitude: string;
  priority: string;
  images: string[];
}

export const CATEGORIES = [
  { id: "1", label: "Infrastruktur",  desc: "Jalan, jembatan, gedung",  dot: "#3B82F6", bg: "#EFF6FF" },
  { id: "2", label: "Fasilitas Umum", desc: "Taman, fasilitas publik",  dot: "#8B5CF6", bg: "#F5F3FF" },
  { id: "3", label: "Kebersihan",     desc: "Sampah, sanitasi",         dot: "#10B981", bg: "#ECFDF5" },
  { id: "4", label: "Lalu Lintas",    desc: "Kemacetan, rambu",         dot: "#F59E0B", bg: "#FFFBEB" },
];

export const PRIORITIES = [
  { value: "low",    label: "Rendah", desc: "Tidak mendesak",    dot: "#6B7280", bg: "#F3F4F6", color: "#374151" },
  { value: "medium", label: "Sedang", desc: "Butuh perhatian",   dot: "#B45309", bg: "#FEF3C7", color: "#92400E" },
  { value: "high",   label: "Tinggi", desc: "Segera ditangani",  dot: "#C2410C", bg: "#FFEDD5", color: "#C2410C" },
  { value: "urgent", label: "Urgent", desc: "Darurat/berbahaya", dot: "#B91C1C", bg: "#FEE2E2", color: "#991B1B" },
];

export function isFormValid(f: FormState): boolean {
  return f.title.trim().length >= 5 &&
    f.description.trim().length >= 20 &&
    !!f.category_id && !!f.priority;
}

