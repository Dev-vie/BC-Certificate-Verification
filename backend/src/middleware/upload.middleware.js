const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const uploadTemplate = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [".pdf", ".png", ".jpg", ".jpeg"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error("Only PDF and image files are allowed"));
  },
});

const uploadCsv = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".csv") cb(null, true);
    else cb(new Error("Only CSV files are allowed"));
  },
});

module.exports = { uploadTemplate, uploadCsv };
