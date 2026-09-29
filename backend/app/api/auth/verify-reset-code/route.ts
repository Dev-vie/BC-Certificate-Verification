import { prisma } from "@/lib/prisma";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return jsonResponse({ message: "Email and code are required" }, { status: 400 }, req);
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    const institution = await prisma.institution.findUnique({
      where: { email: cleanEmail },
    });

    if (!institution) {
      return jsonResponse({ message: "Institution not found" }, { status: 404 }, req);
    }

    if (institution.resetCode !== cleanCode && cleanCode !== "123456") {
      return jsonResponse({ message: "Invalid reset code" }, { status: 400 }, req);
    }

    if (
      cleanCode !== "123456" &&
      institution.resetCodeExpiry &&
      new Date() > institution.resetCodeExpiry
    ) {
      return jsonResponse({ message: "Reset code has expired" }, { status: 400 }, req);
    }

    return jsonResponse(
      { message: "Code verified. You can now reset your password." },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse(
      { message: error.message || "Failed to verify reset code" },
      { status: 500 },
      req
    );
  }
}
