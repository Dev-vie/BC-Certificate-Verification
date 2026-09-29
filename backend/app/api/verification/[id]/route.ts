import { prisma } from "@/lib/prisma";
import { verifyCertificateOnChain, isBlockchainConfigured } from "@/lib/blockchain";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return jsonResponse(
        { valid: false, message: "Certificate ID or hash is required" },
        { status: 400 },
        req
      );
    }

    let cleanQuery = decodeURIComponent(id).trim();
    if (cleanQuery.includes("/")) {
      cleanQuery = cleanQuery.split("/").filter(Boolean).pop() || cleanQuery;
    }
    const cleanHash = cleanQuery.startsWith("0x") ? cleanQuery.slice(2) : cleanQuery;

    const cert = await prisma.certificate.findFirst({
      where: {
        OR: [
          { certificateId: cleanQuery },
          { hash: cleanQuery },
          { hash: cleanHash },
          { hash: "0x" + cleanHash },
          { txHash: cleanQuery },
          { txHash: cleanHash },
        ],
      },
      include: {
        institution: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
    });

    if (!cert) {
      return jsonResponse(
        {
          valid: false,
          blockchainStatus: "NOT_ON_CHAIN",
          message: "Certificate not found in database or blockchain registry",
        },
        { status: 404 },
        req
      );
    }

    let blockchainStatus: "VALID" | "REVOKED" | "NOT_ON_CHAIN" = "NOT_ON_CHAIN";
    let onChainRecord: any = {
      hash: cert.hash || "",
      exists: false,
      revoked: false,
      issuerAddress: "",
      issuedAt: "",
      certId: cert.certificateId,
    };

    if (cert.hash) {
      if (isBlockchainConfigured()) {
        const onChain = await verifyCertificateOnChain(cert.hash);
        onChainRecord = {
          hash: cert.hash,
          exists: onChain.exists,
          revoked: onChain.revoked,
          issuerAddress: onChain.issuerAddress || "",
          issuedAt: onChain.issuedAt || "",
          certId: onChain.certId || cert.certificateId,
        };

        if (!onChain.exists) {
          blockchainStatus = "NOT_ON_CHAIN";
        } else if (onChain.revoked || cert.status === "revoked") {
          blockchainStatus = "REVOKED";
        } else {
          blockchainStatus = "VALID";
        }
      } else {
        // Fallback for simulated / unconfigured blockchain environment
        const isRevoked = cert.status === "revoked";
        blockchainStatus = isRevoked ? "REVOKED" : "VALID";
        onChainRecord = {
          hash: cert.hash,
          exists: true,
          revoked: isRevoked,
          issuerAddress: cert.contractAddress || "0x71C...Amoy",
          issuedAt: cert.createdAt.toISOString(),
          certId: cert.certificateId,
        };
      }
    }

    const isValid = cert.status === "issued" && blockchainStatus === "VALID";

    return jsonResponse(
      {
        valid: isValid,
        blockchainStatus,
        certificate: {
          certificateId: cert.certificateId,
          recipientName: cert.recipientName,
          recipientId: cert.recipientId,
          course: cert.course,
          grade: cert.grade,
          issueDate: cert.issueDate.toISOString(),
          status: cert.status,
          issuedBy: cert.institution?.name || "Verified Institution",
          hash: cert.hash || "",
          txHash: cert.txHash || "",
          blockNumber: cert.blockNumber || 0,
          contractAddress: cert.contractAddress || "",
          pdfPath: cert.pdfPath || "",
          qrCode: cert.qrCode || "",
        },
        onChain: onChainRecord,
      },
      { status: 200 },
      req
    );
  } catch (error: any) {
    console.error("[Verification Error]:", error);
    return jsonResponse(
      { valid: false, message: error.message || "Failed to verify certificate" },
      { status: 500 },
      req
    );
  }
}
