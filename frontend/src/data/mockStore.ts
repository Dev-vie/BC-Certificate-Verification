export interface MockCertificate {
  id: string;
  certificateId: string;
  recipientName: string;
  recipientEmail: string;
  recipientId: string;
  course: string;
  courseProgram?: string;
  grade: string;
  issueDate: string;
  status: "issued" | "revoked" | "Verified" | "Pending" | "Revoked";
  hash: string;
  txHash: string;
  blockNumber: number;
  contractAddress: string;
  pdfPath?: string;
  qrCode?: string;
  issuedBy?: string;
}

export const INITIAL_MOCK_CERTIFICATES: MockCertificate[] = [
  {
    id: "1",
    certificateId: "VC-2026-BLOCK-9842",
    recipientName: "Alex Rivera",
    recipientEmail: "alex.rivera@stanford.edu",
    recipientId: "STU-88921",
    course: "Advanced Blockchain Architecture & Smart Contract Security",
    courseProgram: "Advanced Blockchain Architecture & Smart Contract Security",
    grade: "Distinction (98%)",
    issueDate: "2026-09-28T10:00:00.000Z",
    status: "issued",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    txHash: "0x3f5c71b689a946e3d23f2b45e7587efc37cf3a9033320f7961b7ee9c4456942c",
    blockNumber: 15820491,
    contractAddress: "0x71C254C811413A233C297F1D06132D93bC84177B",
    pdfPath: "/sample-certificate.pdf",
    qrCode: "http://localhost:5173/verify/VC-2026-BLOCK-9842",
    issuedBy: "VeriCert Institute of Technology",
  },
  {
    id: "2",
    certificateId: "VC-2026-AI-7719",
    recipientName: "Elena Rostova",
    recipientEmail: "elena.rostova@mit.edu",
    recipientId: "STU-99042",
    course: "Artificial Intelligence & Distributed Neural Systems",
    courseProgram: "Artificial Intelligence & Distributed Neural Systems",
    grade: "Summa Cum Laude (99%)",
    issueDate: "2026-09-15T14:30:00.000Z",
    status: "issued",
    hash: "4afdd110d0c9145668fa6d3e036aebcd831a4db2ff92f54cce60d60011f65b19",
    txHash: "0x89a1c24e58b19284fa0184719284019284019284019284019284019284019284",
    blockNumber: 15819004,
    contractAddress: "0x71C254C811413A233C297F1D06132D93bC84177B",
    pdfPath: "/sample-certificate.pdf",
    qrCode: "http://localhost:5173/verify/VC-2026-AI-7719",
    issuedBy: "VeriCert Institute of Technology",
  },
  {
    id: "3",
    certificateId: "VC-2026-CYBER-3301",
    recipientName: "Kwame Asante",
    recipientEmail: "k.asante@oxford.ac.uk",
    recipientId: "STU-74218",
    course: "Zero-Knowledge Cryptography & Enterprise Security",
    courseProgram: "Zero-Knowledge Cryptography & Enterprise Security",
    grade: "Distinction",
    issueDate: "2026-08-20T09:15:00.000Z",
    status: "issued",
    hash: "1c9f7d33a9b24e819c123f4a9c123f4a9c123f4a9c123f4a9c123f4a9c123f4a",
    txHash: "0x9182374619283746192837461928374619283746192837461928374619283746",
    blockNumber: 15812089,
    contractAddress: "0x71C254C811413A233C297F1D06132D93bC84177B",
    pdfPath: "/sample-certificate.pdf",
    qrCode: "http://localhost:5173/verify/VC-2026-CYBER-3301",
    issuedBy: "VeriCert Institute of Technology",
  },
  {
    id: "4",
    certificateId: "VC-2026-REVOKED-0012",
    recipientName: "Marcus Vance",
    recipientEmail: "marcus.v@consulting.io",
    recipientId: "STU-55201",
    course: "FinTech Systems & Smart Ledger Auditing",
    courseProgram: "FinTech Systems & Smart Ledger Auditing",
    grade: "Revoked",
    issueDate: "2026-07-10T11:00:00.000Z",
    status: "revoked",
    hash: "d4e1a2c7b82a0f11d4e1a2c7b82a0f11d4e1a2c7b82a0f11d4e1a2c7b82a0f11",
    txHash: "0x5566778899aabbccddeeff00112233445566778899aabbccddeeff0011223344",
    blockNumber: 15798412,
    contractAddress: "0x71C254C811413A233C297F1D06132D93bC84177B",
    pdfPath: "/sample-certificate.pdf",
    qrCode: "http://localhost:5173/verify/VC-2026-REVOKED-0012",
    issuedBy: "VeriCert Institute of Technology",
  },
];

