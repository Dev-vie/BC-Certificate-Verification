import * as pdfjsLib from "pdfjs-dist";

import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

function looksLikeImage(url: string): boolean {
  const clean = url.split("?")[0].toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => clean.endsWith(ext));
}

async function fetchAsBlob(url: string): Promise<Blob> {

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch template file (status ${res.status})`);
  }
  return res.blob();
}

async function renderPdfFirstPageToBlobUrl(pdfBlob: Blob): Promise<string> {
  const arrayBuffer = await pdfBlob.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  const viewport = page.getViewport({ scale: 2 });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Canvas 2D context unavailable");
  }

  await page.render({ canvasContext: context, viewport, canvas } as any).promise;

  return new Promise<string>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error("Failed to rasterize PDF page to an image"));
        return;
      }
      resolve(URL.createObjectURL(blob));
    }, "image/png");
  });
}

export async function renderTemplatePreview(fileUrl: string): Promise<string> {
  if (!fileUrl) return "";
  if (looksLikeImage(fileUrl)) {
    return fileUrl;
  }

  try {
    const pdfBlob = await fetchAsBlob(fileUrl);
    return await renderPdfFirstPageToBlobUrl(pdfBlob);
  } catch (err) {
    console.warn("Could not rasterize PDF template preview:", err);
    return fileUrl;
  }
}
