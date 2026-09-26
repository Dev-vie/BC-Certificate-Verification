const prisma = require("../../prisma/prismaClient");
const { generateCertificateId } = require("./helpers/certificateIdGenerator");
const { parseCSV } = require("./helpers/csvParser");
const { generateCertificatePDF } = require("./helpers/pdfGenerator");
const { generateQRCodeBuffer } = require("./helpers/qrCodeGenerator");
const { uploadFile } = require("../../utils/fileManager");
const { hashBuffer } = require("../../utils/hash");
const { sendCertificateIssuedEmail } = require("../../utils/sendEmail");
const {
  storeCertificateOnChain,
  isBlockchainConfigured,
} = require("../../utils/blockchain");

const anchorCertificateOnChain = async (pdfBuffer, certificateId) => {
  const hash = hashBuffer(pdfBuffer);
  if (!isBlockchainConfigured()) {
    return { hash, txHash: null, blockNumber: null, contractAddress: null };
  }

  try {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Blockchain transaction timed out after 8s")), 8000)
    );
    const chainResult = await Promise.race([
      storeCertificateOnChain(hash, certificateId),
      timeoutPromise,
    ]);
    return {
      hash,
      txHash: chainResult.txHash,
      blockNumber: chainResult.blockNumber,
      contractAddress: chainResult.contractAddress,
    };
  } catch (err) {
    console.warn(
      "[Blockchain] Anchoring skipped/failed:",
      err.message,
    );
    return { hash, txHash: null, blockNumber: null, contractAddress: null };
  }
};

const generateAndUploadPDF = async (certificate, template) => {
  const placeholders = template.placeholders;

  const institution = await prisma.institution.findUnique({
    where: { id: certificate.institutionId },
    select: { name: true, email: true, avatar: true },
  });

  const data = {
    recipientName: certificate.recipientName,
    certificateId: certificate.certificateId,
    courseProgram: certificate.course,
    course: certificate.course,
    grade: certificate.grade,
    email: certificate.recipientEmail,
    recipientEmail: certificate.recipientEmail,
    institutionName: institution?.name || "",
    issueDate: new Date(certificate.issueDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };

  const { buffer: qrBuffer, verificationUrl } = await generateQRCodeBuffer(
    certificate.certificateId,
  );

  const pdfBuffer = await generateCertificatePDF(
    template.filePath,
    placeholders,
    data,
    qrBuffer,
  );

  const fakeFile = {
    buffer: pdfBuffer,
    originalname: `${certificate.certificateId}.pdf`,
  };

  const pdfUrl = await uploadFile(
    fakeFile,
    process.env.SUPABASE_CERTIFICATES_BUCKET,
    `institution-${certificate.institutionId}`,
  );

  const fakeQrFile = {
    buffer: qrBuffer,
    originalname: `qrcode-${certificate.certificateId}.png`,
  };

  const qrImageUrl = await uploadFile(
    fakeQrFile,
    process.env.SUPABASE_CERTIFICATES_BUCKET,
    `institution-${certificate.institutionId}`,
  );

  return { pdfUrl, verificationUrl, qrImageUrl, pdfBuffer };
};

const issueSingle = async (institutionId, data) => {
  const {
    recipientName,
    recipientId,
    recipientEmail,
    course,
    grade,
    issueDate,
    templateId,
  } = data;

  const [template, institution] = await Promise.all([
    prisma.template.findFirst({
      where: { id: Number(templateId), institutionId },
    }),
    prisma.institution.findUnique({
      where: { id: institutionId },
      select: { name: true, email: true, avatar: true },
    }),
  ]);
  if (!template) throw { status: 404, message: "Template not found" };

  const certificate = await prisma.certificate.create({
    data: {
      certificateId: generateCertificateId(),
      recipientName,
      recipientId,
      recipientEmail: recipientEmail || "",
      course,
      grade,
      issueDate: new Date(issueDate),
      status: "processing",
      pdfPath: null,
      qrCode: null,
      institutionId,
      templateId: Number(templateId),
    },
  });

  const { pdfUrl, verificationUrl, qrImageUrl, pdfBuffer } = await generateAndUploadPDF(
    certificate,
    template,
  );
  const chainData = await anchorCertificateOnChain(
    pdfBuffer,
    certificate.certificateId,
  );

  const updated = await prisma.certificate.update({
    where: { id: certificate.id },
    data: {
      pdfPath: pdfUrl,
      qrCode: verificationUrl,
      status: "issued",
      ...chainData,
    },
  });

  if (updated.recipientEmail) {
    console.log(`[Certificate Service] Awaiting certificate email dispatch to: ${updated.recipientEmail}`);
    try {
      await sendCertificateIssuedEmail(
        updated.recipientEmail,
        updated.recipientName,
        { ...updated, qrImageUrl },
        institution?.email,
        institution?.name,
        template,
        institution?.avatar,
      );
      console.log(`[Certificate Service] Email dispatched successfully for certificate ${updated.certificateId}`);
    } catch (e) {
      console.error(`[Certificate Service] Non-fatal email error for certificate ${updated.certificateId}:`, e.message);
    }
  } else {
    console.log("[Certificate Service] Skipping email because updated.recipientEmail is empty.");
  }

  return updated;
};

const issueBulk = async (institutionId, templateId, fileBuffer) => {
  const [template, institution] = await Promise.all([
    prisma.template.findFirst({
      where: { id: Number(templateId), institutionId },
    }),
    prisma.institution.findUnique({
      where: { id: institutionId },
      select: { name: true, email: true, avatar: true },
    }),
  ]);
  if (!template) throw { status: 404, message: "Template not found" };

  const rows = await parseCSV(fileBuffer);
  if (rows.length === 0) throw { status: 400, message: "CSV file is empty" };

  const results = [];
  const errors = [];

  for (const row of rows) {
    try {
      const getField = (possibleKeys) => {
        for (const key of possibleKeys) {
          if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
            return String(row[key]).trim();
          }
        }
        const rowKeys = Object.keys(row);
        for (const targetKey of possibleKeys) {
          const matchedKey = rowKeys.find((rk) => rk.toLowerCase().trim() === targetKey.toLowerCase().trim());
          if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null && String(row[matchedKey]).trim() !== "") {
            return String(row[matchedKey]).trim();
          }
        }
        return "";
      };

      const recipientName = getField(["recipientName", "name", "Recipient Name", "recipient_name", "Name"]);
      const recipientId = getField(["recipientId", "id", "Recipient ID", "recipient_id", "ID"]);
      const recipientEmail = getField(["recipientEmail", "email", "Recipient Email", "recipient_email", "Email"]);
      const course = getField(["course", "courseProgram", "Course / Program", "course_program", "Course"]);
      const grade = getField(["grade", "Grade"]);
      const rawIssueDate = getField(["issueDate", "date", "Issue Date", "issue_date", "Date"]);

      const parsedDate = rawIssueDate ? new Date(rawIssueDate) : new Date();

      const certificate = await prisma.certificate.create({
        data: {
          certificateId: generateCertificateId(),
          recipientName: recipientName || "",
          recipientId: recipientId || "",
          recipientEmail: recipientEmail || "",
          course: course || "",
          grade: grade || "",
          issueDate: isNaN(parsedDate.getTime()) ? new Date() : parsedDate,
          status: "processing",
          pdfPath: null,
          qrCode: null,
          institutionId,
          templateId: Number(templateId),
        },
      });

      const { pdfUrl, verificationUrl, qrImageUrl, pdfBuffer } = await generateAndUploadPDF(
        certificate,
        template,
      );
      const chainData = await anchorCertificateOnChain(
        pdfBuffer,
        certificate.certificateId,
      );

      const updated = await prisma.certificate.update({
        where: { id: certificate.id },
        data: {
          pdfPath: pdfUrl,
          qrCode: verificationUrl,
          status: "issued",
          ...chainData,
        },
      });

      if (updated.recipientEmail) {
        try {
          await sendCertificateIssuedEmail(
            updated.recipientEmail,
            updated.recipientName,
            { ...updated, qrImageUrl },
            institution?.email,
            institution?.name,
            template,
            institution?.avatar,
          );
        } catch (e) {
          console.error(`[Email Bulk Non-Fatal Error for row] ${updated.recipientEmail}:`, e.message);
        }
      }

      results.push(updated);
    } catch (err) {
      errors.push({ row, error: err.message });
    }
  }

  return {
    total: rows.length,
    issued: results.length,
    failed: errors.length,
    errors,
  };
};

