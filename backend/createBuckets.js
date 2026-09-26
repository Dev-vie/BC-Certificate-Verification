require("dotenv").config();
const supabase = require("./src/config/supabase");

async function createBuckets() {
  const { error } = await supabase.storage.createBucket("certificates", {
    public: true,
  });

  if (error && error.message !== "Bucket already exists") {
    console.error("❌ Failed to create certificates bucket:", error.message);
  } else {
    console.log("✅ certificates bucket ready");
  }

  // Also make sure templates is public
  const { error: error2 } = await supabase.storage.updateBucket("templates", {
    public: true,
  });

  if (error2) {
    console.error("❌ Failed to update templates bucket:", error2.message);
  } else {
    console.log("✅ templates bucket is public");
  }
}

createBuckets();
