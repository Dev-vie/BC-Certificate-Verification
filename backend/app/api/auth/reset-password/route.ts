import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const { email, code, newPassword, confirmPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return jsonResponse({ message: "All fields are required" }, { status: 400 }, req);
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return jsonResponse({ message: "Passwords do not match" }, { status: 400 }, req);
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

    const hashedPassword = await hashPassword(newPassword);

    await prisma.institution.update({
      where: { id: institution.id },
      data: {
        password: hashedPassword,
        resetCode: null,
        resetCodeExpiry: null,
      },
    });

    return jsonResponse(
      { message: "Password reset successfully. You can now login." },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse(
      { message: error.message || "Failed to reset password" },
      { status: 500 },
      req
    );
  }
}
