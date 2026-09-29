import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  Plus,
  LayoutTemplate,
  Layers,
  ArrowRight,
  AlertCircle,
  Loader2,
  CircleHelp,
} from "lucide-react";
import Sidebar from "../components/DashboardPage/sidebar";
import ModeToggle from "../components/issue-certificate/ModeToggle";
import CertificateIssueForm from "../components/issue-certificate/CertificateIssueForm";
import TemplatePickerModal from "../components/issue-certificate/TemplatePickerModal";
import IssueHowItWorksModal from "../components/issue-certificate/IssueHowItWorksModal";
import Header from "../components/DashboardPage/header";
import CreateNewTemplate from "../components/TemplatePage/createnewtemplate";
import type { IssueCertificateFormValues } from "../components/issue-certificate/types";
import type { IssueBulkResult } from "../redux/features/certificate/certificateTypes";
import { useIssueCertificate } from "../hooks/useCertificate";
import { useTemplates } from "../hooks/useTemplate";
import { useSidebar } from "../context/SidebarContext";
import { motion } from "motion/react";

const getToday = () => new Date().toISOString().slice(0, 10);

const emptyFormValues = (): IssueCertificateFormValues => ({
  recipientName: "",
  recipientEmail: "",
  recipientId: "",
  courseProgram: "",
  grade: "",
  issueDate: getToday(),
});

