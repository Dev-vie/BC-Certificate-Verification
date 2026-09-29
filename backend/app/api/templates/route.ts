import { prisma } from "@/lib/prisma";
import { getAuthInstitution } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

const FALLBACK_TEMPLATES = [
  {
    id: 1,
    title: "Blockchain Excellence Diploma",
    filePath: "/templates/sample-diploma.png",
    placeholders: [
      { id: "recipientName", x: 400, y: 240, width: 600, height: 40, align: "center", fontSize: 28, fontFamily: "Times-Bold", color: "#0F172A" },
      { id: "course", x: 400, y: 310, width: 600, height: 35, align: "center", fontSize: 18, fontFamily: "Helvetica", color: "#334155" },
      { id: "issueDate", x: 260, y: 440, width: 200, height: 30, align: "center", fontSize: 14, fontFamily: "Helvetica", color: "#64748B" },
      { id: "qrCode", x: 620, y: 400, width: 80, height: 80, align: "center" },
    ],
    fieldsCount: 4,
    createdAt: new Date("2026-09-01T00:00:00.000Z"),
  },
  {
    id: 2,
    title: "Executive Master of Science Award",
    filePath: "/templates/sample-master.png",
    placeholders: [
      { id: "recipientName", x: 400, y: 220, width: 600, height: 40, align: "center", fontSize: 26, fontFamily: "Times-Bold", color: "#0F172A" },
      { id: "course", x: 400, y: 290, width: 600, height: 35, align: "center", fontSize: 18, fontFamily: "Helvetica", color: "#334155" },
      { id: "grade", x: 400, y: 340, width: 200, height: 30, align: "center", fontSize: 15, fontFamily: "Helvetica", color: "#059669" },
      { id: "qrCode", x: 640, y: 420, width: 75, height: 75, align: "center" },
    ],
    fieldsCount: 4,
    createdAt: new Date("2026-09-05T00:00:00.000Z"),
  },
];

export async function GET(req: Request) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    try {
      const templates = await prisma.template.findMany({
        where: { institutionId: institution.id },
        orderBy: { createdAt: "desc" },
      });

      if (templates && templates.length > 0) {
        const parsedTemplates = templates.map((t) => {
          let p: any = t.placeholders;
          if (typeof p === "string") {
            try { p = JSON.parse(p); } catch { p = []; }
          }
          return { ...t, placeholders: p || [] };
        });
        return jsonResponse({ templates: parsedTemplates }, { status: 200 }, req);
      }
    } catch (dbErr) {
      console.warn("DB templates query error, using fallback:", dbErr);
    }

    return jsonResponse({ templates: FALLBACK_TEMPLATES }, { status: 200 }, req);
  } catch (error: any) {
    return jsonResponse({ templates: FALLBACK_TEMPLATES }, { status: 200 }, req);
  }
}

export async function POST(req: Request) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const rawPlaceholders = formData.get("placeholders") as string;
    const file = formData.get("file") as File;

    if (!title || !file) {
      return jsonResponse(
        { message: "Template title and background PDF/image file are required" },
        { status: 400 },
        req
      );
    }

    let jsonPlaceholders: any = [];
    try {
      jsonPlaceholders = typeof rawPlaceholders === "string" ? JSON.parse(rawPlaceholders) : (rawPlaceholders || []);
    } catch {
      jsonPlaceholders = [];
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const bucket = process.env.SUPABASE_TEMPLATES_BUCKET || "templates";
    const filePath = await uploadFile(
      fileBuffer,
      file.name || "template.pdf",
      bucket,
      `institution-${institution.id}`
    );

    const template = await prisma.template.create({
      data: {
        title: title.trim(),
        filePath,
        placeholders: jsonPlaceholders,
        institutionId: institution.id,
      },
    });

    let parsedP = template.placeholders;
    if (typeof parsedP === "string") {
      try { parsedP = JSON.parse(parsedP); } catch { parsedP = []; }
    }

    return jsonResponse({ template: { ...template, placeholders: parsedP } }, { status: 201 }, req);
  } catch (error: any) {
    console.error("[Template Create Error]:", error);
    return jsonResponse(
      { message: error.message || "Failed to create template" },
      { status: 500 },
      req
    );
  }
}
