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

    return jsonResponse(
      { is2faEnabled: Boolean(institution.twoFactorEnabled) },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse({ message: error.message }, { status: 500 }, req);
  }
}
