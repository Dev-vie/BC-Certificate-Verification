export type VerifyTab = "link" | "hash" | "qr";

export type VerifyStatus = "idle" | "verifying" | "success" | "error";

export type BlockchainStatus = "VALID" | "REVOKED" | "NOT_ON_CHAIN";

export interface VerifiedCertificate {
  certificateId: string;
  recipientName: string;
  recipientId: string;
  course: string;
  grade: string;
  issueDate: string;
  status: string;
  issuedBy: string;
  hash: string;
  txHash: string;
  blockNumber: number;
  contractAddress: string;
}

export interface OnChainRecord {
  hash: string;
  exists: boolean;
  revoked: boolean;
  issuerAddress: string;
  issuedAt: string;
  certId: string;
}

export interface VerificationResult {
  valid: boolean;
  blockchainStatus: BlockchainStatus;
  certificate: VerifiedCertificate;
  onChain: OnChainRecord;
}

export interface VerificationUIState {
  activeTab: VerifyTab;
  inputValue: string;
  verifyStatus: VerifyStatus;
  errorMessage: string;
  result: VerificationResult | null;
  isCameraActive: boolean;
  selectedDevice: string | null;
  isPaused: boolean;
  scannerError: string | null;
}
