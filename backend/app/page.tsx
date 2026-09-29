export default function ApiDashboardPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div style={{ maxWidth: "800px", width: "100%", background: "#111827", border: "1px solid #1f2937", borderRadius: "16px", padding: "2.5rem", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "24px" }}>
            V
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: "700", color: "#ffffff" }}>
              VeriCert Backend API
            </h1>
            <p style={{ margin: "0.25rem 0 0 0", color: "#94a3b8", fontSize: "0.95rem" }}>
              Next-Gen Blockchain Digital Credential Verification Engine
            </p>
          </div>
          <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.35rem 0.85rem", background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", borderRadius: "9999px", color: "#10b981", fontSize: "0.85rem", fontWeight: "600" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }}></span>
            Operational
          </span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ background: "#1e293b", padding: "1.25rem", borderRadius: "10px", border: "1px solid #334155" }}>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Architecture</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.3rem", color: "#e2e8f0" }}>Next.js App Router API</div>
          </div>
          <div style={{ background: "#1e293b", padding: "1.25rem", borderRadius: "10px", border: "1px solid #334155" }}>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Blockchain Ledger</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.3rem", color: "#e2e8f0" }}>Polygon Amoy Testnet</div>
          </div>
          <div style={{ background: "#1e293b", padding: "1.25rem", borderRadius: "10px", border: "1px solid #334155" }}>
            <div style={{ fontSize: "0.8rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Database ORM</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "600", marginTop: "0.3rem", color: "#e2e8f0" }}>Prisma + PostgreSQL</div>
          </div>
        </div>

        <h2 style={{ fontSize: "1.15rem", fontWeight: "600", borderBottom: "1px solid #1f2937", paddingBottom: "0.75rem", marginBottom: "1rem" }}>
          Available Endpoint Groups
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem", fontFamily: "monospace" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.8rem", background: "#1e293b", borderRadius: "6px" }}>
            <span style={{ color: "#38bdf8" }}>POST /api/auth/register</span>
            <span style={{ color: "#94a3b8" }}>Institution Registration</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.8rem", background: "#1e293b", borderRadius: "6px" }}>
            <span style={{ color: "#38bdf8" }}>POST /api/auth/login</span>
            <span style={{ color: "#94a3b8" }}>JWT Authentication & 2FA</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.8rem", background: "#1e293b", borderRadius: "6px" }}>
            <span style={{ color: "#34d399" }}>POST /api/certificates/issue</span>
            <span style={{ color: "#94a3b8" }}>Issue + PDF + QR + Anchor</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.8rem", background: "#1e293b", borderRadius: "6px" }}>
            <span style={{ color: "#34d399" }}>POST /api/certificates/issue-bulk</span>
            <span style={{ color: "#94a3b8" }}>CSV Bulk Batch Issuance</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.8rem", background: "#1e293b", borderRadius: "6px" }}>
            <span style={{ color: "#a78bfa" }}>GET /api/verification/:certificateId</span>
            <span style={{ color: "#94a3b8" }}>Public QR/ID Verification</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.8rem", background: "#1e293b", borderRadius: "6px" }}>
            <span style={{ color: "#a78bfa" }}>POST /api/verification/verify-file</span>
            <span style={{ color: "#94a3b8" }}>SHA-256 PDF Tamper Analysis</span>
          </div>
        </div>

        <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #1f2937", display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "#64748b" }}>
          <span>VeriCert Competition Release v2.0.0</span>
          <span>Connected Frontend: <a href="http://localhost:5173" style={{ color: "#10b981", textDecoration: "none" }}>http://localhost:5173</a></span>
        </div>
      </div>
    </main>
  );
}
