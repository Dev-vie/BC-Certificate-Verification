import {
  Calendar,
  FileText,
  GraduationCap,
  Hash,
  User,
  Mail,
  FileSpreadsheet,
  Loader2,
  Download,
  AlertCircle,
} from "lucide-react";
import type {
  IssueCertificateFormValues,
  IssueCertificateTemplate,
} from "./types";
import type { IssueBulkResult } from "../../redux/features/certificate/certificateTypes";
import TemplateSummaryCard from "./TemplateSummaryCard";
import FileUpload from "./fileupload";

interface CertificateIssueFormProps {
  template: IssueCertificateTemplate;
  mode: "individual" | "bulk";
  values: IssueCertificateFormValues;
  onChange: (updates: Partial<IssueCertificateFormValues>) => void;
  onSubmit: () => void;
  onChangeTemplate: () => void;
  issueStatus?: string;
  issueStatusVariant?: "success" | "error";
  onFileSelect?: (file: File | null) => void;
  isSubmitting?: boolean;
  issuedCertificateId?: string;
  bulkResetToken?: number;
  bulkResult?: IssueBulkResult | null;
}

const CSV_TEMPLATE_HEADERS =
  "recipientName,recipientId,recipientEmail,course,grade,issueDate\n" +
  "Amara Okafor,STU-2026-001,amara@example.com,Advanced Web Development,Distinction,2026-06-28\n";

