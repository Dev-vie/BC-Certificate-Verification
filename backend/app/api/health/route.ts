import { jsonResponse, handleCorsPreflight } from "@/lib/cors";
import { isBlockchainConfigured } from "@/lib/blockchain";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function GET(req: Request) {
  return jsonResponse(
    {
      status: "healthy",
      service: "VeriCert Next.js Blockchain API",
      timestamp: new Date().toISOString(),
      blockchainConfigured: isBlockchainConfigured(),
    },
    { status: 200 },
    req
  );
}
