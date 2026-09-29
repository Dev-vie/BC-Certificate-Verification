import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function POST(req: Request) {
  const res = jsonResponse({ message: "Logged out successfully" }, { status: 200 }, req);
  res.cookies.delete("refreshToken");
  return res;
}
