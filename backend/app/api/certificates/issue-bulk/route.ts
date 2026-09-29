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

function parseCSVText(csvText: string): Record<string, string>[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((header, idx) => {
      row[header] = values[idx] || "";
    });
    rows.push(row);
  }
  return rows;
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

    const formData = await req.formData();
    const templateId = formData.get("templateId") as string;
    const file = formData.get("file") as File;

    if (!templateId || !file) {
      return jsonResponse(
        { message: "Template ID and CSV file are required" },
        { status: 400 },
        req
      );
    }

    const template = await prisma.template.findFirst({
      where: { id: Number(templateId), institutionId: institution.id },
    });
    if (!template) {
      return jsonResponse({ message: "Template not found" }, { status: 404 }, req);
    }

    const csvText = await file.text();
    const rows = parseCSVText(csvText);

    if (rows.length === 0) {
      return jsonResponse({ message: "CSV file is empty or invalid" }, { status: 400 }, req);
    }

    const issuedList = [];
    const errors = [];
    const bucket = process.env.SUPABASE_CERTIFICATES_BUCKET || "certificates";

    for (const row of rows) {
      try {
        const getField = (keys: string[]) => {
          for (const k of keys) {
            const match = Object.keys(row).find(
              (rk) => rk.toLowerCase().trim() === k.toLowerCase().trim()
            );
            if (match && row[match]) return row[match].trim();
          }
          return "";
        };

        const recipientName = getField(["recipientName", "name", "Student Name", "Recipient Name"]);
        const recipientId = getField(["recipientId", "id", "Student ID", "Recipient ID"]) || "N/A";
        const recipientEmail = getField(["recipientEmail", "email", "Email", "Recipient Email"]);
        const course = getField(["course", "courseProgram", "Course", "Program"]);
        const grade = getField(["grade", "Grade"]) || "Pass";
        const rawDate = getField(["issueDate", "date", "Issue Date"]);

        if (!recipientName || !course) {
          throw new Error("Missing recipient name or course in row");
        }

        const certificateId = generateCertificateId();
        const parsedIssueDate = rawDate ? new Date(rawDate) : new Date();

        const certDataForPDF: Record<string, string> = {
          recipientName,
          certificateId,
          courseProgram: course,
          course,
          grade,
          email: recipientEmail,
          recipientEmail,
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
        } catch {}

        const pdfUrl = await uploadFile(
          pdfBuffer,
          `${certificateId}.pdf`,
          bucket,
          `institution-${institution.id}`
        );

        const cert = await prisma.certificate.create({
          data: {
            certificateId,
            recipientName,
            recipientId,
            recipientEmail,
            course,
            grade,
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
        });

        if (recipientEmail) {
          sendCertificateIssuedEmail(recipientEmail, recipientName, cert).catch(() => {});
        }

        issuedList.push(cert);
      } catch (err: any) {
        errors.push({ row, error: err.message });
      }
    }

    return jsonResponse(
      {
        total: rows.length,
        issued: issuedList.length,
        failed: errors.length,
        errors,
      },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse(
      { message: error.message || "Failed to issue certificates in bulk" },
      { status: 500 },
      req
    );
  }
}
