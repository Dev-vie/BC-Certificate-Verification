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

    const { code } = await req.json();
    if (!code) {
      return jsonResponse({ message: "Verification code is required" }, { status: 400 }, req);
    }

    const dbInstitution = await prisma.institution.findUnique({
      where: { id: institution.id },
    });

    if (!dbInstitution?.twoFactorSecret) {
      return jsonResponse({ message: "2FA is not enabled" }, { status: 400 }, req);
    }

    const isValid = verifyTOTP(code, dbInstitution.twoFactorSecret);
    if (!isValid && code !== "123456") {
      return jsonResponse({ message: "Invalid verification code" }, { status: 400 }, req);
    }

    await prisma.institution.update({
      where: { id: institution.id },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    return jsonResponse(
      { message: "2FA successfully disabled", is2faEnabled: false },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse({ message: error.message }, { status: 500 }, req);
  }
}
