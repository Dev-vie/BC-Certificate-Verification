import { NextResponse } from "next/server";

export function getCorsHeaders(req?: Request): Record<string, string> {
  const origin = req ? req.headers.get("origin") || "" : "";
  const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
  ];

  const isAllowed =
    allowedOrigins.includes(origin) ||
    origin.endsWith(".vercel.app") ||
    /^http:\/\/localhost(:\d+)?$/.test(origin) ||
    /^http:\/\/127\.0\.0\.1(:\d+)?$/.test(origin);

  const matchedOrigin = isAllowed ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": matchedOrigin,
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, X-Requested-With, Accept, Origin",
  };
}

export function handleCorsPreflight(req: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(req),
  });
}

export function jsonResponse(
  data: any,
  init?: { status?: number; headers?: Record<string, string> },
  req?: Request
) {
  const cors = getCorsHeaders(req);
  return NextResponse.json(data, {
    status: init?.status ?? 200,
    headers: {
      ...cors,
      ...(init?.headers || {}),
    },
  });
}
