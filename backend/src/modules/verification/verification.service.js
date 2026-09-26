const prisma = require("../../prisma/prismaClient");
const {
  verifyCertificateOnChain,
  isBlockchainConfigured,
} = require("../../utils/blockchain");

const getBlockchainStatus = async (cert) => {
  if (!cert.hash) {
    return { status: "NOT_ON_CHAIN", onChain: null };
  }

  if (!isBlockchainConfigured()) {
    return {
      status: "NOT_ON_CHAIN",
      onChain: { hash: cert.hash, configured: false },
    };
  }

  const onChain = await verifyCertificateOnChain(cert.hash);

  if (!onChain.exists) {
    return { status: "NOT_ON_CHAIN", onChain: { hash: cert.hash, ...onChain } };
  }

  if (onChain.revoked) {
    return { status: "REVOKED", onChain: { hash: cert.hash, ...onChain } };
  }

  return { status: "VALID", onChain: { hash: cert.hash, ...onChain } };
};

const verifyCertificate = async (certificateId) => {
  if (!certificateId) throw { status: 400, message: "Certificate ID or Hash is required" };

  let cleanQuery = decodeURIComponent(certificateId).trim();
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
    include: { institution: true },
  });

  if (!cert) throw { status: 404, message: "Certificate not found" };

  const { status: blockchainStatus, onChain } = await getBlockchainStatus(cert);
  const dbValid = cert.status === "issued";

  return {
    valid: dbValid && blockchainStatus !== "REVOKED",
    blockchainStatus,
    certificate: {
      certificateId: cert.certificateId,
      recipientName: cert.recipientName,
      recipientId: cert.recipientId,
      course: cert.course,
      grade: cert.grade,
      issueDate: cert.issueDate,
      status: cert.status,
      issuedBy: cert.institution?.name || "Unknown Institution",
      hash: cert.hash,
      txHash: cert.txHash,
      blockNumber: cert.blockNumber,
      contractAddress: cert.contractAddress,
    },
    onChain,
  };
};

module.exports = { verifyCertificate };
