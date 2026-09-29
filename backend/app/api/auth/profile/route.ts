import { prisma } from "@/lib/prisma";
import { getAuthInstitution } from "@/lib/auth";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function PUT(req: Request) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    const { name, avatar } = await req.json();

    const updated = await prisma.institution.update({
      where: { id: institution.id },
      data: {
        ...(name ? { name: name.trim() } : {}),
        ...(avatar !== undefined ? { avatar } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        isVerified: true,
        twoFactorEnabled: true,
        updatedAt: true,
      },
    });

    return jsonResponse(
      {
        message: "Profile updated successfully",
        institution: updated,
      },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse(
      { message: error.message || "Failed to update profile" },
      { status: 500 },
      req
    );
  }
}