const findCertificateByIdOrCode = async (id, institutionId) => {
  const cleanId = String(id || "").trim();
  const numericId = parseInt(cleanId, 10);
  const isNumeric = !isNaN(numericId) && String(numericId) === cleanId;

  return await prisma.certificate.findFirst({
    where: {
      institutionId,
      OR: [
        ...(isNumeric ? [{ id: numericId }] : []),
        { certificateId: cleanId },
        { certificateId: { equals: cleanId, mode: "insensitive" } },
      ],
    },
  });
};

const getCertificates = async (institutionId) => {
  return await prisma.certificate.findMany({
    where: { institutionId },
    orderBy: { createdAt: "desc" },
  });
};

const getCertificateById = async (id, institutionId) => {
  const cert = await findCertificateByIdOrCode(id, institutionId);
  if (!cert) throw { status: 404, message: "Certificate not found" };
  return cert;
};

const deleteCertificate = async (id, institutionId) => {
  const cert = await findCertificateByIdOrCode(id, institutionId);
  if (!cert) throw { status: 404, message: "Certificate not found" };
  await prisma.certificate.delete({ where: { id: cert.id } });
};

const revokeCertificate = async (id, institutionId) => {
  const cert = await findCertificateByIdOrCode(id, institutionId);
  if (!cert) throw { status: 404, message: "Certificate not found" };
  if (cert.status === "revoked") {
    throw { status: 400, message: "Certificate is already revoked" };
  }

  return await prisma.certificate.update({
    where: { id: cert.id },
    data: { status: "revoked" },
  });
};

module.exports = {
  issueSingle,
  issueBulk,
  getCertificates,
  getCertificateById,
  revokeCertificate,
  deleteCertificate,
};
