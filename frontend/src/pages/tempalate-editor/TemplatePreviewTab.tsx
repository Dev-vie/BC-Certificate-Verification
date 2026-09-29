import { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Layout,
  RefreshCw,
  Maximize2,
  Minimize2,
  Grid,
  Info,
  Layers,
  Sun,
  Moon,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  type CanvasField,
} from "./templateEditorConstants";

interface TemplatePreviewTabProps {
  templateTitle: string;
  canvasFields: CanvasField[];
  hasUploadedTemplate: boolean;
  templateBackgroundUrl: string | null;
  onSwitchToCanvas: () => void;
}

const PRESET_DATA = {
  standard: {
    recipientName: "Amara Okafor",
    certificateId: "CERT-2026-4821",
    courseProgram: "Advanced Web Development & Cloud Architecture",
    issueDate: "June 28, 2026",
    email: "amara.okafor@example.com",
    grade: "Distinction",
    institutionName: "VeriCert Academy of Technology",
  },
  longName: {
    recipientName: "Dr. Alexander Montgomery-Cunningham III",
    certificateId: "CERT-2026-9948210-PRO",
    courseProgram:
      "Executive Master of Science in Distributed Ledger Technology & Cybersecurity Systems",
    issueDate: "December 31, 2026",
    email: "alexander.montgomery.cunningham@institution-alumni.org",
    grade: "Summa Cum Laude (First Class)",
    institutionName: "Global Consortium of Blockchain & Digital Asset Studies",
  },
  minimal: {
    recipientName: "Sam Li",
    certificateId: "C-102",
    courseProgram: "UX Design",
    issueDate: "08/18/2026",
    email: "sam@li.io",
    grade: "A+",
    institutionName: "Design Lab",
  },
};

