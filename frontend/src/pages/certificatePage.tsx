import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Shield, CheckCircle2, Clock, Ban } from "lucide-react";
import Sidebar from "../components/DashboardPage/sidebar";
import TableFilter, {
  type StatusFilterValue,
} from "../components/CertificatePage/tablefilter";
import Pagination from "../components/CertificatePage/pagination";
import Header from "../components/DashboardPage/header";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import CertificatePreviewModal from "../components/CertificatePage/CertificatePreviewModal";
import { useCertificateList } from "../hooks/useCertificateList";
import type { Certificate } from "../redux/features/certificate/certificateTypes";
import { useSidebar } from "../context/SidebarContext";
import { motion } from "motion/react";

export const CertificatePage: React.FC = () => {
  const navigate = useNavigate();
  const { isCollapsed, isMobile } = useSidebar();

  const {
    certificates,
    isLoading,
    isError,
    revokeCertificate,
    isRevoking,
    deleteCertificate,
    deleteCertificates,
    isDeleting,
  } = useCertificateList();

  const [showIssueDropdown, setShowIssueDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>("All");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [actionError, setActionError] = useState<string | null>(null);
  const [previewCertificate, setPreviewCertificate] =
    useState<Certificate | null>(null);
  const [pendingAction, setPendingAction] = useState<
    | { type: "revoke"; id: string }
    | { type: "delete"; id: string }
    | { type: "bulk-delete" }
    | null
  >(null);

  const totalIssued = certificates.length;
  const verifiedCount = certificates.filter(
    (c) => c.status === "issued",
  ).length;
  const pendingCount = certificates.filter(
    (c) => c.status === "processing",
  ).length;
  const revokedCount = certificates.filter(
    (c) => c.status === "revoked",
  ).length;

  const handleRowClick = (id: string) => {
    navigate(`/certificates/${id}`);
  };

  const handleViewDetail = (id: string) => {
    const cert = certificates.find(
      (c) => String(c.id) === String(id) || String(c.certificateId) === String(id),
    );
    if (cert) setPreviewCertificate(cert);
  };

  const handleRevoke = (id: string) => {
    setPendingAction({ type: "revoke", id });
  };

  const handleDelete = (id: string) => {
    setPendingAction({ type: "delete", id });
  };

  const handleBulkDelete = () => {
    setPendingAction({ type: "bulk-delete" });
  };

  const handleConfirmPendingAction = async () => {
    if (!pendingAction) return;

    try {
      setActionError(null);

      if (pendingAction.type === "revoke") {
        await revokeCertificate(pendingAction.id);
      } else if (pendingAction.type === "delete") {
        await deleteCertificate(pendingAction.id);
        setSelectedIds((prev) =>
          prev.filter((selectedId) => selectedId !== pendingAction.id),
        );
      } else {
        const { failed } = await deleteCertificates(selectedIds);
        if (failed.length > 0) {
          setActionError(
            `${failed.length} of ${selectedIds.length} certificates couldn't be deleted. Please try again.`,
          );
        }
        setSelectedIds((prev) => prev.filter((id) => failed.includes(id)));
      }

      setPendingAction(null);
    } catch (err) {
      console.error("Certificate action failed:", err);
      const label = pendingAction.type === "revoke" ? "revoke" : "delete";
      setActionError(`Couldn't ${label} — please try again.`);
      setPendingAction(null);
    }
  };

  const pendingCertificate =
    pendingAction?.type === "revoke" || pendingAction?.type === "delete"
      ? certificates.find((c) => c.id === pendingAction.id)
      : undefined;

  const confirmDialogCopy =
    pendingAction?.type === "revoke"
      ? {
          title: "Revoke this certificate?",
          description: `${
            pendingCertificate?.certificateId ?? "This certificate"
          } will be marked as revoked immediately. This can't be undone.`,
          confirmLabel: "Revoke",
          variant: "default" as const,
        }
      : pendingAction?.type === "bulk-delete"
      ? {
          title: `Delete ${selectedIds.length} certificate${
            selectedIds.length === 1 ? "" : "s"
          }?`,
          description:
            "This will permanently remove the selected certificates. This can't be undone.",
          confirmLabel: "Delete",
          variant: "danger" as const,
        }
      : {
          title: "Delete this certificate?",
          description: `${
            pendingCertificate?.certificateId ?? "This certificate"
          } will be permanently removed. This can't be undone.`,
          confirmLabel: "Delete",
          variant: "danger" as const,
        };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const filteredCertificates = certificates.filter((cert) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      cert.recipientName.toLowerCase().includes(query) ||
      cert.course.toLowerCase().includes(query) ||
      cert.certificateId.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === "All" || cert.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCertificates.length / itemsPerPage),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedCertificates = filteredCertificates.slice(
    (safeCurrentPage - 1) * itemsPerPage,
    safeCurrentPage * itemsPerPage,
  );

  const handleToggleSelectAll = (checked: boolean) => {
    const paginatedIds = paginatedCertificates.map((c) => c.id);
    if (checked) {
      setSelectedIds((prev) => {
        const uniqueNew = paginatedIds.filter((id) => !prev.includes(id));
        return [...prev, ...uniqueNew];
      });
    } else {
      setSelectedIds((prev) => prev.filter((id) => !paginatedIds.includes(id)));
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
        <Sidebar />
        <div
          className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out min-w-0 ${
            isMobile ? "ml-0" : isCollapsed ? "ml-[72px]" : "ml-[240px]"
          }`}
        >
          <Header />
          <div className="px-4 sm:px-8 py-6 max-w-full overflow-x-hidden space-y-6 animate-pulse select-none pointer-events-none">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-2">
                <div className="h-6 w-36 bg-card border border-border rounded-lg" />
                <div className="h-4 w-48 bg-card border border-border rounded-lg" />
              </div>
              <div className="h-9 w-28 bg-card border border-border rounded-xl" />
            </div>
            {/* Grid of cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-28 bg-card border border-border rounded-2xl" />
              ))}
            </div>
            {/* Table skeleton */}
            <div className="bg-card border border-border rounded-3xl p-6 space-y-4">
              <div className="h-8 w-full bg-accent/40 rounded-xl mb-4" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 w-full bg-accent/20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-rose-500 text-sm">
        Couldn't load certificates. Please try again.
      </div>
    );
  }

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
          className="px-4 sm:px-8 py-6 max-w-full overflow-x-hidden"
        >

          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Certificates
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {totalIssued} total certificates issued
              </p>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowIssueDropdown(!showIssueDropdown)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 shadow-lg shadow-emerald-500/10 transition-all cursor-pointer outline-none focus:ring-4 focus:ring-emerald-100"
              >
                <Plus size={16} />
                Issue New
              </button>

              {showIssueDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-15"
                    onClick={() => setShowIssueDropdown(false)}
                  />
                  <div className="absolute right-0 mt-2 w-52 bg-card border border-border rounded-xl shadow-lg z-20 overflow-hidden py-1">
                    <button
                      onClick={() => {
                        setShowIssueDropdown(false);
                        navigate("/issue-certificate?mode=individual");
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-foreground hover:bg-background transition-colors text-left cursor-pointer"
                    >
                      <Plus
                        size={14}
                        className="mr-2.5 text-muted-foreground"
                      />
                      Individual Issue
                    </button>
                    <button
                      onClick={() => {
                        setShowIssueDropdown(false);
                        navigate("/issue-certificate?mode=bulk");
                      }}
                      className="flex items-center w-full px-4 py-3 text-sm text-foreground hover:bg-background transition-colors text-left cursor-pointer border-t border-border"
                    >
                      <Plus
                        size={14}
                        className="mr-2.5 text-muted-foreground"
                      />
                      Bulk Issue via CSV
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {actionError && (
            <div className="mb-4 px-4 py-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-medium">
              {actionError}
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">

            {/* Total Card */}
            <div
              onClick={() => setStatusFilter("All")}
              className={`dashboard-stat-card bg-card rounded-xl border p-6 shadow-sm flex flex-col justify-between cursor-pointer select-none active:scale-98 transition-all duration-300 ${
                statusFilter === "All"
                  ? "border-[#3D876C] dark:border-[#4ca385] ring-1 ring-[#3D876C]/20 bg-[#3D876C]/[0.01]"
                  : "border-border hover:border-[#3D876C]/20"
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight leading-none mb-2">
                    {totalIssued}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Total
                  </p>
                </div>
                <div>
                  <Shield size={28} className="text-indigo-500 dark:text-indigo-400" />
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-indigo-600 dark:bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: "100%" }}
                />
              </div>
            </div>

            {/* Verified Card */}
            <div
              onClick={() => setStatusFilter("issued")}
              className={`dashboard-stat-card bg-card rounded-xl border p-6 shadow-sm flex flex-col justify-between cursor-pointer select-none active:scale-98 transition-all duration-300 ${
                statusFilter === "issued"
                  ? "border-[#3D876C] dark:border-[#4ca385] ring-1 ring-[#3D876C]/20 bg-[#3D876C]/[0.01]"
                  : "border-border hover:border-[#3D876C]/20"
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-3xl font-extrabold text-[#3D876C] dark:text-[#4ca385] tracking-tight leading-none mb-2">
                    {verifiedCount}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Verified
                  </p>
                </div>
                <div>
                  <CheckCircle2 size={28} className="text-[#3D876C] dark:text-[#4ca385]" />
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-[#3D876C] dark:bg-[#4ca385] rounded-full transition-all duration-500"
                  style={{ width: `${totalIssued > 0 ? (verifiedCount / totalIssued) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Pending Card */}
            <div
              onClick={() => setStatusFilter("processing")}
              className={`dashboard-stat-card bg-card rounded-xl border p-6 shadow-sm flex flex-col justify-between cursor-pointer select-none active:scale-98 transition-all duration-300 ${
                statusFilter === "processing"
                  ? "border-[#3D876C] dark:border-[#4ca385] ring-1 ring-[#3D876C]/20 bg-[#3D876C]/[0.01]"
                  : "border-border hover:border-[#3D876C]/20"
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-3xl font-extrabold text-amber-500 tracking-tight leading-none mb-2">
                    {pendingCount}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Pending
                  </p>
                </div>
                <div>
                  <Clock size={28} className="text-amber-500" />
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalIssued > 0 ? (pendingCount / totalIssued) * 100 : 0}%` }}
                />
              </div>
            </div>

            {/* Revoked Card */}
            <div
              onClick={() => setStatusFilter("revoked")}
              className={`dashboard-stat-card bg-card rounded-xl border p-6 shadow-sm flex flex-col justify-between cursor-pointer select-none active:scale-98 transition-all duration-300 ${
                statusFilter === "revoked"
                  ? "border-[#3D876C] dark:border-[#4ca385] ring-1 ring-[#3D876C]/20 bg-[#3D876C]/[0.01]"
                  : "border-border hover:border-[#3D876C]/20"
              }`}
            >
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-3xl font-extrabold text-rose-500 tracking-tight leading-none mb-2">
                    {revokedCount}
                  </p>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Revoked
                  </p>
                </div>
                <div>
                  <Ban size={28} className="text-rose-500" />
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${totalIssued > 0 ? (revokedCount / totalIssued) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <TableFilter
              certificates={paginatedCertificates}
              filteredCertificates={filteredCertificates}
              onRowClick={handleRowClick}
              onViewDetail={handleViewDetail}
              onRevoke={handleRevoke}
              onDelete={handleDelete}
              searchQuery={searchQuery}
              onSearchChange={(q) => {
                setSearchQuery(q);
                setCurrentPage(1);
              }}
              statusFilter={statusFilter}
              onStatusFilterChange={(s) => {
                setStatusFilter(s);
                setCurrentPage(1);
              }}
              selectedIds={selectedIds}
              onToggleSelectRow={handleToggleSelectRow}
              onToggleSelectAll={handleToggleSelectAll}
              onBulkDelete={handleBulkDelete}
            />

            <div className="flex justify-between items-center mt-4">
              <p className="text-xs text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {paginatedCertificates.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-foreground">
                  {filteredCertificates.length}
                </span>{" "}
                certificates
              </p>
              {totalPages > 1 && (
                <Pagination
                  currentPage={safeCurrentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>
          </div>
        </motion.main>
      </div>

      <CertificatePreviewModal
        certificate={previewCertificate}
        onClose={() => setPreviewCertificate(null)}
      />

      <ConfirmDialog
        isOpen={pendingAction !== null}
        title={confirmDialogCopy.title}
        description={confirmDialogCopy.description}
        confirmLabel={confirmDialogCopy.confirmLabel}
        variant={confirmDialogCopy.variant}
        isLoading={pendingAction?.type === "revoke" ? isRevoking : isDeleting}
        onConfirm={handleConfirmPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </div>
  );
};

export default CertificatePage;
