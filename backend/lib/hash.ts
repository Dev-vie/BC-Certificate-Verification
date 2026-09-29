import crypto from "crypto";

export function hashBuffer(buffer: Buffer): string {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function hashString(str: string): string {
  return crypto.createHash("sha256").update(str, "utf8").digest("hex");
}

export function toBytes32(hexHash: string): string {
  const clean = hexHash.startsWith("0x") ? hexHash.slice(2) : hexHash;
  if (clean.length !== 64) {
    throw new Error(`Expected 64-char hex string, got ${clean.length} characters`);
  }
  return "0x" + clean;
}
