import React, { useState, useMemo } from "react";
import {
  Download,
  Copy,
  Check,
  ArrowLeft,
  Award,
  ExternalLink,
  Ban,
  Trash2,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import type { Certificate } from "../../redux/features/certificate/certificateTypes";
import { getStatusDisplay } from "../../utils/certificateDisplay";
import {
  useRevokeCertificateMutation,
  useDeleteCertificateMutation,
} from "../../redux/features/certificate/certificateAPI";
import ConfirmDialog from "../ui/ConfirmDialog";

interface CertificateDetailProps {
  certificate: Certificate;
  onBack: () => void;
}

export const CertificateDetail: React.FC<CertificateDetailProps> = ({
  certificate,
  onBack,
}) => {
  const [copied, setCopied] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [revokeCertificate, { isLoading: isRevoking }] =
    useRevokeCertificateMutation();
  const [deleteCertificate, { isLoading: isDeleting }] =
    useDeleteCertificateMutation();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async () => {
    try {
      await revokeCertificate(String(certificate.id)).unwrap();
      setIsRevokeModalOpen(false);
    } catch (err: any) {
      console.error("Failed to revoke certificate:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCertificate(String(certificate.id)).unwrap();
      setIsDeleteModalOpen(false);
      onBack();
    } catch (err: any) {
      console.error("Failed to delete certificate:", err);
    }
  };

  const statusDisplay = getStatusDisplay(certificate.status);
  const certId = certificate.certificateId || certificate.id;
  const courseName =
    certificate.course || (certificate as any).courseProgram || "N/A";
  const recipientName =
    certificate.recipientName || (certificate as any).name || "N/A";
  const blockchainTxHash =
    certificate.txHash ??
    certificate.hash ??
    (certificate as any).blockchainHash;

  const formattedIssueDate = useMemo(() => {
    if (!certificate?.issueDate) return "N/A";
    const d = new Date(certificate.issueDate);
    if (isNaN(d.getTime())) return String(certificate.issueDate);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, [certificate.issueDate]);

  const pdfViewerSrc = certificate.pdfPath
    ? `${certificate.pdfPath}#view=FitH&toolbar=0`
    : undefined;

  return (
    <div className="space-y-6">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-muted-foreground bg-card border border-border rounded-xl hover:bg-background transition-all cursor-pointer shadow-sm"
        >
          <ArrowLeft size={16} />
          Back to Certificates
        </button>

        <div className="flex items-center gap-2">
          {certificate.status !== "revoked" && (
            <button
              onClick={() => setIsRevokeModalOpen(true)}
              disabled={isRevoking}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl hover:bg-amber-500/20 transition-all cursor-pointer disabled:opacity-50"
            >
              <Ban size={14} />
              {isRevoking ? "Revoking..." : "Revoke Certificate"}
            </button>
          )}
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            <Trash2 size={14} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col">

          <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
            <h3 className="font-bold text-foreground text-sm">
              Certificate Preview
            </h3>
            <div className="flex items-center gap-2">
              {certificate.pdfPath && (
                <a
                  href={certificate.pdfPath}
                  download={`${certId}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-card border border-border rounded-xl hover:bg-background transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  Download PDF
                </a>
              )}
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-muted-foreground bg-card border border-border rounded-xl hover:bg-background transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check size={13} className="text-primary" />
                ) : (
                  <Copy size={13} />
                )}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          <div className="p-4 bg-background flex flex-col items-center justify-center min-h-[400px]">
            {pdfViewerSrc ? (
              <div className="w-full flex flex-col items-center gap-3">
                <iframe
                  src={pdfViewerSrc}
                  title={`Certificate ${certId}`}
                  className="w-full h-full min-h-[65vh] rounded-xl border border-border bg-white"
                />
                <a
                  href={certificate.pdfPath!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <ExternalLink size={13} /> Open PDF in new window
                </a>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center px-8 py-16">
                <p className="text-sm text-muted-foreground">
                  This certificate's PDF isn't available yet
                  {certificate.status === "processing" ||
                  (certificate.status as any) === "Pending"
                    ? " — it's still being generated."
                    : "."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-border">
            <Award className="text-primary w-5 h-5" />
            <h3 className="font-bold text-foreground text-sm">
              Certificate Information
            </h3>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground font-medium">
                Certificate ID
              </span>
              <span className="text-foreground font-semibold text-right font-mono text-xs select-all">
                {certId}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground font-medium">
                Recipient
              </span>
              <span className="text-foreground font-semibold text-right">
                {recipientName}
              </span>
            </div>
            {certificate.recipientEmail && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground font-medium">Email</span>
                <span
                  className="text-foreground font-semibold text-right truncate max-w-[200px]"
                  title={certificate.recipientEmail}
                >
                  {certificate.recipientEmail}
                </span>
              </div>
            )}
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground font-medium">Course</span>
              <span
                className="text-foreground font-semibold text-right max-w-[200px] truncate"
                title={courseName}
              >
                {courseName}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground font-medium">Grade</span>
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md bg-background text-foreground text-xs font-bold border border-border">
                {certificate.grade || "N/A"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground font-medium">
                Issue Date
              </span>
              <span className="text-foreground font-semibold">
                {formattedIssueDate}
              </span>
            </div>
            <div className="flex justify-between py-1 items-center">
              <span className="text-muted-foreground font-medium">Status</span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusDisplay.pill}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusDisplay.dot}`}
                />
                {statusDisplay.label}
              </span>
            </div>

            {certificate.qrCode && (
              <div className="pt-4 border-t border-border flex flex-col items-center gap-2">
                <span className="block w-full text-muted-foreground font-medium mb-1.5">
                  Verification QR Code
                </span>
                <div className="p-3 bg-white rounded-lg border border-border shadow-xs">
                  <QRCodeSVG value={certificate.qrCode} size={112} />
                </div>
                <a
                  href={certificate.qrCode}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-medium text-muted-foreground hover:text-primary hover:underline break-all text-center max-w-full"
                >
                  {certificate.qrCode}
                </a>
              </div>
            )}

            {blockchainTxHash && (
              <div className="pt-4 border-t border-border">
                <span className="block text-muted-foreground font-medium mb-1.5">
                  Blockchain Transaction Hash
                </span>
                <span className="block p-3 bg-background border border-border rounded-xl font-mono text-xs text-foreground break-all select-all">
                  {blockchainTxHash}
                </span>
              </div>
            )}

            {certificate.contractAddress && (
              <div>
                <span className="block text-muted-foreground font-medium mb-1.5">
                  Contract Address
                </span>
                <span className="block p-3 bg-background border border-border rounded-xl font-mono text-xs text-foreground break-all select-all">
                  {certificate.contractAddress}
                </span>
              </div>
            )}

            {certificate.txHash && (
              <a
                href={`https://etherscan.io/tx/${certificate.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-2"
              >
                <ExternalLink size={13} />
                View on Etherscan
              </a>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isRevokeModalOpen}
        title="Revoke Certificate"
        description={`Are you sure you want to revoke certificate "${certId}"? Once revoked, this status will be permanently updated.`}
        confirmLabel="Revoke"
        variant="danger"
        isLoading={isRevoking}
        onConfirm={handleRevoke}
        onCancel={() => setIsRevokeModalOpen(false)}
      />

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Certificate"
        description={`Are you sure you want to delete certificate "${certId}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default CertificateDetail;
