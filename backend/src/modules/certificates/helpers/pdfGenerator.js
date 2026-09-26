const { PDFDocument, rgb, StandardFonts } = require("pdf-lib");
const fontkit = require("@pdf-lib/fontkit");
const axios = require("axios");

const hexToRgb = (hex) => {
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

const getStandardFont = async (pdfDoc, fontFamily) => {
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

const getGoogleFont = async (pdfDoc, fontFamily) => {
  try {

    const cssUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      / /g,
      "+",
    )}`;
    const cssRes = await axios.get(cssUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const match = cssRes.data.match(/src: url\(([^)]+\.ttf)\)/);
    if (!match) throw new Error("TTF URL not found in Google Fonts CSS");

    const fontRes = await axios.get(match[1], { responseType: "arraybuffer" });
    const fontBytes = Buffer.from(fontRes.data);
    return await pdfDoc.embedFont(fontBytes);
  } catch (err) {
    console.warn(
      `Failed to load font "${fontFamily}" from Google Fonts, falling back to Helvetica:`,
      err.message,
    );
    return await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
};

const getFont = async (pdfDoc, fontFamily) => {
  if (!fontFamily || STANDARD_FONTS.includes(fontFamily)) {
    return await getStandardFont(pdfDoc, fontFamily);
  }
  return await getGoogleFont(pdfDoc, fontFamily);
};

const EDITOR_CANVAS_WIDTH = 800;
const EDITOR_CANVAS_HEIGHT = 566;

const generateCertificatePDF = async (
  templateUrl,
  placeholders,
  data,
  qrCodeBuffer = null,
) => {
  const response = await axios.get(templateUrl, {
    responseType: "arraybuffer",
  });
  const templateBuffer = Buffer.from(response.data);

  const pdfDoc = await PDFDocument.load(templateBuffer);
  pdfDoc.registerFontkit(fontkit);

  const pages = pdfDoc.getPages();
  const page = pages[0];
  const { width, height } = page.getSize();

  const scaleX = width / EDITOR_CANVAS_WIDTH;
  const scaleY = height / EDITOR_CANVAS_HEIGHT;

  const fieldList = Array.isArray(placeholders)
    ? placeholders
    : Array.isArray(placeholders?.fields)
    ? placeholders.fields
    : typeof placeholders === "object" && placeholders !== null
    ? Object.entries(placeholders).map(([id, config]) => ({ id, ...config }))
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

    const boxLeft = config.x * scaleX;
    const boxTop = config.y * scaleY;
    const boxWidth = (config.width || 200) * scaleX;
    const boxHeight = (config.height || 48) * scaleY;

    const textWidth = font.widthOfTextAtSize(value, fontSize);

    let x;
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

  const qrConfig = fieldList.find((field) => field.id === "qrCode");
  if (qrCodeBuffer && qrConfig) {
    const qrWidth = (qrConfig.width || 80) * scaleX;
    const qrHeight = (qrConfig.height || 80) * scaleY;
    const x = qrConfig.x * scaleX;

    const y = height - qrConfig.y * scaleY - qrHeight;

    const qrImage = await pdfDoc.embedPng(qrCodeBuffer);
    page.drawImage(qrImage, { x, y, width: qrWidth, height: qrHeight });
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
};

module.exports = { generateCertificatePDF };
