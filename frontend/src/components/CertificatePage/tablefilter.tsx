import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  Download,
  Eye,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import type {
  Certificate,
  CertificateStatus,
} from "../../redux/features/certificate/certificateTypes";
import {
  STATUS_DISPLAY,
  STATUS_FILTER_OPTIONS,
  getAvatarInitials,
  getAvatarColorClass,
} from "../../utils/certificateDisplay";

export type StatusFilterValue = CertificateStatus | "All";

interface TableFilterProps {
  certificates: Certificate[];
  filteredCertificates: Certificate[];
  onRowClick: (id: string) => void;
  onViewDetail: (id: string) => void;
  onRevoke?: (id: string) => void;
  onDelete?: (id: string) => void;

  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: StatusFilterValue;
  onStatusFilterChange: (status: StatusFilterValue) => void;

  selectedIds: string[];
  onToggleSelectRow: (id: string) => void;
  onToggleSelectAll: (checked: boolean) => void;
  onBulkDelete?: () => void;
}

export const TableFilter: React.FC<TableFilterProps> = ({
  certificates,
  filteredCertificates,
  onRowClick,
  onViewDetail,
  onRevoke,
  onDelete,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  selectedIds,
  onToggleSelectRow,
  onToggleSelectAll,
  onBulkDelete,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleStatusFilterSelect = (status: StatusFilterValue) => {
    onStatusFilterChange(status);
    setIsDropdownOpen(false);
  };

  const activeFilterLabel =
    STATUS_FILTER_OPTIONS.find((option) => option.value === statusFilter)
      ?.label ?? "All";

  const allPaginatedSelected =
    certificates.length > 0 &&
    certificates.every((cert) => selectedIds.includes(cert.id));

  const somePaginatedSelected =
    certificates.some((cert) => selectedIds.includes(cert.id)) &&
    !allPaginatedSelected;

  const handleExportCSV = () => {
    const headers = [
      "Student Name",
      "Email",
      "Certificate ID",
      "Course/Program",
      "Grade",
      "Issue Date",
      "Status",
      "Blockchain Hash",
    ];
    const rows = filteredCertificates.map((c) => [
      c.recipientName,
      c.recipientEmail,
      c.certificateId,
      c.course,
      c.grade,
      c.issueDate,
      STATUS_DISPLAY[c.status].label,
      c.hash ?? c.txHash ?? "—",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.map((val) => `"${val}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "certificates_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative overflow-hidden bg-card shadow-sm rounded-2xl border border-border">

      <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border">

        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none text-muted-foreground">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="block w-full ps-10 pe-3 py-2 bg-background border border-border text-foreground text-sm rounded-xl focus:ring-2 focus:ring-[#3D876C]/15 focus:border-[#3D876C]/50 outline-none placeholder:text-muted-foreground/60 transition-all"
            placeholder="Search name, course, certificate ID..."
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">

          {selectedIds.length > 0 && onBulkDelete && (
            <button
              onClick={onBulkDelete}
              className="inline-flex items-center justify-center text-white bg-red-600 hover:bg-red-700 font-semibold rounded-xl text-sm px-4 py-2 transition-all outline-none cursor-pointer shadow-sm active:scale-98"
              type="button"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete ({selectedIds.length})
            </button>
          )}

          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="inline-flex items-center justify-center text-foreground bg-card border border-border hover:bg-background focus:ring-4 focus:ring-slate-50 font-semibold rounded-xl text-sm px-4 py-2 transition-all outline-none cursor-pointer"
              type="button"
            >
              <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
              Status: {activeFilterLabel}
              <svg
                className="w-4 h-4 ml-2 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDropdownOpen(false)}
                />
                <div className="absolute right-0 mt-2 z-20 bg-card border border-border rounded-xl shadow-lg w-40 overflow-hidden py-1">
                  {STATUS_FILTER_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusFilterSelect(option.value)}
                      className={`flex items-center w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer hover:bg-background ${
                        statusFilter === option.value
                          ? "bg-[#3D876C]/10 text-[#3D876C] font-semibold"
                          : "text-foreground"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center justify-center text-foreground bg-card border border-border hover:bg-background font-semibold rounded-xl text-sm px-4 py-2 transition-all outline-none cursor-pointer"
            type="button"
          >
            <Download className="w-4 h-4 mr-2 text-muted-foreground" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-muted-foreground">
          <thead className="text-xs text-muted-foreground bg-background border-b border-border uppercase tracking-wider">
            <tr>
              <th scope="col" className="p-4 w-12">
                <input
                  type="checkbox"
                  checked={allPaginatedSelected}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate = somePaginatedSelected;
                    }
                  }}
                  onChange={(e) => onToggleSelectAll(e.target.checked)}
                  className="w-4 h-4 border border-border rounded bg-card text-[#3D876C] focus:ring-[#3D876C] cursor-pointer"
                />
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Student
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Certificate ID
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Course
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Grade
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Date
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Status
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {certificates.length > 0 ? (
              certificates.map((cert, index) => {
                const isSelected = selectedIds.includes(cert.id);
                const statusDisplay = STATUS_DISPLAY[cert.status];
                const isRevoked = cert.status === "revoked";

                return (
                  <motion.tr
                    key={cert.id}
                    initial={{ opacity: 0, y: 4, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                    onClick={() => onRowClick(cert.id)}
                    className={`bg-card hover:bg-background/50 transition-colors cursor-pointer group ${
                      isSelected ? "bg-emerald-500/[0.02]" : ""
                    }`}
                  >

                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectRow(cert.id)}
                        className="w-4 h-4 border border-border rounded bg-card text-[#3D876C] focus:ring-[#3D876C] cursor-pointer"
                      />
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${getAvatarColorClass(
                            cert.recipientName,
                          )}`}
                        >
                          {getAvatarInitials(cert.recipientName)}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground group-hover:text-[#3D876C] transition-colors">
                            {cert.recipientName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cert.recipientEmail}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-medium text-foreground font-mono text-xs">
                      {cert.certificateId}
                    </td>

                    <td className="px-6 py-4 text-muted-foreground max-w-[200px] truncate">
                      {cert.course}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-background text-foreground text-xs font-semibold">
                        {cert.grade}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      {cert.issueDate}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusDisplay.pill}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${statusDisplay.dot}`}
                        />
                        {statusDisplay.label}
                      </span>
                    </td>

                    <td
                      className="px-6 py-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onViewDetail(cert.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-[#3D876C] hover:bg-emerald-500/10 transition-all cursor-pointer"
                          title="View Certificate"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onRevoke && onRevoke(cert.id)}
                          disabled={isRevoked}
                          className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                            isRevoked
                              ? "text-border cursor-not-allowed opacity-40"
                              : "text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10"
                          }`}
                          title="Revoke Certificate"
                        >
                          <ShieldAlert className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete && onDelete(cert.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No certificates found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableFilter;
