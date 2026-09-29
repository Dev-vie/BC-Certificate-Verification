import { getAuthInstitution } from "@/lib/auth";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function GET(req: Request) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    return jsonResponse({ institution }, { status: 200 }, req);
  } catch (error: any) {
    return jsonResponse(
      { message: error.message || "Failed to fetch profile" },
      { status: 500 },
      req
    );
  }
}
