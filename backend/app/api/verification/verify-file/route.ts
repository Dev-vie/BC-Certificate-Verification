import { prisma } from "@/lib/prisma";
import { hashBuffer } from "@/lib/hash";
import { verifyCertificateOnChain, isBlockchainConfigured } from "@/lib/blockchain";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function POST(req: Request) {
  try {
    let targetHash = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;
      const hashField = formData.get("hash") as string;

      if (file) {
        const arrayBuffer = await file.arrayBuffer();
        targetHash = hashBuffer(Buffer.from(arrayBuffer));
      } else if (hashField) {
        targetHash = hashField.trim();
      }
    } else {
      const body = await req.json().catch(() => ({}));
      targetHash = body.hash || "";
    }

    if (!targetHash) {
      return jsonResponse(
        { valid: false, message: "A certificate PDF file or hash is required" },
        { status: 400 },
        req
      );
    }

    const cleanHash = targetHash.startsWith("0x") ? targetHash.slice(2) : targetHash;

    const cert = await prisma.certificate.findFirst({
      where: {
        OR: [
          { hash: cleanHash },
          { hash: "0x" + cleanHash },
          { hash: targetHash },
        ],
      },
      include: {
        institution: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!cert) {
      return jsonResponse(
        {
          valid: false,
          blockchainStatus: "NOT_ON_CHAIN",
          message: "No certificate matching this file's cryptographic hash was found. The file may have been altered or forged.",
        },
        { status: 404 },
        req
      );
    }

    let blockchainStatus: "VALID" | "REVOKED" | "NOT_ON_CHAIN" = "NOT_ON_CHAIN";
    let onChainRecord: any = {
      hash: cert.hash,
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
        const isRevoked = cert.status === "revoked";
        blockchainStatus = isRevoked ? "REVOKED" : "VALID";
        onChainRecord = {
          hash: cert.hash,
          exists: true,
          revoked: isRevoked,
          issuerAddress: cert.contractAddress || "0xPolygonAmoy",
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
        },
        onChain: onChainRecord,
      },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse(
      { valid: false, message: error.message || "Verification failed" },
      { status: 500 },
      req
    );
  }
}
