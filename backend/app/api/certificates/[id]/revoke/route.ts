import { prisma } from "@/lib/prisma";
import { getAuthInstitution } from "@/lib/auth";
import { revokeCertificateOnChain } from "@/lib/blockchain";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function PATCH(
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

    if (certificate.status === "revoked") {
      return jsonResponse(
        { message: "Certificate is already revoked", certificate },
        { status: 400 },
        req
      );
    }

    // Attempt on-chain revocation if hash exists
    if (certificate.hash) {
      try {
        await revokeCertificateOnChain(certificate.hash);
      } catch (chainErr: any) {
        console.warn("[Revoke] On-chain revocation warning:", chainErr.message);
      }
    }

    const updated = await prisma.certificate.update({
      where: { id: certificate.id },
      data: { status: "revoked" },
      include: {
        template: { select: { id: true, title: true } },
        institution: { select: { id: true, name: true, email: true } },
      },
    });

    return jsonResponse(
      { message: "Certificate revoked successfully", certificate: updated },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse({ message: error.message }, { status: 500 }, req);
  }
}

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  return PATCH(req, context);
}
