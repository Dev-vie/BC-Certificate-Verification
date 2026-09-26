import type { CertificateStatus } from "../redux/features/certificate/certificateTypes";

export type StatusDisplayKey = "Verified" | "Pending" | "Revoked" | "Failed";

const DEFAULT_DISPLAY = {
  label: "Verified" as StatusDisplayKey,
  dot: "bg-emerald-500",
  pill: "bg-emerald-500/10 text-emerald-500",
};

const BASE_STATUS_MAP: Record<
  string,
  { label: StatusDisplayKey; dot: string; pill: string }
> = {
  issued: DEFAULT_DISPLAY,
  verified: DEFAULT_DISPLAY,
  processing: {
    label: "Pending",
    dot: "bg-amber-500",
    pill: "bg-amber-500/10 text-amber-500",
  },
  pending: {
    label: "Pending",
    dot: "bg-amber-500",
    pill: "bg-amber-500/10 text-amber-500",
  },
  revoked: {
    label: "Revoked",
    dot: "bg-red-500",
    pill: "bg-red-500/10 text-red-500",
  },
  failed: {
    label: "Failed",
    dot: "bg-red-500",
    pill: "bg-red-500/10 text-red-500",
  },
};

export const getStatusDisplay = (
  status?: string,
): { label: StatusDisplayKey; dot: string; pill: string } => {
  if (!status) return DEFAULT_DISPLAY;
  const key = String(status).toLowerCase();
  return BASE_STATUS_MAP[key] || DEFAULT_DISPLAY;
};

export const STATUS_DISPLAY: Record<
  string,
  { label: StatusDisplayKey; dot: string; pill: string }
> = new Proxy(BASE_STATUS_MAP as any, {
  get(target, prop) {
    if (typeof prop === "string") {
      return getStatusDisplay(prop);
    }
    return Reflect.get(target, prop);
  },
});

export const STATUS_FILTER_OPTIONS: Array<{
  value: CertificateStatus | "All";
  label: string;
}> = [
  { value: "All", label: "All" },
  { value: "issued", label: "Verified" },
  { value: "processing", label: "Pending" },
  { value: "revoked", label: "Revoked" },
  { value: "failed", label: "Failed" },
];

const AVATAR_PALETTE = [
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
  "bg-amber-100 text-amber-700",
  "bg-indigo-100 text-indigo-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
];

export const getAvatarInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const getAvatarColorClass = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_PALETTE[hash % AVATAR_PALETTE.length];
};
