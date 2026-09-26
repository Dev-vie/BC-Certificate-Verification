import { useEffect, useState } from "react";
import { X, ExternalLink, Download } from "lucide-react";
import { getStatusDisplay } from "../../utils/certificateDisplay";
import type { Certificate } from "../../redux/features/certificate/certificateTypes";

interface CertificatePreviewModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export function CertificatePreviewModal({
  certificate,
  onClose,
}: CertificatePreviewModalProps) {

  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!certificate) {
      setEntered(false);
      return;
    }
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [certificate]);

  if (!certificate) return null;

  const statusDisplay = getStatusDisplay(certificate.status);
  const certId = certificate.certificateId || certificate.id;
  const courseName =
    certificate.course || (certificate as any).courseProgram || "N/A";

  const pdfViewerSrc = certificate.pdfPath
    ? `${certificate.pdfPath}#view=FitH&toolbar=0`
    : undefined;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm overflow-y-auto scroll-smooth transition-opacity duration-300 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`w-full max-w-5xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh] my-auto transition-all duration-300 ease-out ${
          entered
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-3"
        }`}
        onClick={(event) => event.stopPropagation()}
      >

        <div className="flex items-start justify-between border-b border-border px-6 py-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="font-mono text-xs text-muted-foreground">
                {certId}
              </p>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusDisplay.pill}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusDisplay.dot}`}
                />
                {statusDisplay.label}
              </span>
            </div>
            <h3 className="font-bold text-foreground">
              {certificate.recipientName}
            </h3>
            <p className="text-sm text-muted-foreground">{courseName}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close preview"
            className="p-2 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-hidden bg-background p-4">
          {pdfViewerSrc ? (
            <iframe
              src={pdfViewerSrc}
              title={`Certificate ${certId}`}
              className="w-full h-full min-h-[65vh] rounded-xl border border-border bg-white"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center px-8">
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

        {certificate.pdfPath && (
          <div className="flex items-center gap-3 border-t border-border px-6 py-4">
            <a
              href={certificate.pdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border bg-background text-foreground text-sm font-semibold hover:bg-card transition-colors cursor-pointer"
            >
              <ExternalLink size={14} />
              Open in new tab
            </a>
            <a
              href={certificate.pdfPath}
              download={`${certId}.pdf`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3D876C] hover:bg-[#2C6450] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <Download size={14} />
              Download
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default CertificatePreviewModal;
