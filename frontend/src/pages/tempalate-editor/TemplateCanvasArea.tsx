import type {
  DragEvent,
  PointerEvent as ReactPointerEvent,
  RefObject,
} from "react";
import { QrCode, ZoomIn, ZoomOut, RotateCcw, Trash2 } from "lucide-react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ZOOM_MIN,
  ZOOM_MAX,
  type CanvasField,
} from "./templateEditorConstants";

interface TemplateCanvasAreaProps {
  canvasRef: RefObject<HTMLDivElement | null>;
  canvasFields: CanvasField[];
  selectedFieldId: string | null;
  setSelectedFieldId: (id: string | null) => void;
  onRemoveField: (fieldId: string) => void;
  onCanvasDrop: (event: DragEvent<HTMLDivElement>) => void;
  onFieldPointerDown: (
    event: ReactPointerEvent<HTMLDivElement>,
    fieldId: string,
  ) => void;
  templateTitle: string;
  hasUploadedTemplate: boolean;
  templateBackgroundUrl: string | null;
  previewError: string | null;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
}

export function TemplateCanvasArea({
  canvasRef,
  canvasFields,
  selectedFieldId,
  setSelectedFieldId,
  onRemoveField,
  onCanvasDrop,
  onFieldPointerDown,
  templateTitle,
  hasUploadedTemplate,
  templateBackgroundUrl,
  previewError,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
}: TemplateCanvasAreaProps) {
  return (
    <div className="flex-1 bg-background relative flex flex-col items-center justify-center p-8 overflow-auto transition-colors duration-200">
      <div
        ref={canvasRef}
        onDragOver={(event) => event.preventDefault()}
        onDrop={onCanvasDrop}
        style={{
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
        }}
        className="shrink-0 relative overflow-hidden rounded-xl border border-border shadow-lg bg-white transition-transform duration-100 select-none cursor-default"
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedFieldId(null);
          }
        }}
      >

        {hasUploadedTemplate ? (
          <img
            src={templateBackgroundUrl ?? undefined}
            alt={`${templateTitle} template`}
            className="absolute inset-0 h-full w-full object-contain pointer-events-none select-none"
            draggable={false}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8 bg-slate-50 pointer-events-none select-none">
            <p className="text-sm text-slate-500 font-medium">
              Upload a certificate PDF or image to design your template.
            </p>
          </div>
        )}

        {hasUploadedTemplate && (
          <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-card/90 text-[10px] font-bold text-foreground shadow-sm backdrop-blur-sm border border-border pointer-events-none select-none">
            Uploaded template
          </div>
        )}

        {canvasFields.map((field) => (
          <div
            key={field.id}
            onPointerDown={(event) => {
              event.stopPropagation();
              onFieldPointerDown(event, field.id);
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedFieldId(field.id);
            }}
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
              touchAction: "none",
              zIndex: selectedFieldId === field.id ? 25 : 15,
            }}
            className={`group flex items-center cursor-move border-2 ${
              selectedFieldId === field.id
                ? "border-[#3D876C] bg-[#3D876C]/10 shadow-sm"
                : "border-dashed border-border hover:border-[#3D876C]/50"
            }`}
          >
            {field.id === "qrCode" ? (
              <div className="w-full h-full flex items-center justify-center p-2 pointer-events-none select-none">
                <div className="flex items-center justify-center w-full h-full min-h-[84px] rounded-[18px] bg-transparent overflow-hidden">
                  <QrCode
                    size={54}
                    className="text-[#3D876C] drop-shadow-sm"
                    strokeWidth={2.2}
                  />
                </div>
              </div>
            ) : (
              <div
                className={`w-full h-full flex items-center p-2 truncate pointer-events-none select-none ${
                  field.align === "left"
                    ? "justify-start"
                    : field.align === "right"
                    ? "justify-end"
                    : "justify-center"
                }`}
              >
                {field.name}
              </div>
            )}

            {selectedFieldId === field.id && (
              <div className="absolute -top-3.5 -left-[2px] bg-[#3D876C] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs flex items-center gap-1 pointer-events-none select-none">
                <span>{field.name}</span>
              </div>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemoveField(field.id);
              }}
              onPointerDown={(e) => e.stopPropagation()}
              className={`absolute -top-3.5 -right-3.5 z-30 w-7 h-7 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white shadow-md flex items-center justify-center transition-all cursor-pointer ${
                selectedFieldId === field.id
                  ? "opacity-100 scale-100 ring-2 ring-white dark:ring-slate-900"
                  : "opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100"
              }`}
              title={`Remove ${field.name} from canvas`}
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      <p className="text-muted-foreground text-xs mt-6 font-medium">
        Drag a field from the left, then drag it on the template to fine-tune
        placement
      </p>
      {previewError && (
        <p className="text-amber-500 text-xs mt-2 font-medium max-w-[600px] text-center">
          {previewError}
        </p>
      )}

      <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-card border border-border shadow-lg px-1.5 py-1.5">
        <button
          type="button"
          onClick={onZoomOut}
          disabled={zoom <= ZOOM_MIN}
          aria-label="Zoom out"
          className="p-1.5 rounded-full text-muted-foreground hover:bg-background hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ZoomOut size={15} />
        </button>
        <button
          type="button"
          onClick={onZoomReset}
          className="min-w-[44px] text-center text-xs font-semibold text-foreground hover:text-[#3D876C] transition-colors cursor-pointer"
          title="Reset zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          type="button"
          onClick={onZoomIn}
          disabled={zoom >= ZOOM_MAX}
          aria-label="Zoom in"
          className="p-1.5 rounded-full text-muted-foreground hover:bg-background hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <ZoomIn size={15} />
        </button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <button
          type="button"
          onClick={onZoomReset}
          disabled={zoom === 1}
          aria-label="Reset zoom to 100%"
          className="p-1.5 rounded-full text-muted-foreground hover:bg-background hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}

export default TemplateCanvasArea;
