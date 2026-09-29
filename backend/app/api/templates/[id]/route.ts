import { prisma } from "@/lib/prisma";
import { getAuthInstitution } from "@/lib/auth";
import { deleteFile } from "@/lib/storage";
import { jsonResponse, handleCorsPreflight } from "@/lib/cors";

export async function OPTIONS(req: Request) {
  return handleCorsPreflight(req);
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    const { id } = await params;
    const templateId = parseInt(id, 10);

    const template = await prisma.template.findFirst({
      where: { id: templateId, institutionId: institution.id },
    });

    if (!template) {
      return jsonResponse({ message: "Template not found" }, { status: 404 }, req);
    }

    let parsedP = [];
    try {
      parsedP = typeof template.placeholders === "string" ? JSON.parse(template.placeholders) : template.placeholders;
    } catch {
      parsedP = [];
    }

    return jsonResponse({ template: { ...template, placeholders: parsedP } }, { status: 200 }, req);
  } catch (error: any) {
    return jsonResponse({ message: error.message }, { status: 500 }, req);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    const { id } = await params;
    const templateId = parseInt(id, 10);
    const body = await req.json();
    const { placeholders } = body;

    const existing = await prisma.template.findFirst({
      where: { id: templateId, institutionId: institution.id },
    });

    if (!existing) {
      return jsonResponse({ message: "Template not found" }, { status: 404 }, req);
    }

    let jsonPlaceholders: any = undefined;
    if (placeholders !== undefined) {
      try {
        jsonPlaceholders = typeof placeholders === "string" ? JSON.parse(placeholders) : placeholders;
      } catch {
        jsonPlaceholders = placeholders;
      }
    }

    const updated = await prisma.template.update({
      where: { id: templateId },
      data: {
        ...(jsonPlaceholders !== undefined ? { placeholders: jsonPlaceholders } : {}),
      },
    });

    let parsedUpdatedP = updated.placeholders;
    if (typeof parsedUpdatedP === "string") {
      try { parsedUpdatedP = JSON.parse(parsedUpdatedP); } catch {}
    }

    return jsonResponse({ template: { ...updated, placeholders: parsedUpdatedP } }, { status: 200 }, req);
  } catch (error: any) {
    return jsonResponse({ message: error.message }, { status: 500 }, req);
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const institution = await getAuthInstitution(req);
    if (!institution) {
      return jsonResponse({ message: "Unauthorized" }, { status: 401 }, req);
    }

    const { id } = await params;
    const templateId = parseInt(id, 10);

    const template = await prisma.template.findFirst({
      where: { id: templateId, institutionId: institution.id },
    });

    if (!template) {
      return jsonResponse({ message: "Template not found" }, { status: 404 }, req);
    }

    const bucket = process.env.SUPABASE_TEMPLATES_BUCKET || "templates";
    if (template.filePath) {
      await deleteFile(template.filePath, bucket);
    }

    await prisma.template.delete({
      where: { id: templateId },
    });

    return jsonResponse(
      { message: "Template deleted successfully", id: String(templateId) },
      { status: 200 },
      req
    );
  } catch (error: any) {
    return jsonResponse({ message: error.message }, { status: 500 }, req);
  }
}
