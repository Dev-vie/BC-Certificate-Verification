import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import fs from "fs";
import path from "path";

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : { r: 0, g: 0, b: 0 };
};

const STANDARD_FONTS = [
  "Helvetica",
  "Arial",
  "Times-Roman",
  "Times",
  "Times-Bold",
  "Times-Italic",
  "Courier",
];

const getStandardFont = async (pdfDoc: PDFDocument, fontFamily: string) => {
  switch (fontFamily) {
    case "Times-Roman":
    case "Times":
      return await pdfDoc.embedFont(StandardFonts.TimesRoman);
    case "Times-Bold":
      return await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    case "Times-Italic":
      return await pdfDoc.embedFont(StandardFonts.TimesRomanItalic);
    case "Courier":
      return await pdfDoc.embedFont(StandardFonts.Courier);
    case "Helvetica":
    case "Arial":
    default:
      return await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
};

const getFont = async (pdfDoc: PDFDocument, fontFamily: string) => {
  return await getStandardFont(pdfDoc, fontFamily);
};

const EDITOR_CANVAS_WIDTH = 800;
const EDITOR_CANVAS_HEIGHT = 566;

async function loadTemplateBuffer(templateUrlOrPath: string): Promise<Buffer> {
  // If it's a URL
  if (templateUrlOrPath.startsWith("http://") || templateUrlOrPath.startsWith("https://")) {
    const res = await fetch(templateUrlOrPath);
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  // If it's a local relative path
  let localPath = templateUrlOrPath;
  if (localPath.startsWith("/uploads/")) {
    localPath = path.join(process.cwd(), "public", localPath);
  }
  if (fs.existsSync(localPath)) {
    return fs.readFileSync(localPath);
  }

  // Fallback: create a blank standard landscape certificate page
  const blankDoc = await PDFDocument.create();
  blankDoc.addPage([EDITOR_CANVAS_WIDTH, EDITOR_CANVAS_HEIGHT]);
  const blankBytes = await blankDoc.save();
  return Buffer.from(blankBytes);
}

export async function generateCertificatePDF(
  templateUrlOrPath: string,
  placeholders: any,
  data: Record<string, string>,
  qrCodeBuffer: Buffer | null = null
): Promise<Buffer> {
  let templateBuffer: Buffer;
  try {
    templateBuffer = await loadTemplateBuffer(templateUrlOrPath);
  } catch (err: any) {
    console.warn("[PDFGenerator] Failed to load template, generating fallback certificate:", err.message);
    const blankDoc = await PDFDocument.create();
    blankDoc.addPage([EDITOR_CANVAS_WIDTH, EDITOR_CANVAS_HEIGHT]);
    const blankBytes = await blankDoc.save();
    templateBuffer = Buffer.from(blankBytes);
  }

  const pdfDoc = await PDFDocument.load(templateBuffer);
  pdfDoc.registerFontkit(fontkit);

  const pages = pdfDoc.getPages();
  const page = pages[0] || pdfDoc.addPage([EDITOR_CANVAS_WIDTH, EDITOR_CANVAS_HEIGHT]);
  const { width, height } = page.getSize();

  const scaleX = width / EDITOR_CANVAS_WIDTH;
  const scaleY = height / EDITOR_CANVAS_HEIGHT;

  let rawList = placeholders;
  if (typeof rawList === "string") {
    try {
      rawList = JSON.parse(rawList);
    } catch {
      rawList = [];
    }
  }

  const fieldList = Array.isArray(rawList)
    ? rawList
    : Array.isArray(rawList?.fields)
    ? rawList.fields
    : typeof rawList === "object" && rawList !== null
    ? Object.entries(rawList).map(([id, config]: [string, any]) => ({ id, ...config }))
    : [];

  for (const config of fieldList) {
    const key = config.id;
    if (!key || key === "qrCode") continue;

    let value = data[key];
    if (!value && key === "courseProgram") value = data.course;
    if (!value && key === "course") value = data.courseProgram;
    if (!value && key === "email") value = data.recipientEmail;
    if (!value && key === "recipientEmail") value = data.email;

    if (!value) continue;

    const font = await getFont(pdfDoc, config.fontFamily);
    const fontSize = (config.fontSize || 20) * scaleY;
    const color = hexToRgb(config.color || "#000000");
    const align = config.align || "left";

    const boxLeft = (config.x || 0) * scaleX;
    const boxTop = (config.y || 0) * scaleY;
    const boxWidth = (config.width || 200) * scaleX;
    const boxHeight = (config.height || 48) * scaleY;

    const textWidth = font.widthOfTextAtSize(value, fontSize);

    let x: number;
    if (align === "center") {
      x = boxLeft + (boxWidth - textWidth) / 2;
    } else if (align === "right") {
      x = boxLeft + boxWidth - textWidth;
    } else {
      x = boxLeft;
    }

    const boxCenterFromTop = boxTop + boxHeight / 2;
    const y = height - boxCenterFromTop - fontSize * 0.35;

    page.drawText(value, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
    });
  }

  const qrConfig = fieldList.find((field: any) => field.id === "qrCode");
  if (qrCodeBuffer && qrConfig) {
    const qrWidth = (qrConfig.width || 80) * scaleX;
    const qrHeight = (qrConfig.height || 80) * scaleY;
    const x = (qrConfig.x || 0) * scaleX;
    const y = height - (qrConfig.y || 0) * scaleY - qrHeight;

    const qrImage = await pdfDoc.embedPng(qrCodeBuffer);
    page.drawImage(qrImage, { x, y, width: qrWidth, height: qrHeight });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}
