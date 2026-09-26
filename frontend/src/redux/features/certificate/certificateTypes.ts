export type CertificateStatus = "processing" | "issued" | "failed" | "revoked";

export interface Certificate {
  id: string;
  certificateId: string;
  recipientName: string;
  recipientId: string;
  recipientEmail: string;
  course: string;
  grade: string;
  issueDate: string;
  status: CertificateStatus;
  pdfPath: string | null;
  qrCode: string | null;
  hash?: string | null;
  txHash?: string | null;
  blockNumber?: number | null;
  contractAddress?: string | null;
  institutionId: number;
  templateId: number;
  createdAt: string;
  updatedAt: string;
}

export interface IssueSingleCertificatePayload {
  recipientName: string;
  recipientId: string;
  recipientEmail?: string;
  course: string;
  grade: string;
  issueDate: string;
  templateId: number;
}

export interface IssueBulkCertificatesPayload {
  templateId: number;
  file: File;
}

export interface IssueBulkResult {
  total: number;
  issued: number;
  failed: number;
  errors: Array<{ row: Record<string, string>; error: string }>;
}
