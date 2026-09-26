const crypto = require("crypto");
const fs = require("fs");

function hashBuffer(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

function hashCertificateData({ title, recipientName, recipientEmail, issuerId, issuedAt }) {
  const payload = JSON.stringify({ title, recipientName, recipientEmail, issuerId, issuedAt });
  return hashBuffer(payload);
}

function hashFile(filePath) {
  const data = fs.readFileSync(filePath);
  return hashBuffer(data);
}

function toBytes32(hexHash) {
  return "0x" + hexHash.padStart(64, "0");
}

module.exports = { hashBuffer, hashCertificateData, hashFile, toBytes32 };
