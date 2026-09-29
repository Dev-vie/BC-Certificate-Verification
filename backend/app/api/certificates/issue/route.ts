import { prisma } from "@/lib/prisma";
import { getAuthInstitution } from "@/lib/auth";
import { generateQRCodeBuffer } from "@/lib/qrGenerator";
import { generateCertificatePDF } from "@/lib/pdfGenerator";
import { hashBuffer } from "@/lib/hash";
import { storeCertificateOnChain } from "@/lib/blockchain";
import { uploadFile } from "@/lib/storage";
import { sendCertificateIssuedEmail } from "@/lib/email";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

function generateCertificateId(): string {
  const year = new Date().getFullYear();
  const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VC-${year}-${rand1}-${rand2}`;
}

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function POST(req: Request) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    const body = await req.json();
    const {
      recipientName,
      recipientId,
      recipientEmail,
      course,
      grade,
      issueDate,
      templateId,
    } = body;

    if (!recipientName || !course || !templateId) {
      return jsonResponse(
        { message: "Recipient name, course, and template are required" },
        { status: 400 },
        req
      );
    }

    const template = await prisma.template.findFirst({
      where: {
        id: Number(templateId),
        institutionId: institution.id,
      },
    });

    if (!template) {
      return jsonResponse({ message: "Template not found" }, { status: 404 }, req);
    }

    const certificateId = generateCertificateId();
    const parsedIssueDate = issueDate ? new Date(issueDate) : new Date();

    const certDataForPDF: Record<string, string> = {
      recipientName,
      certificateId,
      courseProgram: course,
      course,
      grade: grade || "Pass",
      email: recipientEmail || "",
      recipientEmail: recipientEmail || "",
      institutionName: institution.name,
      issueDate: parsedIssueDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    const { buffer: qrBuffer, verificationUrl } = await generateQRCodeBuffer(certificateId);

    const pdfBuffer = await generateCertificatePDF(
      template.filePath,
      template.placeholders,
      certDataForPDF,
      qrBuffer
    );

    const pdfHash = hashBuffer(pdfBuffer);

    // Anchor on-chain (Polygon Amoy testnet)
    let chainData = {
      txHash: null as string | null,
      blockNumber: null as number | null,
      contractAddress: null as string | null,
    };
    try {
      const onChainResult = await storeCertificateOnChain(pdfHash, certificateId);
      chainData = {
        txHash: onChainResult.txHash,
        blockNumber: onChainResult.blockNumber,
        contractAddress: onChainResult.contractAddress || null,
      };
    } catch (chainErr: any) {
      console.warn("[Cert Issue] On-chain anchoring warning:", chainErr.message);
    }

    const bucket = process.env.SUPABASE_CERTIFICATES_BUCKET || "certificates";
    const pdfUrl = await uploadFile(
      pdfBuffer,
      `${certificateId}.pdf`,
      bucket,
      `institution-${institution.id}`
    );

    const certificate = await prisma.certificate.create({
      data: {
        certificateId,
        recipientName,
        recipientId: recipientId || "N/A",
        recipientEmail: recipientEmail || "",
        course,
        grade: grade || "Pass",
        issueDate: parsedIssueDate,
        status: "issued",
        pdfPath: pdfUrl,
        qrCode: verificationUrl,
        hash: pdfHash,
        txHash: chainData.txHash,
        blockNumber: chainData.blockNumber,
        contractAddress: chainData.contractAddress,
        institutionId: institution.id,
        templateId: template.id,
      },
      include: {
        template: { select: { id: true, title: true } },
        institution: { select: { id: true, name: true, email: true } },
      },
    });

    if (recipientEmail) {
      await sendCertificateIssuedEmail(recipientEmail, recipientName, certificate);
    }

    return jsonResponse({ certificate }, { status: 201 }, req);
  } catch (error: any) {
    console.error("[Issue Certificate Error]:", error);
    return jsonResponse(
      { message: error.message || "Failed to issue certificate" },
      { status: 500 },
      req
    );
  }
}
