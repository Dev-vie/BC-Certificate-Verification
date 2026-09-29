import { useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SAMPLE_PREVIEW_DATA,
  type CanvasField,
} from "./templateEditorConstants";

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateTitle: string;
  canvasFields: CanvasField[];
  hasUploadedTemplate: boolean;
  templateBackgroundUrl: string | null;
}

export function TemplatePreviewModal({
  isOpen,
  onClose,
  templateTitle,
  canvasFields,
  hasUploadedTemplate,
  templateBackgroundUrl,
}: TemplatePreviewModalProps) {
  const [zoom, setZoom] = useState(1.1);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(event) => event.stopPropagation()}
      >

        <div className="flex items-center justify-between border-b border-border px-6 py-4 bg-card shrink-0">
          <div>
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Full Resolution Preview
            </p>
            <h3 className="font-bold text-foreground text-base">{templateTitle}</h3>
          </div>

          <div className="flex items-center gap-3">

            <div className="flex items-center bg-background border border-border rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-card cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut size={14} />
              </button>
              <span className="px-2 text-xs font-semibold font-mono text-muted-foreground select-none">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.2, z + 0.15))}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-card cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn size={14} />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1.1)}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-card cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw size={13} />
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close preview"
              className="p-2 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-8 flex items-center justify-center overflow-auto flex-1 bg-slate-950/40">
          <div
            style={{
              width: `${CANVAS_WIDTH * zoom}px`,
              height: `${CANVAS_HEIGHT * zoom}px`,
            }}
            className="flex items-center justify-center shrink-0 m-auto"
          >
            <div
              style={{
                width: `${CANVAS_WIDTH}px`,
                height: `${CANVAS_HEIGHT}px`,
                transform: `scale(${zoom})`,
                transformOrigin: "center center",
                WebkitFontSmoothing: "antialiased",
              }}
              className="shrink-0 relative overflow-hidden rounded-xl border border-slate-300 shadow-2xl bg-white select-none transition-transform duration-75"
            >
              {hasUploadedTemplate ? (
                <img
                  src={templateBackgroundUrl ?? undefined}
                  alt={`${templateTitle} template`}
                  className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 bg-slate-50">
                  <p className="text-sm font-semibold text-slate-700">
                    Default Certificate Canvas
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a certificate design to preview it here.
                  </p>
                </div>
              )}

              {canvasFields.map((field) => (
                <div
                  key={field.id}
                  style={{
                    position: "absolute",
                    left: `${field.x}px`,
                    top: `${field.y}px`,
                    width: `${field.width}px`,
                    height: `${field.height}px`,
                    fontFamily: field.fontFamily,
                    fontSize: `${field.fontSize}px`,
                    fontWeight: field.isBold ? "bold" : "normal",
                    fontStyle: field.isItalic ? "italic" : "normal",
                    color: field.color,
                    textAlign: field.align,
                  }}
                  className="flex items-center"
                >
                  {field.id === "qrCode" ? (
                    <div className="w-full h-full flex items-center justify-center p-1">
                      <QRCodeSVG
                        value="https://vericert.io/verify/SAMPLE-VERIFY-ID"
                        size={Math.min(field.width, field.height) * 0.9}
                      />
                    </div>
                  ) : (
                    <div
                      className={`w-full h-full flex items-center truncate ${
                        field.align === "left"
                          ? "justify-start"
                          : field.align === "right"
                          ? "justify-end"
                          : "justify-center"
                      }`}
                    >
                      {SAMPLE_PREVIEW_DATA[field.id] ?? field.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 border-t border-border bg-card flex items-center justify-between text-xs text-muted-foreground shrink-0">
          <span>
            Dimensions: {CANVAS_WIDTH} × {CANVAS_HEIGHT} px (Scaled {Math.round(zoom * 100)}%)
          </span>
          <span>Showing authentic recipient sample data.</span>
        </div>
      </div>
    </div>
  );
}

export default TemplatePreviewModal;
