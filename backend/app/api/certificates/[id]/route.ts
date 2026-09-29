import { prisma } from "@/lib/prisma";
import { getAuthInstitution } from "@/lib/auth";
import { deleteFile } from "@/lib/storage";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    const { id } = await params;
    const cleanId = String(id || "").trim();
    const numericId = parseInt(cleanId, 10);
    const isNumeric = !isNaN(numericId) && String(numericId) === cleanId;

    const certificate = await prisma.certificate.findFirst({
      where: {
        institutionId: institution.id,
        OR: [
          ...(isNumeric ? [{ id: numericId }] : []),
          { certificateId: cleanId },
        ],
      },
      include: {
        template: { select: { id: true, title: true } },
        institution: { select: { id: true, name: true, email: true } },
      },
    });

    if (!certificate) {
      return jsonResponse({ message: "Certificate not found" }, { status: 404 }, req);
    }

    return jsonResponse({ certificate }, { status: 200 }, req);
  } catch (error: any) {
    return jsonResponse({ message: error.message }, { status: 500 }, req);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    const { id } = await params;
    const cleanId = String(id || "").trim();
    const numericId = parseInt(cleanId, 10);
    const isNumeric = !isNaN(numericId) && String(numericId) === cleanId;

    const certificate = await prisma.certificate.findFirst({
      where: {
        institutionId: institution.id,
        OR: [
          ...(isNumeric ? [{ id: numericId }] : []),
          { certificateId: cleanId },
        ],
      },
    });

    if (!certificate) {
      return jsonResponse({ message: "Certificate not found" }, { status: 404 }, req);
    }

    const bucket = process.env.SUPABASE_CERTIFICATES_BUCKET || "certificates";
    if (certificate.pdfPath) {
      await deleteFile(certificate.pdfPath, bucket);
    }

    await prisma.certificate.delete({
      where: { id: certificate.id },
    });

    return jsonResponse(
      { message: "Certificate deleted successfully", id: String(certificate.id) },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse({ message: error.message }, { status: 500 }, req);
  }
}
