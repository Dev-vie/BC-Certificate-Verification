import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCorsHeaders } from "./lib/cors";

export function middleware(request: NextRequest) {
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: getCorsHeaders(request),
    });
  }

  const response = NextResponse.next();
  const cors = getCorsHeaders(request);
  Object.entries(cors).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ["/api/:path*"],
};
