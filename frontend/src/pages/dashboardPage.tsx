import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/DashboardPage/header";
import {
  Filter,
  Download,
  ChevronRight,
  Copy,
  Calendar,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import Sidebar from "../components/DashboardPage/sidebar";
import { useSidebar } from "../context/SidebarContext";
import { LineChart01, type LineChartDataItem } from "../components/DashboardPage/linechart";
import { PieChart01 } from "../components/DashboardPage/piechart";
import Pagination from "../components/CertificatePage/pagination";
import "./dashboard.css";
import { useDashboard } from "../hooks/useDashboard";
import { useCertificateList } from "../hooks/useCertificateList";
import { Shield, CheckCircle2, Users, TrendingUp } from "lucide-react";

function parseCertDate(cert: any): Date | null {
  const rawDate = cert.issueDate || cert.createdAt;
  if (!rawDate) return null;
  const d = new Date(rawDate);
  return isNaN(d.getTime()) ? null : d;
}

function getCertStatus(cert: any): "Verified" | "Pending" | "Revoked" {
  const s = String(cert.status || "").toLowerCase();
  if (s === "verified" || s === "valid" || s === "issued") return "Verified";
  if (s === "pending" || s === "processing") return "Pending";
  if (s === "revoked" || s === "failed") return "Revoked";
  return "Verified";
}

function computeLineChartData(certificates: any[]): LineChartDataItem[] {
  if (!certificates || certificates.length === 0) {
    const now = new Date();
    const months: LineChartDataItem[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ date: d, A: 0, B: 0, C: 0 });
    }
    return months;
  }

  let latestDate = new Date();
  let foundValidDate = false;
  certificates.forEach((c) => {
    const d = parseCertDate(c);
    if (d) {
      if (!foundValidDate || d > latestDate) {
        latestDate = d;
      }
      foundValidDate = true;
    }
  });

  const targetMonths: Date[] = [];
  const endYear = latestDate.getFullYear();
  const endMonth = latestDate.getMonth();

  for (let i = 5; i >= 0; i--) {
    targetMonths.push(new Date(endYear, endMonth - i, 1));
  }

  return targetMonths.map((mDate) => {
    const mYear = mDate.getFullYear();
    const mMonth = mDate.getMonth();

    let countA = 0;
    let countB = 0;
    let countC = 0;

    certificates.forEach((c) => {
      const d = parseCertDate(c);
      if (d && d.getFullYear() === mYear && d.getMonth() === mMonth) {
        const st = getCertStatus(c);
        if (st === "Verified") countA++;
        else if (st === "Pending") countB++;
        else if (st === "Revoked") countC++;
      }
    });

    return {
      date: mDate,
      A: countA,
      B: countB,
      C: countC,
    };
  });
}

function computeProgramData(certificates: any[]): { labels: string[]; series: number[] } {
  if (!certificates || certificates.length === 0) {
    return { labels: ["No Data"], series: [0] };
  }

  const programCounts: Record<string, number> = {};
  certificates.forEach((c) => {
    const prog = c.courseProgram || c.course || "General";
    programCounts[prog] = (programCounts[prog] || 0) + 1;
  });

  const sorted = Object.entries(programCounts).sort((a, b) => b[1] - a[1]);

  if (sorted.length > 5) {
    const top5 = sorted.slice(0, 5);
    const othersCount = sorted.slice(5).reduce((sum, [, count]) => sum + count, 0);
    top5.push(["Others", othersCount]);
    return {
      labels: top5.map(([p]) => p),
      series: top5.map(([, count]) => count),
    };
  }

  return {
    labels: sorted.map(([p]) => p),
    series: sorted.map(([, count]) => count),
  };
}