export const TemplatePreviewTab: React.FC<TemplatePreviewTabProps> = ({
  templateTitle,
  canvasFields,
  hasUploadedTemplate,
  templateBackgroundUrl,
  onSwitchToCanvas,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [testData, setTestData] = useState<Record<string, string>>({
    ...PRESET_DATA.standard,
  });
  const [showOutlines, setShowOutlines] = useState(false);
  const [showGuides, setShowGuides] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [backdropTheme, setBackdropTheme] = useState<"dark" | "light">("dark");
  const [zoom, setZoom] = useState(1.15);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedInspectField, setSelectedInspectField] =
    useState<CanvasField | null>(null);
  const [activePreset, setActivePreset] = useState<
    "standard" | "longName" | "minimal" | "custom"
  >("standard");

  const handleFitToScreen = () => {
    if (!containerRef.current) return;
    const availableWidth = containerRef.current.clientWidth - 80;
    const availableHeight = containerRef.current.clientHeight - 80;
    if (availableWidth > 0 && availableHeight > 0) {
      const scaleX = availableWidth / CANVAS_WIDTH;
      const scaleY = availableHeight / CANVAS_HEIGHT;
      const fitScale = Math.min(scaleX, scaleY, 2.0);
      setZoom(Math.max(0.6, Math.round(fitScale * 100) / 100));
    }
  };

  useEffect(() => {

    const timer = setTimeout(() => {
      handleFitToScreen();
    }, 100);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const handleApplyPreset = (presetKey: "standard" | "longName" | "minimal") => {
    setActivePreset(presetKey);
    setTestData({ ...PRESET_DATA[presetKey] });
  };

  const handleFieldChange = (key: string, value: string) => {
    setActivePreset("custom");
    setTestData((prev) => ({ ...prev, [key]: value }));
  };

  const hasRecipientName = canvasFields.some((f) => f.id === "recipientName");
  const hasCourse = canvasFields.some(
    (f) => f.id === "courseProgram" || f.id === "course",
  );
  const hasQrCode = canvasFields.some((f) => f.id === "qrCode");
  const isWellConfigured = hasRecipientName && hasCourse;

  return (
    <div
      className={`flex flex-1 overflow-hidden bg-background ${
        isFullscreen
          ? "fixed inset-0 z-50 h-screen w-screen"
          : "h-[calc(100vh-64px)]"
      }`}
    >

      <div className="flex-1 flex flex-col min-w-0 border-r border-border overflow-hidden">

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-border bg-card/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                isWellConfigured
                  ? "bg-emerald-500/10 text-[#3D876C] border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
              }`}
            >
              {isWellConfigured ? (
                <>
                  <CheckCircle2 size={13} />
                  Ready to Issue ({canvasFields.length} fields)
                </>
              ) : (
                <>
                  <AlertTriangle size={13} />
                  Missing Essential Fields
                </>
              )}
            </span>

            {hasQrCode && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#3D876C]/10 text-[#3D876C]">
                QR Code Placed
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() => setShowOutlines((prev) => !prev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                showOutlines
                  ? "bg-[#3D876C]/10 border-[#3D876C] text-[#3D876C]"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
              title="Toggle bounding box outlines around every field"
            >
              <Layout size={13} />
              {showOutlines ? "Outlines On" : "Outlines"}
            </button>

            <button
              type="button"
              onClick={() => setShowGuides((prev) => !prev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                showGuides
                  ? "bg-[#3D876C]/10 border-[#3D876C] text-[#3D876C]"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
              title="Toggle center crosshairs"
            >
              <Sliders size={13} />
              {showGuides ? "Center Axis On" : "Center Axis"}
            </button>

            <button
              type="button"
              onClick={() => setShowGrid((prev) => !prev)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                showGrid
                  ? "bg-[#3D876C]/10 border-[#3D876C] text-[#3D876C]"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
              title="Toggle alignment grid"
            >
              <Grid size={13} />
              {showGrid ? "Grid On" : "Grid"}
            </button>

            <button
              type="button"
              onClick={() =>
                setBackdropTheme((t) => (t === "dark" ? "light" : "dark"))
              }
              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
              title="Toggle background contrast"
            >
              {backdropTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            <div className="flex items-center bg-card border border-border rounded-lg p-0.5 ml-1">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.15) * 100) / 100))}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-background cursor-pointer"
                title="Zoom Out (Ctrl -)"
              >
                <ZoomOut size={14} />
              </button>

              <button
                type="button"
                onClick={handleFitToScreen}
                className="px-2 py-1 text-xs font-semibold font-mono text-muted-foreground hover:text-foreground select-none cursor-pointer"
                title="Fit to Screen"
              >
                {Math.round(zoom * 100)}%
              </button>

              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, Math.round((z + 0.15) * 100) / 100))}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-background cursor-pointer"
                title="Zoom In (Ctrl +)"
              >
                <ZoomIn size={14} />
              </button>

              <button
                type="button"
                onClick={() => setZoom(1)}
                className="px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground rounded hover:bg-background cursor-pointer"
                title="100% Actual Size"
              >
                1:1
              </button>

              <button
                type="button"
                onClick={handleFitToScreen}
                className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-background cursor-pointer"
                title="Fit to Window"
              >
                <RotateCcw size={13} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer ml-1"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          </div>
        </div>

        <div
          ref={containerRef}
          className={`flex-1 overflow-auto p-12 flex items-center justify-center relative transition-colors duration-200 ${
            backdropTheme === "dark"
              ? "bg-slate-950/90"
              : "bg-slate-100"
          }`}
        >

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
                imageRendering: "auto",
              }}
              className="relative shrink-0 overflow-hidden rounded-xl border border-slate-300 shadow-2xl bg-white select-none transition-transform duration-75"
            >

              {showGrid && (
                <div
                  className="absolute inset-0 pointer-events-none z-30 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #64748b 1px, transparent 1px), linear-gradient(to bottom, #64748b 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
              )}

              {showGuides && (
                <>
                  <div className="absolute inset-y-0 left-1/2 w-px bg-rose-500/50 pointer-events-none z-40 shadow-xs" />
                  <div className="absolute inset-x-0 top-1/2 h-px bg-rose-500/50 pointer-events-none z-40 shadow-xs" />
                  <span className="absolute top-2 left-1/2 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-mono px-1 rounded-xs pointer-events-none z-40">
                    Center X
                  </span>
                </>
              )}

              {hasUploadedTemplate ? (
                <img
                  src={templateBackgroundUrl ?? undefined}
                  alt={`${templateTitle} certificate background`}
                  className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                  draggable={false}
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-slate-50 to-slate-100">
                  <p className="text-sm font-semibold text-slate-700">
                    Default Certificate Canvas
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Upload a design template in the Design tab for custom styling.
                  </p>
                </div>
              )}

              {canvasFields.map((field) => {
                const sampleValue = testData[field.id] || field.name;
                const isSelected = selectedInspectField?.id === field.id;

                return (
                  <div
                    key={field.id}
                    onClick={() => setSelectedInspectField(field)}
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
                    className={`flex items-center transition-all cursor-pointer ${
                      isSelected
                        ? "ring-2 ring-[#3D876C] bg-[#3D876C]/10"
                        : showOutlines
                        ? "ring-1 ring-dashed ring-[#3D876C] bg-[#3D876C]/5 hover:bg-[#3D876C]/15"
                        : "hover:ring-1 hover:ring-[#3D876C]/40 hover:bg-[#3D876C]/5"
                    }`}
                    title={`Click to inspect ${field.name} (${field.width}x${field.height}px)`}
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
                        {sampleValue}
                      </div>
                    )}

                    {showOutlines && (
                      <span className="absolute -top-4 left-0 text-[9px] font-mono bg-[#3D876C] text-white px-1 rounded-xs uppercase tracking-wider pointer-events-none">
                        {field.name}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-card border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 text-muted-foreground">
            <span>
              Canvas: <strong className="text-foreground">{CANVAS_WIDTH} × {CANVAS_HEIGHT} px</strong>
            </span>
            <span>
              Zoom: <strong className="text-foreground">{Math.round(zoom * 100)}%</strong>
            </span>
            {selectedInspectField && (
              <span className="flex items-center gap-1.5 text-[#3D876C] font-medium bg-[#3D876C]/10 px-2 py-0.5 rounded-md">
                <Info size={13} />
                Selected: {selectedInspectField.name} ({selectedInspectField.width}×{selectedInspectField.height}px at x:{selectedInspectField.x}, y:{selectedInspectField.y} · {selectedInspectField.fontSize}px {selectedInspectField.fontFamily})
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onSwitchToCanvas}
            className="font-bold text-[#3D876C] hover:underline cursor-pointer flex items-center gap-1"
          >
            Adjust Positions on Canvas →
          </button>
        </div>
      </div>

      <div className="w-88 flex flex-col shrink-0 bg-card overflow-y-auto border-border">

        <div className="p-5 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={16} className="text-[#3D876C]" />
            <h3 className="font-bold text-foreground text-sm">
              Live Detail Inspector
            </h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Test and inspect certificate fields with real typography and layout rules.
          </p>
        </div>

        {selectedInspectField && (
          <div className="p-5 border-b border-border bg-emerald-500/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#3D876C] uppercase tracking-wider flex items-center gap-1">
                <Layers size={13} /> Field Detail
              </span>
              <button
                type="button"
                onClick={() => setSelectedInspectField(null)}
                className="text-[11px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Field:</span>
                <strong className="text-foreground">{selectedInspectField.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Font:</span>
                <strong className="text-foreground">{selectedInspectField.fontFamily} ({selectedInspectField.fontSize}px)</strong>
              </div>
              <div className="flex justify-between">
                <span>Align / Style:</span>
                <strong className="text-foreground capitalize">{selectedInspectField.align} {selectedInspectField.isBold ? "· Bold" : ""} {selectedInspectField.isItalic ? "· Italic" : ""}</strong>
              </div>
              <div className="flex justify-between">
                <span>Box Size:</span>
                <span className="font-mono text-foreground">{selectedInspectField.width} × {selectedInspectField.height} px</span>
              </div>
              <div className="flex justify-between">
                <span>Position:</span>
                <span className="font-mono text-foreground">X: {selectedInspectField.x} | Y: {selectedInspectField.y}</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-5 border-b border-border space-y-3">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider">
            Test Data Presets
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleApplyPreset("standard")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activePreset === "standard"
                  ? "bg-[#3D876C] text-white border-[#3D876C]"
                  : "bg-background border-border text-foreground hover:bg-card"
              }`}
            >
              Standard
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("longName")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activePreset === "longName"
                  ? "bg-[#3D876C] text-white border-[#3D876C]"
                  : "bg-background border-border text-foreground hover:bg-card"
              }`}
            >
              Long Text
            </button>
            <button
              type="button"
              onClick={() => handleApplyPreset("minimal")}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activePreset === "minimal"
                  ? "bg-[#3D876C] text-white border-[#3D876C]"
                  : "bg-background border-border text-foreground hover:bg-card"
              }`}
            >
              Minimal
            </button>
          </div>
        </div>

        <div className="p-5 space-y-4 flex-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-foreground uppercase tracking-wider">
              Test Values
            </label>
            <button
              type="button"
              onClick={() => handleApplyPreset("standard")}
              className="text-xs font-semibold text-muted-foreground hover:text-[#3D876C] flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw size={11} /> Reset
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Recipient Name
              </label>
              <input
                type="text"
                value={testData.recipientName || ""}
                onChange={(e) =>
                  handleFieldChange("recipientName", e.target.value)
                }
                placeholder="e.g. Amara Okafor"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-[#3D876C]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Course / Program
              </label>
              <input
                type="text"
                value={testData.courseProgram || ""}
                onChange={(e) =>
                  handleFieldChange("courseProgram", e.target.value)
                }
                placeholder="e.g. Advanced Web Development"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-[#3D876C]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Grade
                </label>
                <input
                  type="text"
                  value={testData.grade || ""}
                  onChange={(e) => handleFieldChange("grade", e.target.value)}
                  placeholder="e.g. Distinction"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-[#3D876C]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Issue Date
                </label>
                <input
                  type="text"
                  value={testData.issueDate || ""}
                  onChange={(e) =>
                    handleFieldChange("issueDate", e.target.value)
                  }
                  placeholder="e.g. June 28, 2026"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-[#3D876C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Certificate ID
              </label>
              <input
                type="text"
                value={testData.certificateId || ""}
                onChange={(e) =>
                  handleFieldChange("certificateId", e.target.value)
                }
                placeholder="e.g. CERT-2026-4821"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-[#3D876C]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">
                Institution Name
              </label>
              <input
                type="text"
                value={testData.institutionName || ""}
                onChange={(e) =>
                  handleFieldChange("institutionName", e.target.value)
                }
                placeholder="e.g. VeriCert Academy"
                className="w-full px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-[#3D876C]"
              />
            </div>
          </div>
        </div>

        <div className="p-5 bg-background/50 border-t border-border space-y-2.5">
          <label className="text-xs font-bold text-foreground uppercase tracking-wider block">
            Visual Quality Checklist
          </label>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  hasRecipientName ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span>Recipient Name placed ({hasRecipientName ? "Pass" : "Missing"})</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  hasCourse ? "bg-emerald-500" : "bg-rose-500"
                }`}
              />
              <span>Course Title placed ({hasCourse ? "Pass" : "Missing"})</span>
            </li>
            <li className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  canvasFields.length >= 4 ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              <span>Field completeness ({canvasFields.length}/5 configured)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewTab;
