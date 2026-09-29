import crypto from "crypto";
import QRCode from "qrcode";

const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32Decode(base32Str: string): Buffer {
  const clean = base32Str.toUpperCase().replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const output: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_CHARS.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(output);
}

export function generateSecret(length = 20): string {
  const randomBytes = crypto.randomBytes(length);
  return base32Encode(randomBytes);
}

export function generateTOTP(secret: string, timeStep = 30, counterOffset = 0): string {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1000);
  const timeCounter = Math.floor(epoch / timeStep) + counterOffset;

  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(timeCounter), 0);

  const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;

  const codeInt =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = (codeInt % 1000000).toString().padStart(6, "0");
  return otp;
}

export function verifyTOTP(token: string, secret: string, window = 1): boolean {
  if (!token || token.length !== 6 || isNaN(Number(token))) return false;
  const cleanToken = token.trim();

  for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
    const expectedOtp = generateTOTP(secret, 30, errorWindow);
    if (expectedOtp === cleanToken) {
      return true;
    }
  }
  return false;
}

export async function generate2FAQrCode(email: string, secret: string) {
  const issuer = "VeriCert";
  const label = encodeURIComponent(`${issuer}:${email}`);
  const otpauthUrl = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}`;
  const qrCodeUrl = await QRCode.toDataURL(otpauthUrl, {
    width: 200,
    margin: 2,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });
  return { qrCodeUrl, otpauthUrl };
}
