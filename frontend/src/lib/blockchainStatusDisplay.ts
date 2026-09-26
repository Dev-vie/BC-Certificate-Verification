import { CheckCircle, ShieldAlert, ShieldOff } from "lucide-react";
import type { BlockchainStatus } from "../redux/features/verification/verificationTypes";

export const BLOCKCHAIN_STATUS_DISPLAY: Record<
  BlockchainStatus,
  {
    label: string;
    description: string;
    className: string;
    icon: typeof CheckCircle;
  }
> = {
  VALID: {
    label: "Blockchain Verified",
    description: "Certificate matches current smart contract registry state.",
    className: "text-[#3D876C] bg-emerald-50 border-emerald-200/50",
    icon: CheckCircle,
  },
  REVOKED: {
    label: "Certificate Revoked",
    description:
      "This certificate has been revoked by the issuing institution.",
    className: "text-rose-600 bg-rose-50 border-rose-200/50",
    icon: ShieldOff,
  },
  NOT_ON_CHAIN: {
    label: "Verified in Records",
    description:
      "This certificate is on file, but hasn't been anchored on-chain.",
    className: "text-amber-600 bg-amber-50 border-amber-200/50",
    icon: ShieldAlert,
  },
};