const IssueCerficatePage = () => {
  const navigate = useNavigate();
  const { isCollapsed, isMobile } = useSidebar();
  const [searchParams] = useSearchParams();
  const queryMode = searchParams.get("mode");
  const initialMode =
    queryMode === "individual" || queryMode === "bulk"
      ? queryMode
      : "individual";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formValues, setFormValues] = useState<IssueCertificateFormValues>(
    emptyFormValues(),
  );
  const [issueStatus, setIssueStatus] = useState("");
  const [issueStatusVariant, setIssueStatusVariant] = useState<
    "success" | "error"
  >("success");
  const [issuedCertificateId, setIssuedCertificateId] = useState<
    string | undefined
  >(undefined);
  const [bulkResult, setBulkResult] = useState<IssueBulkResult | null>(null);
  const [bulkResetToken, setBulkResetToken] = useState(0);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  const {
    templates,
    isLoadingTemplates,
    isTemplatesError,
    selectedTemplate,
    selectedTemplateId,
    setSelectedTemplateId,
    mode,
    setMode,
    isPickerOpen,
    openTemplatePicker,
    closeTemplatePicker,
    issueSingleCertificate,
    isIssuing,
    issueBulkCertificates,
    isIssuingBulk,
  } = useIssueCertificate();

  const {
    uploadTemplate,
    isUploading,
    isCreateModalOpen,
    openCreateModal,
    closeCreateModal,
  } = useTemplates();

  useEffect(() => {
    setMode(initialMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedTemplateId && templates.length > 0) {
      setSelectedTemplateId(templates[0].id);
    }
  }, [templates, selectedTemplateId, setSelectedTemplateId]);

  const handleCreateTemplate = async (data: { title: string; file: File }) => {
    try {
      const newTemplate = await uploadTemplate({
        title: data.title,
        file: data.file,
      });
      closeCreateModal();
      navigate(`/templates/${newTemplate.id}/edit`);
    } catch (err) {
      console.error("Failed to upload template:", err);
    }
  };

  const handleSubmit = async () => {
    if (mode === "bulk") {
      if (!selectedFile) {
        setIssueStatusVariant("error");
        setIssueStatus("Please upload a CSV file first.");
        return;
      }
      if (!selectedTemplate) {
        setIssueStatusVariant("error");
        setIssueStatus("Please select a template first.");
        return;
      }

      try {
        setIssueStatus("");
        setBulkResult(null);
        const result = await issueBulkCertificates({
          templateId: Number(selectedTemplate.id),
          file: selectedFile,
        });

        setBulkResult(result);
        setIssueStatusVariant(result.failed > 0 ? "error" : "success");
        setIssueStatus(
          result.failed > 0
            ? `${result.issued} of ${result.total} certificates issued — ${result.failed} failed. See details below.`
            : `All ${result.issued} certificates issued successfully.`,
        );
        setSelectedFile(null);
        setBulkResetToken((token) => token + 1);
      } catch (err) {
        console.error("Failed to issue bulk certificates:", err);
        setIssueStatusVariant("error");
        setIssueStatus(
          "Failed to process the CSV file. Check the column headers and try again.",
        );
      }
      return;
    }

    if (!selectedTemplate) {
      setIssueStatusVariant("error");
      setIssueStatus("Please select a template first.");
      return;
    }

    const {
      recipientName,
      recipientEmail,
      recipientId,
      courseProgram,
      grade,
      issueDate,
    } = formValues;

    if (
      !recipientName ||
      !recipientEmail ||
      !recipientId ||
      !courseProgram ||
      !grade ||
      !issueDate
    ) {
      setIssueStatusVariant("error");
      setIssueStatus("Please fill in all required fields including student email.");
      return;
    }

    try {
      setIssueStatus("");
      const certificate = await issueSingleCertificate({
        recipientName,
        recipientEmail,
        recipientId,
        course: courseProgram,
        grade,
        issueDate,
        templateId: Number(selectedTemplate.id),
      });

      setIssuedCertificateId(certificate.certificateId);
      setIssueStatusVariant("success");
      setIssueStatus(
        `Certificate ${certificate.certificateId} issued successfully${
          recipientEmail ? " & email sent to student" : ""
        }.`,
      );
      setFormValues(emptyFormValues());
    } catch (err: any) {
      console.error("Failed to issue certificate:", err);
      setIssueStatusVariant("error");
      const errorMsg =
        err?.data?.message ||
        err?.message ||
        "Failed to issue certificate. Please try again.";
      setIssueStatus(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      <Sidebar />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out min-w-0 ${
          isMobile ? "ml-0" : isCollapsed ? "ml-[72px]" : "ml-[240px]"
        }`}
      >
        <Header />

        <motion.main
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="px-4 sm:px-8 py-6 max-w-7xl mx-auto overflow-x-hidden"
        >

          <div className="mb-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Issue Certificate
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fill in recipient details and issue a blockchain-verified
                  certificate.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsHowItWorksOpen(true)}
                  className="inline-flex items-center justify-center text-slate-400 hover:text-primary-light transition-colors cursor-pointer p-1"
                >
                  <CircleHelp size={18} />
                </button>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-all shadow-sm shadow-primary/10 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>New Template</span>
                </button>
              </div>
            </div>

            {selectedTemplate && (
              <div className="mt-5">
                <ModeToggle
                  value={mode}
                  onChange={(nextMode) => {
                    setMode(nextMode);
                    setIssueStatus("");
                    setBulkResult(null);
                  }}
                />
              </div>
            )}
          </div>

          {isLoadingTemplates && (
            <div className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-border text-center space-y-4 shadow-sm">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <div>
                <p className="text-base font-semibold text-foreground">
                  Loading certificate templates...
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Connecting to institution template repository
                </p>
              </div>
            </div>
          )}

          {!isLoadingTemplates && isTemplatesError && (
            <div className="p-8 bg-card rounded-3xl border border-rose-500/20 text-center space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Unable to load templates
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                  There was an issue fetching your certificate templates. Please
                  check your connection or reload the page.
                </p>
              </div>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                Reload Page
              </button>
            </div>
          )}

          {!isLoadingTemplates && !isTemplatesError && !selectedTemplate && (
            <div className="space-y-6">

              <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card via-card to-primary/5 p-8 sm:p-10 shadow-sm">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-emerald-600 dark:text-primary-light text-xs font-semibold uppercase tracking-wider mb-4">
                    <LayoutTemplate size={13} />
                    <span>Create Your Template First</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    Create your first certificate template
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                    To issue blockchain-anchored certificates, you need at least
                    one template design. Upload your institution's PDF certificate
                    and map where recipient names, dates, and QR verification codes
                    should appear.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={openCreateModal}
                      className="inline-flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-primary/20 cursor-pointer"
                    >
                      <Plus size={18} />
                      <span>Create New Template</span>
                      <ArrowRight size={16} />
                    </button>
                    <Link
                      to="/templates"
                      className="inline-flex items-center gap-2 px-4 py-3 bg-muted/60 hover:bg-muted text-foreground text-sm font-medium border border-border rounded-xl transition-all cursor-pointer"
                    >
                      <Layers size={16} className="text-muted-foreground" />
                      <span>Manage Templates</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 font-bold text-sm">
                    1
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Upload Certificate PDF
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Upload your institution's standard certificate design or
                    blank diploma layout in PDF format.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4 font-bold text-sm">
                    2
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Position Placeholders
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Drag and drop recipient name, grade, issue date, and QR code
                    elements to the exact position.
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border shadow-xs hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4 font-bold text-sm">
                    3
                  </div>
                  <h3 className="text-base font-bold text-foreground">
                    Issue & Anchor On-Chain
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    Issue individual credentials or batch issue via CSV with
                    automated cryptographic blockchain hashing.
                  </p>
                </div>
              </div>
            </div>
          )}

          {!isLoadingTemplates && !isTemplatesError && selectedTemplate && (
            <div className="grid grid-cols-1 gap-5 items-start">
              <CertificateIssueForm
                template={selectedTemplate}
                mode={mode}
                values={formValues}
                onChange={(updates) =>
                  setFormValues((current: IssueCertificateFormValues) => ({
                    ...current,
                    ...updates,
                  }))
                }
                onSubmit={handleSubmit}
                onChangeTemplate={openTemplatePicker}
                onFileSelect={setSelectedFile}
                issueStatus={issueStatus}
                issueStatusVariant={issueStatusVariant}
                isSubmitting={mode === "bulk" ? isIssuingBulk : isIssuing}
                issuedCertificateId={issuedCertificateId}
                bulkResetToken={bulkResetToken}
                bulkResult={bulkResult}
              />
            </div>
          )}
        </motion.main>
      </div>

      <TemplatePickerModal
        isOpen={isPickerOpen}
        templates={templates}
        selectedTemplateId={selectedTemplateId ?? undefined}
        onSelect={(templateId) => {
          setSelectedTemplateId(templateId);
          closeTemplatePicker();
        }}
        onClose={closeTemplatePicker}
      />

      <IssueHowItWorksModal
        isOpen={isHowItWorksOpen}
        onClose={() => setIsHowItWorksOpen(false)}
      />

      <CreateNewTemplate
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onSubmit={handleCreateTemplate}
        isSubmitting={isUploading}
      />
    </div>
  );
};

export default IssueCerficatePage;