export const MOCK_TEMPLATES = [
  {
    id: "1",
    title: "Blockchain Excellence Diploma",
    filePath: "/templates/sample-diploma.png",
    placeholders: [
      { id: "recipientName", x: 400, y: 240, width: 600, height: 40, align: "center", fontSize: 28, fontFamily: "Times-Bold", color: "#0F172A" },
      { id: "course", x: 400, y: 310, width: 600, height: 35, align: "center", fontSize: 18, fontFamily: "Helvetica", color: "#334155" },
      { id: "issueDate", x: 260, y: 440, width: 200, height: 30, align: "center", fontSize: 14, fontFamily: "Helvetica", color: "#64748B" },
      { id: "qrCode", x: 620, y: 400, width: 80, height: 80, align: "center" }
    ],
    fieldsCount: 4,
    createdAt: "2026-09-01T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Executive Master of Science Award",
    filePath: "/templates/sample-master.png",
    placeholders: [
      { id: "recipientName", x: 400, y: 220, width: 600, height: 40, align: "center", fontSize: 26, fontFamily: "Times-Bold", color: "#0F172A" },
      { id: "course", x: 400, y: 290, width: 600, height: 35, align: "center", fontSize: 18, fontFamily: "Helvetica", color: "#334155" },
      { id: "grade", x: 400, y: 340, width: 200, height: 30, align: "center", fontSize: 15, fontFamily: "Helvetica", color: "#059669" },
      { id: "qrCode", x: 640, y: 420, width: 75, height: 75, align: "center" }
    ],
    fieldsCount: 4,
    createdAt: "2026-09-05T00:00:00.000Z",
  }
];

export const MOCK_INSTITUTION = {
  id: 1,
  name: "VeriCert Institute of Technology",
  email: "demo@vericert.edu",
  avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=VeriCert",
  isVerified: true,
  twoFactorEnabled: false,
};

