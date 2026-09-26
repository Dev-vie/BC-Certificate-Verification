import {
  Type,
  Hash,
  BookOpen,
  Calendar,
  Mail,
  GraduationCap,
  Building,
  QrCode,
} from "lucide-react";
import type { TemplatePlaceholder } from "../../redux/features/template/templateTypes";

export type CanvasField = TemplatePlaceholder;

export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 566;

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 2;
export const ZOOM_STEP = 0.1;

export const AVAILABLE_FIELDS = [
  { id: "recipientName", name: "Recipient Name", icon: Type },
  { id: "certificateId", name: "Certificate ID", icon: Hash },
  { id: "courseProgram", name: "Course / Program", icon: BookOpen },
  { id: "issueDate", name: "Issue Date", icon: Calendar },
  { id: "email", name: "Email", icon: Mail },
  { id: "grade", name: "Grade", icon: GraduationCap },
  { id: "institutionName", name: "Institution Name", icon: Building },
];

export const SPECIAL_FIELDS = [{ id: "qrCode", name: "QR Code", icon: QrCode }];

export const FIELD_DEFS = [...AVAILABLE_FIELDS, ...SPECIAL_FIELDS];

export const FONT_OPTIONS = [
  "Inter",
  "Plus Jakarta Sans",
  "Poppins",
  "Montserrat",
  "Lato",
  "Roboto",
  "Open Sans",
  "Raleway",
  "Merriweather",
  "Playfair Display",
  "Cormorant Garamond",
  "DM Serif Display",
  "Oswald",
  "Nunito",
  "Karla",
  "Manrope",
  "Source Sans 3",
  "Libre Baskerville",
  "IBM Plex Sans",
  "Allura",
  "Great Vibes",
  "Dancing Script",
  "Sacramento",
  "Parisienne",
  "Alex Brush",
  "Satisfy",
  "Marck Script",
  "Tangerine",
] as const;

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const createField = (
  fieldId: string,
  name: string,
  index: number,
  position?: { x: number; y: number },
): CanvasField => ({
  id: fieldId,
  name,
  x: position?.x ?? 80 + index * 24,
  y: position?.y ?? 120 + index * 20,
  width: fieldId === "qrCode" ? 120 : 360,
  height: fieldId === "qrCode" ? 120 : 48,
  fontFamily: "Inter",
  fontSize: fieldId === "qrCode" ? 12 : 22,
  isBold: false,
  isItalic: false,
  color: "#111827",
  align: "center",
});

export const SAMPLE_PREVIEW_DATA: Record<string, string> = {
  recipientName: "Amara Okafor",
  certificateId: "CERT-2026-4821",
  courseProgram: "Advanced Web Development",
  issueDate: "June 28, 2026",
  email: "amara@example.com",
  grade: "Distinction",
  institutionName: "Authentix University",
};
