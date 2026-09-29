import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/email";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return jsonResponse(
        { message: "Name, email, and password are required" },
        { status: 400 },
        req
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    const existing = await prisma.institution.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return jsonResponse(
        { message: "An institution with this email already exists" },
        { status: 409 },
        req
      );
    }

    const hashedPassword = await hashPassword(password);
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verifyCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    const institution = await prisma.institution.create({
      data: {
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isVerified: false,
      },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
        createdAt: true,
      },
    });

    await sendVerificationEmail(cleanEmail, institution.name, verifyCode);

    return jsonResponse(
      {
        message:
          "Registered successfully. Please check your email for the 6-digit verification code.",
        institution,
      },
      { status: 201 },
      req
    );
  } catch (error: any) {
    console.error("[Register Error]:", error);
    return jsonResponse(
      { message: error.message || "Failed to register institution" },
      { status: 500 },
      req
    );
  }
}
