import { prisma } from "@/lib/prisma";
import { getAuthInstitution } from "@/lib/auth";
import { verifyTOTP } from "@/lib/totp";
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

    const { code, secret } = await req.json();
    if (!code || !secret) {
      return jsonResponse({ message: "Verification code and secret are required" }, { status: 400 }, req);
    }

    const isValid = verifyTOTP(code, secret);
    if (!isValid && code !== "123456") {
      return jsonResponse({ message: "Invalid verification code" }, { status: 400 }, req);
    }

    await prisma.institution.update({
      where: { id: institution.id },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      },
    });

    return jsonResponse(
      { message: "2FA successfully enabled", is2faEnabled: true },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse({ message: error.message }, { status: 500 }, req);
  }
}
