import { prisma } from "@/lib/prisma";
import { verifyToken, generateToken, generateRefreshToken } from "@/lib/auth";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, v.join("=")];
      })
    );

    const rawRefreshToken = cookies["refreshToken"];
    if (!rawRefreshToken) {
      return jsonResponse({ message: "No refresh token provided" }, { status: 401 }, req);
    }

    const payload = verifyToken(rawRefreshToken);
    if (!payload || !payload.id) {
      const res = jsonResponse({ message: "Invalid refresh token" }, { status: 401 }, req);
      res.cookies.delete("refreshToken");
      return res;
    }

    const institution = await prisma.institution.findUnique({
      where: { id: payload.id },
    });

    if (!institution) {
      return jsonResponse({ message: "Institution not found" }, { status: 401 }, req);
    }

    const token = generateToken({
      id: institution.id,
      email: institution.email,
      name: institution.name,
    });
    const newRefreshToken = generateRefreshToken({
      id: institution.id,
      email: institution.email,
      name: institution.name,
    });

    const res = jsonResponse({ token, message: "Token refreshed successfully" }, { status: 200 }, req);
    res.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/api/auth",
    });

    return res;
  } catch (error: any) {
    return jsonResponse(
      { message: error.message || "Failed to refresh token" },
      { status: 500 },
      req
    );
  }
}