export const DashboardPage = () => {
  const navigate = useNavigate();
  const filterDropdownRef = useRef<HTMLDivElement>(null);
  const { isCollapsed, isMobile } = useSidebar();

  const [searchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [filterOpen, setFilterOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const [, setProfile] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Ignore parse error
      }
    }
    return {
      firstName: "Jane",
      lastName: "Smith",
      avatarUrl: null,
    };
  });

  useEffect(() => {
    const handleProfileSync = () => {
      const saved = localStorage.getItem("userProfile");
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch {
          // Ignore parse error
        }
      }
    };
    window.addEventListener("storage", handleProfileSync);
    return () => window.removeEventListener("storage", handleProfileSync);
  }, []);

  const [certificates, setCertificates] = useState<any[]>(() => {
    const saved = localStorage.getItem("vericert_certificates") || localStorage.getItem("authentix_certificates");
    if (saved !== null) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  useEffect(() => {
    const syncCerts = () => {
      const saved = localStorage.getItem("vericert_certificates") || localStorage.getItem("authentix_certificates");
      if (saved !== null) {
        try {
          setCertificates(JSON.parse(saved));
        } catch {
          // Ignore parse error
        }
      }
    };
    window.addEventListener("storage", syncCerts);
    return () => window.removeEventListener("storage", syncCerts);
  }, []);

  const { certificates: apiCertificates } = useCertificateList();

  const allCertificates: any[] = useMemo(() => {
    if (Array.isArray(apiCertificates)) {
      return apiCertificates;
    }
    return certificates;
  }, [certificates, apiCertificates]);

  const lineChartData = useMemo(
    () => computeLineChartData(allCertificates),
    [allCertificates],
  );
  const programChartData = useMemo(
    () => computeProgramData(allCertificates),
    [allCertificates],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterDropdownRef.current &&
        !filterDropdownRef.current.contains(event.target as Node)
      ) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCertificates = allCertificates.filter((cert) => {
    const recipientName = cert.recipientName || "";
    const course = cert.courseProgram || cert.course || "";
    const certId = cert.id || cert.certificateId || "";
    const hash = cert.blockchainHash || cert.txHash || cert.hash || "";

    const matchesSearch =
      recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      certId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hash.toLowerCase().includes(searchQuery.toLowerCase());

    let targetStatus = statusFilter;
    if (statusFilter === "Valid") targetStatus = "Verified";

    const certStatus = getCertStatus(cert);

    const matchesStatus =
      statusFilter === "All" ||
      certStatus === targetStatus ||
      cert.status === targetStatus;

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

  const handleCopyHash = (e: React.MouseEvent, hash: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(hash).then(() => {
      setCopiedHash(hash);
      setToastMessage("Blockchain hash copied to clipboard");
      setTimeout(() => {
        setCopiedHash(null);
        setToastMessage(null);
      }, 2500);
    });
  };

  const handleExportCSV = () => {
    const headers = [
      "Recipient Name",
      "Email",
      "Certificate ID",
      "Program",
      "Grade",
      "Issue Date",
      "Status",
      "Blockchain Hash",
    ];
    const rows = filteredCertificates.map((c) => [
      c.recipientName || "",
      c.recipientEmail || "",
      c.id || c.certificateId || "",
      c.courseProgram || c.course || "",
      c.grade || "",
      c.issueDate || (c.createdAt ? c.createdAt.split("T")[0] : ""),
      getCertStatus(c),
      c.blockchainHash || c.txHash || c.hash || "",
    ]);
    const csvContent = [
      headers.join(","),
      ...rows.map((r) => r.map((val) => `"${val}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "recent_certificates_export.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const {
    stats: dashboardStats,
    loading: statsLoading,
    error: statsError,
  } = useDashboard();

  const totalIssued = dashboardStats?.totalIssued ?? allCertificates.length;
  const verifiedCount = allCertificates.filter((c) => getCertStatus(c) === "Verified").length;
  const verifiedToday = dashboardStats?.verifiedToday ?? verifiedCount;
  const activeRecipients = dashboardStats?.activeRecipients ?? new Set(allCertificates.map((c) => c.recipientEmail).filter(Boolean)).size;
  const verificationRate = dashboardStats?.verificationRate ?? (allCertificates.length > 0 ? Math.round((verifiedCount / allCertificates.length) * 100) : 0);

  const stats = [
    {
      label: "Total Issued",
      value: totalIssued.toLocaleString(),
      icon: Shield,
      valColor: "text-indigo-600 dark:text-indigo-400",
      iconColor: "text-indigo-500 dark:text-indigo-400",
      progressColor: "bg-indigo-600 dark:bg-indigo-500",
      progress: Math.min(100, (totalIssued / (totalIssued <= 10 ? 10 : totalIssued <= 100 ? 100 : totalIssued <= 1000 ? 1000 : 10000)) * 100),
    },
    {
      label: "Verified Today",
      value: verifiedToday.toLocaleString(),
      icon: CheckCircle2,
      valColor: "text-[#3D876C] dark:text-[#4ca385]",
      iconColor: "text-[#3D876C] dark:text-[#4ca385]",
      progressColor: "bg-[#3D876C] dark:bg-[#4ca385]",
      progress: Math.min(100, verifiedCount > 0 ? (verifiedToday / verifiedCount) * 100 : 0),
    },
    {
      label: "Active Recipients",
      value: activeRecipients.toLocaleString(),
      icon: Users,
      valColor: "text-slate-700 dark:text-slate-300",
      iconColor: "text-slate-400 dark:text-slate-500",
      progressColor: "bg-slate-500 dark:bg-slate-400",
      progress: Math.min(100, totalIssued > 0 ? (activeRecipients / totalIssued) * 100 : 0),
    },
    {
      label: "Verification Rate",
      value: `${verificationRate}%`,
      icon: TrendingUp,
      valColor:
        verificationRate >= 80
          ? "text-[#3D876C] dark:text-[#4ca385]"
          : verificationRate >= 50
          ? "text-amber-500"
          : "text-rose-500",
      iconColor:
        verificationRate >= 80
          ? "text-[#3D876C] dark:text-[#4ca385]"
          : verificationRate >= 50
          ? "text-amber-500"
          : "text-rose-500",
      progressColor:
        verificationRate >= 80
          ? "bg-[#3D876C] dark:bg-[#4ca385]"
          : verificationRate >= 50
          ? "bg-amber-500"
          : "bg-rose-500",
      progress: Math.max(0, Math.min(100, verificationRate)),
    },
  ];

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

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">Overview</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Welcome back — here's what's happening with your certificates.
            </p>
          </div>

          {statsError && (
            <div className="mb-3 text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              Couldn't load live dashboard stats — showing placeholder values.
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className={`dashboard-stat-card bg-card rounded-xl border border-border p-6 shadow-sm flex flex-col justify-between transition-all duration-300 ${
                    statsLoading ? "opacity-60 animate-pulse" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <p className={`text-3xl font-extrabold ${s.valColor} tracking-tight leading-none mb-2`}>
                        {s.value}
                      </p>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {s.label}
                      </p>
                    </div>
                    <div>
                      <Icon size={28} className={s.iconColor} />
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800/80 h-2 rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full ${s.progressColor} rounded-full transition-all duration-500`}
                      style={{ width: `${s.progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
            {/* Issuance Trend */}
            <div className="bg-card rounded-2xl border border-border p-5 lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Issuance Trend
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Issued vs verified, last 6 months
                  </p>
                </div>
              </div>

              <LineChart01 data={lineChartData} />
            </div>

            {/* By Program — Pie Chart */}
            <div className="bg-card rounded-2xl border border-border p-5 flex flex-col lg:col-span-1">
              <div className="mb-2">
                <h2 className="text-base font-semibold text-foreground">
                  By Program
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Total certificates issued
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <PieChart01
                  series={programChartData.series}
                  labels={programChartData.labels}
                  height={280}
                />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Recent Certificates
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Showing {paginatedCertificates.length} of{" "}
                  {filteredCertificates.length} results
                </p>
              </div>

              <div className="flex items-center gap-2">

                <div className="relative" ref={filterDropdownRef}>
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-foreground bg-card border border-border rounded-lg hover:bg-background transition-colors cursor-pointer outline-none"
                  >
                    <Filter size={14} className="text-muted-foreground" />
                    Status: {statusFilter}
                  </button>

                  {filterOpen && (
                    <div className="absolute right-0 mt-2 z-40 bg-card border border-border rounded-xl shadow-xl w-36 overflow-hidden py-1">
                      {["All", "Valid", "Pending", "Revoked"].map((status) => (
                        <button
                          key={status}
                          onClick={() => {
                            setStatusFilter(status);
                            setFilterOpen(false);
                          }}
                          className={`flex items-center w-full px-4 py-2.5 text-xs text-left transition-colors cursor-pointer hover:bg-background ${
                             statusFilter === status
                               ? "text-primary font-bold bg-primary/5"
                               : "text-foreground"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-foreground bg-card border border-border rounded-lg hover:bg-background transition-colors cursor-pointer"
                >
                  <Download size={14} className="text-muted-foreground" />
                  Export
                </button>

                <button
                   onClick={() => navigate("/certificates")}
                   className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
                 >
                  View all
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Recipient
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Program
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Issued
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3.5 text-left text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                      Blockchain
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {paginatedCertificates.length > 0 ? (
                    paginatedCertificates.map((cert, index) => {
                      const displayStatus = getCertStatus(cert);
                      const displayProgram = cert.courseProgram || cert.course || "General";
                      const displayDate = cert.issueDate || (cert.createdAt ? cert.createdAt.split("T")[0] : "");
                      const displayHash = cert.blockchainHash || cert.txHash || cert.hash || "0x—";
                      const certId = cert.id || cert.certificateId;

                      return (
                        <motion.tr
                          key={certId}
                          initial={{ opacity: 0, y: 4, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.04 }}
                          onClick={() => navigate(`/certificates/${certId}`)}
                          className="border-b border-border/40 last:border-b-0 hover:bg-background/50 transition-colors cursor-pointer group"
                        >

                          <td className="px-6 py-3.5">
                             <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                              {cert.recipientName}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {cert.recipientEmail}
                            </p>
                          </td>

                          <td className="px-6 py-3.5 text-sm text-muted-foreground">
                            {displayProgram}
                          </td>

                          <td className="px-6 py-3.5">
                            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Calendar
                                size={13}
                                className="text-muted-foreground"
                              />
                              {displayDate}
                            </span>
                          </td>

                          <td className="px-6 py-3.5">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                                displayStatus === "Verified"
                                  ? "bg-primary/10 text-primary"
                                  : displayStatus === "Pending"
                                  ? "bg-amber-500/10 text-amber-500"
                                  : "bg-red-500/10 text-red-500"
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  displayStatus === "Verified"
                                    ? "bg-primary"
                                    : displayStatus === "Pending"
                                    ? "bg-amber-500"
                                    : "bg-red-500"
                                }`}
                              />
                              {displayStatus === "Verified" ? "Valid" : displayStatus}
                            </span>
                          </td>

                          <td className="px-6 py-3.5">
                            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground font-mono">
                              <span className="max-w-[100px] truncate">
                                {displayHash}
                              </span>
                              {displayHash !== "0x—" && (
                                <button
                                  onClick={(e) =>
                                    handleCopyHash(e, displayHash)
                                  }
                                   className="p-1 rounded hover:text-primary hover:bg-primary/5 transition-all cursor-pointer"
                                  aria-label="Copy Hash"
                                  title="Copy Blockchain Hash"
                                >
                                  {copiedHash === displayHash ? (
                                    <Check
                                      size={13}
                                      className="text-emerald-500"
                                    />
                                  ) : (
                                    <Copy size={13} />
                                  )}
                                </button>
                              )}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-xs text-muted-foreground"
                      >
                        No recent certificates found matching the criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filteredCertificates.length > itemsPerPage && (
              <div className="flex justify-between items-center px-6 py-4 border-t border-border bg-card/30">
                <p className="text-xs text-muted-foreground">
                  Showing{" "}
                  <span className="font-semibold text-foreground">
                    {paginatedCertificates.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-foreground">
                    {filteredCertificates.length}
                  </span>{" "}
                  results
                </p>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </div>
            )}
          </div>
        </motion.main>
      </div>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white rounded-xl shadow-2xl border border-white/10 text-xs font-semibold"
          >
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