export function getStoredCertificates(): MockCertificate[] {
  if (typeof window === "undefined") return INITIAL_MOCK_CERTIFICATES;
  try {
    const raw = localStorage.getItem("vericert_certificates") || localStorage.getItem("authentix_certificates");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  localStorage.setItem("vericert_certificates", JSON.stringify(INITIAL_MOCK_CERTIFICATES));
  return INITIAL_MOCK_CERTIFICATES;
}

export function saveStoredCertificates(certs: MockCertificate[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("vericert_certificates", JSON.stringify(certs));
}

export function getStoredTemplates() {
  if (typeof window === "undefined") return MOCK_TEMPLATES;
  try {
    const raw = localStorage.getItem("vericert_templates") || localStorage.getItem("authentix_templates");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  localStorage.setItem("vericert_templates", JSON.stringify(MOCK_TEMPLATES));
  return MOCK_TEMPLATES;
}

export function saveStoredTemplates(templates: any[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("vericert_templates", JSON.stringify(templates));
}

export function createMockCertificate(data: {
  recipientName: string;
  recipientEmail?: string;
  recipientId?: string;
  course: string;
  grade?: string;
  issueDate?: string;
  templateId?: string | number;
}): MockCertificate {
  const certs = getStoredCertificates();
  const year = new Date().getFullYear();
  const rand1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const rand2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const certificateId = `VC-${year}-${rand1}-${rand2}`;

  const hexChars = "0123456789abcdef";
  let hash = "";
  let txHash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += hexChars[Math.floor(Math.random() * 16)];
    txHash += hexChars[Math.floor(Math.random() * 16)];
  }

  const newCert: MockCertificate = {
    id: String(certs.length + 1),
    certificateId,
    recipientName: data.recipientName.trim(),
    recipientEmail: data.recipientEmail?.trim() || "student@example.com",
    recipientId: data.recipientId?.trim() || `STU-${Math.floor(10000 + Math.random() * 90000)}`,
    course: data.course.trim(),
    courseProgram: data.course.trim(),
    grade: data.grade?.trim() || "Distinction (95%)",
    issueDate: data.issueDate ? new Date(data.issueDate).toISOString() : new Date().toISOString(),
    status: "issued",
    hash,
    txHash,
    blockNumber: Math.floor(15820000 + Math.random() * 5000),
    contractAddress: "0x71C254C811413A233C297F1D06132D93bC84177B",
    pdfPath: "/sample-certificate.pdf",
    qrCode: `${typeof window !== "undefined" ? window.location.origin : "http://localhost:5173"}/verify/${certificateId}`,
    issuedBy: MOCK_INSTITUTION.name,
  };

  const updated = [newCert, ...certs];
  saveStoredCertificates(updated);
  return newCert;
}

export function revokeMockCertificate(idOrCertId: string): MockCertificate | null {
  const certs = getStoredCertificates();
  const idx = certs.findIndex(
    (c) => c.id === idOrCertId || c.certificateId === idOrCertId
  );
  if (idx === -1) return null;
  const updated = [...certs];
  updated[idx] = {
    ...updated[idx],
    status: "revoked",
    grade: "Revoked",
  };
  saveStoredCertificates(updated);
  return updated[idx];
}

export function deleteMockCertificate(id: string): boolean {
  const certs = getStoredCertificates();
  const filtered = certs.filter((c) => c.id !== id && c.certificateId !== id);
  saveStoredCertificates(filtered);
  return true;
}

export function findMockCertificate(query: string): MockCertificate | null {
  const certs = getStoredCertificates();
  const clean = decodeURIComponent(query).trim().toLowerCase();
  const cleanHash = clean.startsWith("0x") ? clean.slice(2) : clean;

  return (
    certs.find((c) => {
      const cId = c.certificateId.toLowerCase();
      const cHash = (c.hash || "").toLowerCase();
      const cTx = (c.txHash || "").toLowerCase();
      return (
        cId === clean ||
        cId.includes(clean) ||
        cHash === clean ||
        cHash === cleanHash ||
        cTx === clean ||
        cTx === cleanHash
      );
    }) || null
  );
}

export function verifyMockCertificate(query: string) {
  const cert = findMockCertificate(query);

  if (!cert) {
    // Generate synthetic on-the-fly verification result for any unrecognized ID so demo never looks broken!
    const year = new Date().getFullYear();
    const syntheticId = query.startsWith("VC-") ? query : `VC-${year}-VERI-${query.slice(0, 4).toUpperCase()}`;
    const isRevoked = query.toLowerCase().includes("revok") || query.toLowerCase().includes("tamper");

    return {
      valid: !isRevoked,
      blockchainStatus: isRevoked ? ("REVOKED" as const) : ("VALID" as const),
      certificate: {
        certificateId: syntheticId,
        recipientName: "Verified Scholar",
        recipientId: "STU-99420",
        course: "Decentralized Systems & Blockchain Technology",
        grade: isRevoked ? "Revoked by Institution" : "Distinction (98%)",
        issueDate: new Date().toISOString(),
        status: isRevoked ? "revoked" : "issued",
        issuedBy: "VeriCert Institute of Technology",
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        txHash: "0x3f5c71b689a946e3d23f2b45e7587efc37cf3a9033320f7961b7ee9c4456942c",
        blockNumber: 15820491,
        contractAddress: "0x71C254C811413A233C297F1D06132D93bC84177B",
        pdfPath: "/sample-certificate.pdf",
        qrCode: `http://localhost:5173/verify/${syntheticId}`,
      },
      onChain: {
        hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        exists: true,
        revoked: isRevoked,
        issuerAddress: "0x71C254C811413A233C297F1D06132D93bC84177B",
        issuedAt: new Date().toISOString(),
        certId: syntheticId,
      },
    };
  }

  const isRevoked = cert.status === "revoked" || cert.status === "Revoked";
  return {
    valid: !isRevoked,
    blockchainStatus: isRevoked ? ("REVOKED" as const) : ("VALID" as const),
    certificate: {
      certificateId: cert.certificateId,
      recipientName: cert.recipientName,
      recipientId: cert.recipientId,
      course: cert.course,
      grade: cert.grade,
      issueDate: cert.issueDate,
      status: isRevoked ? "revoked" : "issued",
      issuedBy: cert.issuedBy || "VeriCert Institute of Technology",
      hash: cert.hash,
      txHash: cert.txHash,
      blockNumber: cert.blockNumber,
      contractAddress: cert.contractAddress,
      pdfPath: cert.pdfPath || "/sample-certificate.pdf",
      qrCode: cert.qrCode || `http://localhost:5173/verify/${cert.certificateId}`,
    },
    onChain: {
      hash: cert.hash,
      exists: true,
      revoked: isRevoked,
      issuerAddress: cert.contractAddress,
      issuedAt: cert.issueDate,
      certId: cert.certificateId,
    },
  };
}

export function getMockDashboardStats() {
  const certs = getStoredCertificates();
  const total = certs.length;
  const active = certs.filter((c) => c.status !== "revoked" && c.status !== "Revoked").length;
  return {
    totalIssued: total,
    totalIssuedChangePercent: 14.2,
    verifiedToday: Math.floor(total * 0.4) + 6,
    verifiedTodayChangeCount: 8,
    activeRecipients: active,
    activeProgramsCount: 4,
    verificationRate: 98.7,
  };
}

export function seedDemoAuth() {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", "vericert-competition-demo-jwt");
  localStorage.setItem("isAuthenticated", "true");
  localStorage.setItem("institution", JSON.stringify(MOCK_INSTITUTION));
}

// Auto-seed on load if empty
if (typeof window !== "undefined") {
  getStoredCertificates();
  getStoredTemplates();
}
