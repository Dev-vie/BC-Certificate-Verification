import { Link, useParams } from "react-router-dom";
import {
  Building,
  Calendar,
  GraduationCap,
  Hash,
  Loader2,
  ArrowLeft,
  AlertCircle,
  BadgeCheck,
  User,
} from "lucide-react";
import { useVerifyCertificateQuery } from "../redux/features/verification/verificationAPI";
import { BLOCKCHAIN_STATUS_DISPLAY } from "../lib/blockchainStatusDisplay";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function VerifyCertificatePage() {
  const { certificateId } = useParams<{ certificateId: string }>();

  const {
    data: result,
    isLoading,
    isError,
    error,
  } = useVerifyCertificateQuery(certificateId ?? "", {
    skip: !certificateId,
  });

  if (isError) {

    console.error("Verification request failed:", error);
  }

  return (
    <section className="min-h-screen bg-slate-50 py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <Card className="shadow-lg border-slate-200/80">
          <CardContent className="p-6 sm:p-8">

            {!certificateId && (
              <ErrorState message="No certificate ID was provided in this link." />
            )}

            {certificateId && isLoading && (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#3D876C] animate-spin" />
                <p className="text-sm text-slate-500 font-medium">
                  Checking certificate records and blockchain ledger...
                </p>
              </div>
            )}

            {certificateId && isError && (
              <ErrorState
                message={getErrorMessage(error)}
                debugInfo={getDebugInfo(error)}
              />
            )}

            {certificateId && !isLoading && !isError && result && (
              <VerificationDetails result={result} />
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function VerificationDetails({
  result,
}: {
  result: NonNullable<ReturnType<typeof useVerifyCertificateQuery>["data"]>;
}) {
  const statusDisplay =
    BLOCKCHAIN_STATUS_DISPLAY[result.blockchainStatus as keyof typeof BLOCKCHAIN_STATUS_DISPLAY] ||
    BLOCKCHAIN_STATUS_DISPLAY.NOT_ON_CHAIN;
  const StatusIcon = statusDisplay.icon;
  const { certificate, onChain } = result;

  return (
    <div className="space-y-6">

      <div
        className={`flex items-center gap-2.5 p-4 rounded-xl border ${statusDisplay.className}`}
      >
        <StatusIcon className="w-5.5 h-5.5 shrink-0" />
        <div className="text-left">
          <span className="block text-xs font-bold uppercase tracking-wider">
            {statusDisplay.label}
          </span>
          <span className="text-xs opacity-80">
            {statusDisplay.description}
          </span>
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-lg font-bold text-slate-900">
          {certificate.course}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Certificate ID:{" "}
          <span className="font-mono">{certificate.certificateId}</span>
        </p>
      </div>

      <div className="border border-slate-100 rounded-2xl bg-slate-50/50 p-4 space-y-3 text-left">
        <Row
          icon={User}
          label="Recipient"
          value={certificate.recipientName}
          bold
        />
        <Row
          icon={Hash}
          label="Recipient ID"
          value={certificate.recipientId}
          mono
        />
        <Row icon={GraduationCap} label="Grade" value={certificate.grade} />
        <Row
          icon={Building}
          label="Issuing Body"
          value={certificate.issuedBy}
          bold
        />
        <Row
          icon={Calendar}
          label="Issued On"
          value={new Date(certificate.issueDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        />
        <Row
          icon={BadgeCheck}
          label="Status"
          value={certificate.status}
          capitalize
          last
        />

        <div className="flex flex-col gap-1.5 pt-2 text-xs">
          <span className="text-slate-400 font-medium">
            Certificate Hash (SHA-256)
          </span>
          <span className="font-mono text-[10px] sm:text-xs text-[#3D876C] break-all bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/50 select-all">
            {certificate.hash || "—"}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-medium">
            Blockchain Transaction Hash
          </span>
          <span className="font-mono text-[10px] sm:text-xs text-slate-600 break-all bg-white p-2.5 rounded-xl border border-slate-200 select-all">
            {certificate.txHash || "Not anchored on-chain"}
          </span>
        </div>
      </div>

      <div className="border border-slate-100 rounded-2xl bg-white p-4 space-y-3 text-left">
        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          On-Chain Record
        </span>
        <Row label="Exists on Ledger" value={onChain.exists ? "Yes" : "No"} />
        <Row label="Revoked" value={onChain.revoked ? "Yes" : "No"} />
        <Row
          label="Block Number"
          value={certificate.blockNumber != null ? String(certificate.blockNumber) : "—"}
          mono
        />
        <div className="flex flex-col gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Contract Address</span>
          <span className="font-mono text-[10px] sm:text-xs text-slate-600 break-all bg-slate-50 p-2.5 rounded-xl border border-slate-200 select-all">
            {certificate.contractAddress || "—"}
          </span>
        </div>
        <div className="flex flex-col gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-medium">Issuer Address</span>
          <span className="font-mono text-[10px] sm:text-xs text-slate-600 break-all bg-slate-50 p-2.5 rounded-xl border border-slate-200 select-all">
            {onChain.issuerAddress || "—"}
          </span>
        </div>
      </div>

      <div className="flex justify-center pt-1">
        <Link to="/#verify-portal">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Verify another certificate
          </Button>
        </Link>
      </div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
  bold,
  mono,
  capitalize,
  last,
}: {
  icon?: typeof User;
  label: string;
  value: string;
  bold?: boolean;
  mono?: boolean;
  capitalize?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={`flex justify-between items-center text-xs sm:text-sm py-1.5 ${
        last ? "" : "border-b border-slate-100"
      }`}
    >
      <span className="text-slate-400 font-medium flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5" />}
        {label}
      </span>
      <span
        className={`text-slate-800 ${bold ? "font-bold" : "font-semibold"} ${
          mono ? "font-mono text-xs" : ""
        } ${capitalize ? "capitalize" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function ErrorState({
  message,
  debugInfo,
}: {
  message: string;
  debugInfo?: string;
}) {
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center gap-2.5 text-rose-600 bg-rose-50 border border-rose-200/50 p-4 rounded-xl">
        <AlertCircle className="w-5.5 h-5.5 shrink-0" />
        <div className="text-left">
          <span className="block text-xs font-bold uppercase tracking-wider">
            Verification Failed
          </span>
          <span className="text-xs opacity-80">{message}</span>
        </div>
      </div>
      {import.meta.env.DEV && debugInfo && (
        <p className="text-[10px] font-mono text-slate-400 bg-slate-50 border border-slate-200 rounded-lg p-2 break-all">
          debug (dev only): {debugInfo}
        </p>
      )}
      <div className="flex justify-center">
        <Link to="/#verify-portal">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Try a different certificate
          </Button>
        </Link>
      </div>
    </div>
  );
}

function getErrorMessage(err: unknown): string {
  if (err && typeof err === "object") {
    const maybe = err as { data?: { message?: string }; status?: number };
    if (maybe.data?.message) return maybe.data.message;
    if (maybe.status === 404) {
      return "No certificate found for this ID. It may have been removed, or the link may be incorrect.";
    }
  }
  return "Something went wrong while verifying this certificate. Please try again later.";
}

function getDebugInfo(err: unknown): string {
  if (err && typeof err === "object") {
    const maybe = err as {
      status?: number | string;
      data?: unknown;
      error?: string;
    };
    const bodyPreview =
      typeof maybe.data === "string"
        ? maybe.data.slice(0, 200)
        : JSON.stringify(maybe.data ?? maybe.error ?? "");
    return `status=${maybe.status ?? "unknown"} body=${bodyPreview}`;
  }
  return String(err);
}

export default VerifyCertificatePage;