const downloadCsvTemplate = () => {
  const blob = new Blob([CSV_TEMPLATE_HEADERS], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "certificate-issue-template.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const fieldClassName =
  "w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-2 focus:ring-primary/15";

export const CertificateIssueForm = ({
  template,
  mode,
  values,
  onChange,
  onSubmit,
  onChangeTemplate,
  issueStatus,
  issueStatusVariant = "success",
  onFileSelect,
  isSubmitting = false,
  issuedCertificateId,
  bulkResetToken,
  bulkResult,
}: CertificateIssueFormProps) => {
  return (
    <section className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden transition-colors duration-200">
      <div className="border-b border-border p-5">
        <TemplateSummaryCard
          template={template}
          onChangeTemplate={onChangeTemplate}
        />
      </div>

      <form
        className="p-5"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
      >
        {mode === "individual" ? (
          <div className="grid grid-cols-2 gap-4">
            <label className="col-span-2">
              <span className="mb-2 block text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Recipient Name *
              </span>
              <div className="relative">
                <User
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  className={`${fieldClassName} pl-10`}
                  value={values.recipientName}
                  onChange={(event) =>
                    onChange({ recipientName: event.target.value })
                  }
                  placeholder="e.g. Amara Okafor"
                />
              </div>
            </label>

            <div className="col-span-2 rounded-2xl border border-primary/30 bg-primary/5 p-4 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Automated Student Email Delivery *
                  </h4>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Enter the student's email address. Upon issuance, the official certificate (PDF & verification link) will be automatically emailed to this student from your institution account.
              </p>
              <div className="relative">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="email"
                  required
                  className={`${fieldClassName} pl-10 bg-card`}
                  value={values.recipientEmail}
                  onChange={(event) =>
                    onChange({ recipientEmail: event.target.value })
                  }
                  placeholder="e.g. student.email@example.com"
                />
              </div>
            </div>

            <label>
              <span className="mb-2 block text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Recipient ID
              </span>
              <div className="relative">
                <Hash
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  className={`${fieldClassName} pl-10`}
                  value={values.recipientId}
                  onChange={(event) =>
                    onChange({ recipientId: event.target.value })
                  }
                  placeholder="e.g. STU-2026-001"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Course / Program *
              </span>
              <div className="relative">
                <GraduationCap
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  className={`${fieldClassName} pl-10`}
                  value={values.courseProgram}
                  onChange={(event) =>
                    onChange({ courseProgram: event.target.value })
                  }
                  placeholder="e.g. Advanced Web Development"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Grade
              </span>
              <div className="relative">
                <FileText
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  className={`${fieldClassName} pl-10`}
                  value={values.grade}
                  onChange={(event) => onChange({ grade: event.target.value })}
                  placeholder="e.g. Distinction"
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Issue Date
              </span>
              <div className="relative">
                <Calendar
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="date"
                  className={`${fieldClassName} pl-10`}
                  value={values.issueDate}
                  onChange={(event) =>
                    onChange({ issueDate: event.target.value })
                  }
                />
              </div>
            </label>

            <label>
              <span className="mb-2 block text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                Certificate ID
              </span>
              <div className="relative">
                <Hash
                  size={16}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  className={`${fieldClassName} pl-10 opacity-60 cursor-not-allowed`}
                  value={issuedCertificateId ?? ""}
                  placeholder="Assigned automatically on submission"
                  readOnly
                />
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {issuedCertificateId
                  ? "Assigned by the server."
                  : "Generated when you issue this certificate · read-only"}
              </p>
            </label>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-background p-5 transition-colors duration-200">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-card p-3 shadow-sm text-primary border border-border">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-foreground">Bulk CSV upload</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Upload a CSV file with recipient rows to issue certificates
                    in one batch.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={downloadCsvTemplate}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground hover:bg-background transition-colors cursor-pointer"
              >
                <Download size={14} />
                Template
              </button>
            </div>

            <div className="mb-4 rounded-2xl border border-primary/30 bg-primary/5 p-4 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Automated Student Email Delivery
                  </h4>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Include the <code className="font-semibold text-foreground">recipientEmail</code> (or <code className="font-semibold text-foreground">email</code>) column in your CSV. For each student with an email, the official certificate (PDF & blockchain verification link) will be automatically sent to their inbox.
              </p>
            </div>

            <p className="mb-3 text-[11px] text-muted-foreground">
              Columns required:{" "}
              <code className="text-foreground">recipientName</code>,{" "}
              <code className="text-foreground">recipientId</code>,{" "}
              <code className="text-foreground">course</code>,{" "}
              <code className="text-foreground">grade</code>,{" "}
              <code className="text-foreground">issueDate</code>.{" "}
              <code className="text-foreground font-semibold">recipientEmail</code> (recommended for auto email delivery).
            </p>
            <FileUpload
              key={bulkResetToken}
              onFileSelect={onFileSelect}
              maxSizeMB={5}
            />

            {bulkResult && (
              <div
                className={`mt-4 rounded-xl border p-4 ${
                  bulkResult.failed > 0
                    ? "border-amber-500/30 bg-amber-500/10"
                    : "border-primary/30 bg-primary/10"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">
                  {bulkResult.issued} of {bulkResult.total} certificates issued
                  {bulkResult.failed > 0 ? `, ${bulkResult.failed} failed` : ""}
                  .
                </p>
                {bulkResult.errors.length > 0 && (
                  <ul className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                    {bulkResult.errors.map((err, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-1.5 text-xs text-muted-foreground"
                      >
                        <AlertCircle
                          size={13}
                          className="mt-0.5 shrink-0 text-amber-500"
                        />
                        <span>
                          {err.row?.recipientName ||
                            err.row?.recipientId ||
                            `Row ${index + 1}`}
                          : {err.error}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-colors hover:bg-primary-hover cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              {mode === "individual" ? "Issuing..." : "Processing CSV..."}
            </>
          ) : (
            <>
              {mode === "individual" ? (
                <User size={16} />
              ) : (
                <FileSpreadsheet size={16} />
              )}
              {mode === "individual"
                ? "Issue Certificate"
                : "Issue Certificates"}
            </>
          )}
        </button>

        {issueStatus && (
          <p
            className={`mt-3 text-center text-sm font-medium ${
              issueStatusVariant === "error"
                ? "text-rose-500"
                : "text-primary"
            }`}
          >
            {issueStatus}
          </p>
        )}
      </form>
    </section>
  );
};

export default CertificateIssueForm;
