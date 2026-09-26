import React, { useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../components/DashboardPage/sidebar";
import Header from "../components/DashboardPage/header";
import CertificateDetail from "../components/CertificatePage/certificatedetail";
import { useGetCertificateByIdQuery } from "../redux/features/certificate/certificateAPI";
import { useSidebar } from "../context/SidebarContext";
import { motion } from "motion/react";

export const CertificateDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isCollapsed, isMobile } = useSidebar();

  const {
    data: certificate,
    isLoading,
  } = useGetCertificateByIdQuery(id ?? "", { skip: !id });

  const localCert = useMemo(() => {
    if (certificate || !id) return null;
    try {
      const saved = localStorage.getItem("authentix_certificates");
      if (saved) {
        const list = JSON.parse(saved);
        if (Array.isArray(list)) {
          return (
            list.find(
              (c: any) =>
                String(c.id) === String(id) ||
                String(c.certificateId) === String(id),
            ) || null
          );
        }
      }
    } catch {
      // ignore parse error
    }
    return null;
  }, [certificate, id]);

  const activeCert = certificate || localCert;

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">

      <Sidebar />

      <div
        className={`flex-1 transition-all duration-300 ease-in-out min-w-0 ${
          isMobile ? "ml-0" : isCollapsed ? "ml-[72px]" : "ml-[240px]"
        }`}
      >

        <Header
          breadcrumb={{
            parent: "Certificates",
            current: "Certificate Detail",
          }}
        />

        <motion.main
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="px-4 sm:px-8 py-6 max-w-full overflow-x-hidden"
        >
          {isLoading && !localCert && (
            <div className="space-y-6 animate-pulse select-none pointer-events-none">
              {/* Skeleton Header Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="h-9 w-44 bg-card border border-border rounded-xl" />
                <div className="flex items-center gap-2">
                  <div className="h-8 w-32 bg-card border border-border rounded-xl" />
                  <div className="h-8 w-16 bg-card border border-border rounded-xl" />
                </div>
              </div>

              {/* Skeleton Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
                
                {/* Left Preview Column */}
                <div className="bg-card rounded-3xl border border-border overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-background/50">
                    <div className="h-4 w-32 bg-accent rounded" />
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-28 bg-accent rounded-xl" />
                      <div className="h-7 w-24 bg-accent rounded-xl" />
                    </div>
                  </div>
                  <div className="p-4 bg-background flex flex-col items-center justify-center min-h-[450px]">
                    <div className="w-full h-[500px] rounded-xl bg-card border border-border" />
                  </div>
                </div>

                {/* Right Info Column */}
                <div className="bg-card rounded-3xl border border-border p-6 space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-border">
                    <div className="w-5 h-5 rounded-full bg-accent" />
                    <div className="h-4 w-40 bg-accent rounded" />
                  </div>

                  <div className="space-y-5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex justify-between items-center py-1">
                        <div className="h-3.5 w-24 bg-accent rounded" />
                        <div className="h-3.5 w-36 bg-accent rounded" />
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-6 flex flex-col items-center justify-center gap-4">
                    <div className="w-32 h-32 bg-accent rounded-2xl animate-pulse" />
                    <div className="h-3.5 w-48 bg-accent rounded" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {!isLoading && !activeCert && (
            <div className="bg-card rounded-3xl border border-border shadow-sm p-12 text-center">
              <h3 className="text-lg font-bold text-foreground mb-2">
                Certificate Not Found
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                The certificate with ID "{id}" could not be located in our
                records.
              </p>
              <button
                onClick={() => navigate("/certificates")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#3D876C] hover:bg-[#2C6450] text-white font-semibold rounded-xl text-sm transition-colors cursor-pointer shadow-sm"
              >
                Back to Certificates
              </button>
            </div>
          )}

          {activeCert && (
            <CertificateDetail
              certificate={activeCert as any}
              onBack={() => navigate("/certificates")}
            />
          )}
        </motion.main>
      </div>
    </div>
  );
};

export default CertificateDetailPage;
