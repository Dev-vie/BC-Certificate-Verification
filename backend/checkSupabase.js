require("dotenv").config();
const supabase = require("./src/config/supabase");

async function checkConnection() {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    if (error) throw error;
    console.log("✅ Supabase connected successfully");
    console.log("📦 Buckets:", data.map(b => b.name));
  } catch (err) {
    console.error("❌ Supabase connection failed:", err.message);
  }
}

checkConnection();
