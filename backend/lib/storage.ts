import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const hasSupabase = Boolean(supabaseUrl && supabaseKey);

const supabase = hasSupabase ? createClient(supabaseUrl, supabaseKey) : null;

export async function uploadFile(
  fileBuffer: Buffer,
  originalName: string,
  bucketName: string,
  folder = ""
): Promise<string> {
  const ext = path.extname(originalName).toLowerCase();
  const safeName = `${Date.now()}-${originalName.replace(/\s+/g, "_")}`;
  const storagePath = folder ? `${folder}/${safeName}` : safeName;

  const mimeTypes: Record<string, string> = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
  };
  const contentType = mimeTypes[ext] || "application/octet-stream";

  // Try Supabase first if credentials exist
  if (supabase) {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, fileBuffer, {
          contentType,
          upsert: false,
        });

      if (!error) {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(storagePath);
        return data.publicUrl;
      }
      console.warn("[Storage] Supabase upload failed, falling back to local storage:", error.message);
    } catch (err: any) {
      console.warn("[Storage] Supabase error, falling back to local storage:", err.message);
    }
  }

  // Local filesystem fallback
  const uploadsDir = path.join(process.cwd(), "public", "uploads", folder);
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const localFilePath = path.join(uploadsDir, safeName);
  fs.writeFileSync(localFilePath, fileBuffer);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const relativeUrl = folder ? `/uploads/${folder}/${safeName}` : `/uploads/${safeName}`;
  return `${baseUrl}${relativeUrl}`;
}

export async function deleteFile(fileUrl: string, bucketName: string): Promise<void> {
  if (supabase && fileUrl.includes(supabaseUrl)) {
    try {
      const marker = `/object/public/${bucketName}/`;
      const markerIndex = fileUrl.indexOf(marker);
      if (markerIndex !== -1) {
        const filePath = fileUrl.substring(markerIndex + marker.length);
        await supabase.storage.from(bucketName).remove([filePath]);
        return;
      }
    } catch (err) {
      console.warn("[Storage] Supabase file deletion error:", err);
    }
  }

  // Local deletion
  try {
    const urlParts = fileUrl.split("/uploads/");
    if (urlParts.length > 1) {
      const relativePath = urlParts[1];
      const fullPath = path.join(process.cwd(), "public", "uploads", relativePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
  } catch (err) {
    console.warn("[Storage] Local file deletion error:", err);
  }
}
