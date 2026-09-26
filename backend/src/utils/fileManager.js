const supabase = require("../config/supabase");
const path = require("path");

const uploadFile = async (file, bucket, folder = "") => {
  const ext = path.extname(file.originalname).toLowerCase();
  const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
  const storagePath = folder ? `${folder}/${fileName}` : fileName;

  const mimeTypes = {
    ".pdf": "application/pdf",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
  };

  const { error } = await supabase.storage
    .from(bucket)
    .upload(storagePath, file.buffer, {
      contentType: mimeTypes[ext] || "application/octet-stream",
      upsert: false,
    });

  if (error) throw { status: 500, message: "File upload failed: " + error.message };

  const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(storagePath);

  return urlData.publicUrl;
};

const deleteFile = async (fileUrl, bucket) => {
  console.log("🗑️ Deleting file URL:", fileUrl);
  console.log("🪣 Bucket:", bucket);

  const marker = `/object/public/${bucket}/`;
  const markerIndex = fileUrl.indexOf(marker);

  if (markerIndex === -1) {

    const urlParts = fileUrl.split(`/${bucket}/`);
    if (urlParts.length < 2) throw { status: 400, message: "Invalid file URL" };
    const filePath = urlParts[1];
    console.log("📂 File path to delete:", filePath);
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) throw { status: 500, message: "File delete failed: " + error.message };
    return;
  }

  const filePath = fileUrl.substring(markerIndex + marker.length);
  console.log("📂 File path to delete:", filePath);

  const { error } = await supabase.storage.from(bucket).remove([filePath]);
  if (error) throw { status: 500, message: "File delete failed: " + error.message };
};

module.exports = { uploadFile, deleteFile };
