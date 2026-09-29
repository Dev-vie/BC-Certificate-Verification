import { prisma } from "@/lib/prisma";
import { sendResetCodeEmail } from "@/lib/email";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return jsonResponse({ message: "Email is required" }, { status: 400 }, req);
    }

    const cleanEmail = email.toLowerCase().trim();
    const institution = await prisma.institution.findUnique({
      where: { email: cleanEmail },
    });

    if (!institution) {
      return jsonResponse({ message: "Institution not found" }, { status: 404 }, req);
    }

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    await prisma.institution.update({
      where: { id: institution.id },
      data: { resetCode, resetCodeExpiry },
    });

    await sendResetCodeEmail(cleanEmail, resetCode);

    return jsonResponse(
      { message: "Reset code sent to your email." },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse(
      { message: error.message || "Failed to process forgot password" },
      { status: 500 },
      req
    );
  }
}
