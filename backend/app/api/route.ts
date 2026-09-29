import { jsonResponse } from "@/lib/cors";

export async function GET(req: Request) {
  return jsonResponse(
    {
      name: "VeriCert API",
      version: "2.0.0",
      status: "operational",
      endpoints: {
        auth: "/api/auth",
        certificates: "/api/certificates",
        templates: "/api/templates",
        verification: "/api/verification/:id",
        dashboard: "/api/dashboard",
        health: "/api/health",
      },
    },
    { status: 200 },
    req
  );
}
