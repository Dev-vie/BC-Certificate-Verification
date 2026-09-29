import { getAuthInstitution } from "@/lib/auth";
import { generateSecret, generate2FAQrCode } from "@/lib/totp";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    const secret = generateSecret();
    const { qrCodeUrl } = await generate2FAQrCode(institution.email, secret);
    const secretFormatted = secret.match(/.{1,4}/g)?.join(" ") || secret;

    return jsonResponse(
      {
        qrCodeUrl,
        secret,
        secretFormatted,
        is2faEnabled: Boolean(institution.twoFactorEnabled),
      },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse({ message: error.message }, { status: 500 }, req);
  }
}
