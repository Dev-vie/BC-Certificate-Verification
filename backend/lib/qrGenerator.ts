import QRCode from "qrcode";

export async function generateQRCodeBuffer(certificateId: string): Promise<{ buffer: Buffer; verificationUrl: string }> {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const verificationUrl = `${frontendUrl.replace(/\/+$/, "")}/verify/${encodeURIComponent(certificateId)}`;

  const buffer = await QRCode.toBuffer(verificationUrl, {
    type: "png",
    width: 300,
    margin: 2,
    color: {
      dark: "#0F172A",
      light: "#FFFFFF",
    },
  });

  return { buffer, verificationUrl };
}
