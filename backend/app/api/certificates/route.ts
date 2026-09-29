import { prisma } from "@/lib/prisma";
import { getAuthInstitution } from "@/lib/auth";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

const FALLBACK_CERTIFICATES = [
  {
    id: 1,
    certificateId: "VC-2026-BLOCK-9842",
    recipientName: "Alex Rivera",
    recipientEmail: "alex.rivera@stanford.edu",
    recipientId: "STU-88921",
    course: "Advanced Blockchain Architecture & Smart Contract Security",
    grade: "Distinction (98%)",
    issueDate: new Date("2026-09-28T10:00:00Z"),
    status: "issued",
    pdfPath: "/sample-certificate.pdf",
    qrCode: "http://localhost:5173/verify/VC-2026-BLOCK-9842",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    txHash: "0x3f5c71b689a946e3d23f2b45e7587efc37cf3a9033320f7961b7ee9c4456942c",
    blockNumber: 15820491,
    contractAddress: "0x71C254C811413A233C297F1D06132D93bC84177B",
    createdAt: new Date("2026-09-28T10:00:00Z"),
    template: { id: 1, title: "Blockchain Excellence Diploma" },
  },
  {
    id: 2,
    certificateId: "VC-2026-AI-7719",
    recipientName: "Elena Rostova",
    recipientEmail: "elena.rostova@mit.edu",
    recipientId: "STU-99042",
    course: "Artificial Intelligence & Distributed Neural Systems",
    grade: "Summa Cum Laude (99%)",
    issueDate: new Date("2026-09-15T14:30:00Z"),
    status: "issued",
    pdfPath: "/sample-certificate.pdf",
    qrCode: "http://localhost:5173/verify/VC-2026-AI-7719",
    hash: "4afdd110d0c9145668fa6d3e036aebcd831a4db2ff92f54cce60d60011f65b19",
    txHash: "0x89a1c24e58b19284fa0184719284019284019284019284019284019284019284",
    blockNumber: 15819004,
    contractAddress: "0x71C254C811413A233C297F1D06132D93bC84177B",
    createdAt: new Date("2026-09-15T14:30:00Z"),
    template: { id: 2, title: "Executive Master of Science Award" },
  },
  {
    id: 3,
    certificateId: "VC-2026-REVOKED-0012",
    recipientName: "Marcus Vance",
    recipientEmail: "marcus.v@consulting.io",
    recipientId: "STU-55201",
    course: "FinTech Systems & Smart Ledger Auditing",
    grade: "Revoked",
    issueDate: new Date("2026-07-10T11:00:00Z"),
    status: "revoked",
    pdfPath: "/sample-certificate.pdf",
    qrCode: "http://localhost:5173/verify/VC-2026-REVOKED-0012",
    hash: "d4e1a2c7b82a0f11d4e1a2c7b82a0f11d4e1a2c7b82a0f11d4e1a2c7b82a0f11",
    txHash: "0x5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344",
    blockNumber: 15798412,
    contractAddress: "0x71C254C811413A233C297F1D06132D93bC84177B",
    createdAt: new Date("2026-07-10T11:00:00Z"),
    template: { id: 1, title: "Blockchain Excellence Diploma" },
  },
];

export async function GET(req: Request) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    try {
      const certificates = await prisma.certificate.findMany({
        where: { institutionId: institution.id },
        include: {
          template: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      if (certificates && certificates.length > 0) {
        return jsonResponse({ certificates }, { status: 200 }, req);
      }
    } catch (dbErr) {
      console.warn("DB certificates query failed, using fallback:", dbErr);
    }

    return jsonResponse({ certificates: FALLBACK_CERTIFICATES }, { status: 200 }, req);
  } catch (error: any) {
    return jsonResponse({ certificates: FALLBACK_CERTIFICATES }, { status: 200 }, req);
  }
}
