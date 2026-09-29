import { useState, useMemo } from "react";
import {
  Eye,
  Edit3,
  Columns2,
  Mail,
  Archive,
  Trash2,
  Star,
  CornerUpLeft,
  MoreVertical,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Tag,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Minimize2,
  Smartphone,
  Monitor,
  Sun,
  Moon,
} from "lucide-react";
import RichText from "../../components/TemplatePage/richtext";
import { AVAILABLE_FIELDS, SPECIAL_FIELDS } from "./templateEditorConstants";
import { QRCodeSVG } from "qrcode.react";

interface TemplateEmailTabProps {
  emailSubject: string;
  setEmailSubject: (value: string) => void;
  emailContent: string;
  setEmailContent: (value: string) => void;
}

const EMAIL_TEST_PRESETS = {
  standard: {
    recipientName: "Amara Okafor",
    recipientEmail: "amara.okafor@example.com",
    course: "Advanced Web Development & Cloud Architecture",
    grade: "Distinction",
    certificateId: "CERT-2026-4821",
    issueDate: "June 28, 2026",
    institutionName: "VeriCert Academy of Technology",
  },
  longName: {
    recipientName: "Dr. Alexander Montgomery-Cunningham III",
    recipientEmail: "alexander.cunningham@global-academy.org",
    course:
      "Executive Master of Science in Distributed Ledger Technology & Cybersecurity",
    grade: "Summa Cum Laude",
    certificateId: "CERT-2026-994821-PRO",
    issueDate: "December 31, 2026",
    institutionName: "Global Consortium of Blockchain & Digital Asset Studies",
  },
  minimal: {
    recipientName: "Sam Li",
    recipientEmail: "sam@li.io",
    course: "UX Design",
    grade: "A+",
    certificateId: "C-102",
    issueDate: "August 18, 2026",
    institutionName: "Design Lab",
  },
};

export function TemplateEmailTab({
  emailSubject,
  setEmailSubject,
  emailContent,
  setEmailContent,
}: TemplateEmailTabProps) {
  const [viewMode, setViewMode] = useState<"edit" | "split" | "preview">(
    "split",
  );
  const [deviceView, setDeviceView] = useState<"desktop" | "mobile">("desktop");
  const [backdropTheme, setBackdropTheme] = useState<"dark" | "light">("dark");
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activePreset, setActivePreset] = useState<
    "standard" | "longName" | "minimal"
  >("standard");
  const [testData, setTestData] = useState({ ...EMAIL_TEST_PRESETS.standard });
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const handleApplyPreset = (presetKey: "standard" | "longName" | "minimal") => {
    setActivePreset(presetKey);
    setTestData({ ...EMAIL_TEST_PRESETS[presetKey] });
  };

  const handleCopyTag = (tagName: string) => {
    navigator.clipboard.writeText(`[${tagName}]`);
    setCopiedVar(tagName);
    setTimeout(() => setCopiedVar(null), 1800);
  };

  const handleInsertIntoSubject = (tagName: string) => {
    setEmailSubject(`${emailSubject} [${tagName}]`);
  };

  const handleInsertIntoBody = (tagName: string) => {
    setEmailContent(`${emailContent} [${tagName}]`);
  };

  const replaceVariables = (text: string) => {
    if (!text) return "";

    const replacements: Record<string, string> = {

      "{{Recipient Name}}": testData.recipientName,
      "{{Name}}": testData.recipientName,
      "{{recipientName}}": testData.recipientName,
      "[Recipient Name]": testData.recipientName,
      "[Name]": testData.recipientName,
      "[recipientName]": testData.recipientName,
      "{Recipient Name}": testData.recipientName,
      "{Name}": testData.recipientName,

      "{{Recipient Email}}": testData.recipientEmail,
      "{{Email}}": testData.recipientEmail,
      "[Recipient Email]": testData.recipientEmail,
      "[Email]": testData.recipientEmail,
      "{Recipient Email}": testData.recipientEmail,
      "{Email}": testData.recipientEmail,

      "{{Course / Program}}": testData.course,
      "{{Course}}": testData.course,
      "{{Program}}": testData.course,
      "[Course / Program]": testData.course,
      "[Course]": testData.course,
      "[Program]": testData.course,
      "{Course / Program}": testData.course,
      "{Course}": testData.course,

      "{{Grade}}": testData.grade,
      "[Grade]": testData.grade,
      "{Grade}": testData.grade,

      "{{Certificate ID}}": testData.certificateId,
      "{{ID}}": testData.certificateId,
      "[Certificate ID]": testData.certificateId,
      "[ID]": testData.certificateId,
      "{Certificate ID}": testData.certificateId,

      "{{Issue Date}}": testData.issueDate,
      "{{Date}}": testData.issueDate,
      "[Issue Date]": testData.issueDate,
      "[Date]": testData.issueDate,
      "{Issue Date}": testData.issueDate,

      "{{Institution Name}}": testData.institutionName,
      "{{Institution}}": testData.institutionName,
      "[Institution Name]": testData.institutionName,
      "[Institution]": testData.institutionName,
      "{Institution Name}": testData.institutionName,
    };

    let result = text;
    Object.keys(replacements).forEach((k) => {
      const regex = new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
      result = result.replace(regex, replacements[k]);
    });

    return result;
  };

  const renderedSubject = useMemo(() => {
    const sub =
      emailSubject ||
      "Congratulations [Recipient Name]! Your Certificate for [Course / Program] Has Been Issued";
    return replaceVariables(sub);
  }, [emailSubject, testData]);

  const renderedBodyHtml = useMemo(() => {
    const body =
      emailContent ||
      "<p>Dear [Recipient Name],</p><p>Congratulations! Your official certificate for <strong>[Course / Program]</strong> has been issued and anchored on the blockchain.</p>";
    return replaceVariables(body);
  }, [emailContent, testData]);

  const hasQrTag =
    emailContent?.includes("[QR Code]") ||
    emailContent?.includes("[QR]") ||
    emailContent?.includes("{{QR Code}}") ||
    emailContent?.includes("{{QR}}") ||
    emailContent?.includes("{QR Code}");

  const hasNameTag =
    emailSubject?.includes("[Name]") ||
    emailSubject?.includes("[Recipient Name]") ||
    emailContent?.includes("[Name]") ||
    emailContent?.includes("[Recipient Name]") ||
    emailSubject?.includes("{{Name}}") ||
    emailContent?.includes("{{Name}}");

  return (
    <div
      className={`flex flex-1 overflow-hidden bg-background ${
        isFullscreen
          ? "fixed inset-0 z-50 h-screen w-screen"
          : "h-[calc(100vh-64px)]"
      }`}
    >

      <div className="w-full flex flex-col flex-1 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 border-b border-border bg-card/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">

            <div className="flex bg-background border border-border p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode("edit")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "edit"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit3 size={13} />
                Editor
              </button>
              <button
                type="button"
                onClick={() => setViewMode("split")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "split"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Columns2 size={13} />
                Split View
              </button>
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "preview"
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye size={13} />
                Gmail Preview
              </button>
            </div>

            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                hasNameTag
                  ? "bg-emerald-500/10 text-[#3D876C] border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
              }`}
            >
              {hasNameTag ? "✓ Personalized" : "Missing [Name] tag"}
            </span>
          </div>

          <div className="flex items-center gap-2">

            {(viewMode === "split" || viewMode === "preview") && (
              <div className="flex bg-background border border-border p-0.5 rounded-lg mr-1">
                <button
                  type="button"
                  onClick={() => setDeviceView("desktop")}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    deviceView === "desktop"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Desktop Gmail Preview"
                >
                  <Monitor size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceView("mobile")}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    deviceView === "mobile"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Mobile Gmail Preview"
                >
                  <Smartphone size={14} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() =>
                setBackdropTheme((t) => (t === "dark" ? "light" : "dark"))
              }
              className="p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
              title="Toggle backdrop contrast"
            >
              {backdropTheme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
            </button>

            {(viewMode === "split" || viewMode === "preview") && (
              <div className="flex items-center bg-card border border-border rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(0.7, Math.round((z - 0.1) * 100) / 100))}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-background cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut size={14} />
                </button>
                <span className="px-2 text-xs font-semibold font-mono text-muted-foreground select-none">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(1.6, Math.round((z + 0.1) * 100) / 100))}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-background cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setZoom(1.0)}
                  className="p-1.5 text-muted-foreground hover:text-foreground rounded hover:bg-background cursor-pointer"
                  title="Reset 100%"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            )}

            <div className="hidden lg:flex items-center gap-1.5 ml-1">
              <button
                type="button"
                onClick={() => handleApplyPreset("standard")}
                className={`px-2 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                  activePreset === "standard"
                    ? "bg-[#3D876C] text-white border-[#3D876C]"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset("longName")}
                className={`px-2 py-1 text-xs font-medium rounded-md border transition-all cursor-pointer ${
                  activePreset === "longName"
                    ? "bg-[#3D876C] text-white border-[#3D876C]"
                    : "bg-card border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                Long Text
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

        <div className="flex-1 flex overflow-hidden">

          {(viewMode === "edit" || viewMode === "split") && (
            <div
              className={`flex flex-col border-r border-border overflow-y-auto p-6 bg-background ${
                viewMode === "split" ? "w-1/2 min-w-[380px]" : "flex-1 max-w-4xl mx-auto"
              }`}
            >
              <div className="bg-card rounded-2xl shadow-xs border border-border p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-base font-bold text-foreground">
                      Email Delivery Content
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Use tags like <code className="text-[#3D876C] font-semibold">[Name]</code> or <code className="text-[#3D876C] font-semibold">[Course]</code> to personalize emails.
                    </p>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Subject Line
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      e.g. Congratulations [Name]!
                    </span>
                  </div>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="e.g. Congratulations [Recipient Name]! Your Certificate for [Course / Program] Has Been Issued"
                    className="w-full p-3 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-[#3D876C]/20 focus:border-[#3D876C]/50 transition-all text-sm font-medium"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Email Body Content
                    </label>
                    <span className="text-[11px] text-muted-foreground">
                      Rich text with dynamic tags
                    </span>
                  </div>
                  <RichText
                    content={emailContent}
                    onChange={setEmailContent}
                    className="min-h-[260px] bg-background border border-border rounded-xl text-foreground text-sm"
                  />
                </div>
              </div>

              <div className="bg-card rounded-2xl border border-border p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Tag size={14} className="text-[#3D876C]" />
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                      Dynamic Tags
                    </h3>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    Click to insert or copy
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[...AVAILABLE_FIELDS, ...SPECIAL_FIELDS].map((field) => {
                    const tagLabel = field.name;
                    const isCopied = copiedVar === tagLabel;

                    return (
                      <div
                        key={field.id}
                        className="p-2.5 rounded-xl border border-border bg-background flex items-center justify-between gap-2 hover:border-[#3D876C]/40 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-2 py-0.5 rounded-md bg-[#3D876C]/10 text-[#3D876C] font-semibold text-xs truncate">
                            [{tagLabel}]
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleInsertIntoSubject(tagLabel)}
                            title="Insert into Subject Line"
                            className="px-2 py-1 text-[10px] font-semibold rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-background transition-colors cursor-pointer"
                          >
                            + Subject
                          </button>
                          <button
                            type="button"
                            onClick={() => handleInsertIntoBody(tagLabel)}
                            title="Insert into Email Body"
                            className="px-2 py-1 text-[10px] font-semibold rounded-md border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-background transition-colors cursor-pointer"
                          >
                            + Body
                          </button>
                          <button
                            type="button"
                            onClick={() => handleCopyTag(tagLabel)}
                            title="Copy Tag"
                            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-card transition-colors cursor-pointer"
                          >
                            {isCopied ? (
                              <Check size={13} className="text-[#3D876C]" />
                            ) : (
                              <Copy size={13} />
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {(viewMode === "preview" || viewMode === "split") && (
            <div
              className={`flex-1 flex flex-col overflow-auto p-6 transition-colors duration-200 ${
                backdropTheme === "dark"
                  ? "bg-slate-950/90"
                  : "bg-slate-100"
              }`}
            >

              <div
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: "top center",
                }}
                className="flex items-start justify-center transition-transform duration-75 m-auto max-w-full"
              >

                {deviceView === "desktop" ? (

                  <div className="w-full max-w-[700px] bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden text-slate-800 flex flex-col shrink-0">

                    <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-slate-50/90">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full bg-red-400 inline-block" />
                          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
                          <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block" />
                        </div>
                        <div className="h-4 w-px bg-slate-200 ml-1" />
                        <div className="flex items-center gap-1 text-slate-600 text-xs font-semibold">
                          <Mail size={13} className="text-red-500" />
                          <span>Gmail Desktop Client</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-slate-400">
                        <Archive size={14} className="hover:text-slate-600 cursor-pointer" />
                        <Trash2 size={14} className="hover:text-slate-600 cursor-pointer" />
                        <Star size={14} className="hover:text-amber-400 cursor-pointer" />
                        <MoreVertical size={14} className="hover:text-slate-600 cursor-pointer" />
                      </div>
                    </div>

                    <div className="px-6 pt-5 pb-4 border-b border-slate-100 bg-white">

                      <div className="flex items-start justify-between gap-3 mb-4">
                        <h1 className="text-lg font-bold text-slate-900 leading-snug">
                          {renderedSubject}
                        </h1>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 text-slate-600 tracking-wider shrink-0">
                          Inbox
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                            {testData.institutionName.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">
                                {testData.institutionName}
                              </span>
                              <span className="text-xs text-slate-400">
                                &lt;noreply@vericert.io&gt;
                              </span>
                            </div>
                            <p className="text-xs text-slate-500">
                              to <span className="text-slate-700 font-medium">{testData.recipientEmail}</span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-400">
                          <span>Today, 9:25 AM</span>
                          <CornerUpLeft size={15} className="hover:text-slate-600 cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 bg-slate-50 flex justify-center">
                      <div className="w-full max-w-[560px] bg-white rounded-2xl border border-slate-200/80 shadow-md overflow-hidden">

                        <div className="bg-gradient-to-r from-[#3D876C] to-[#2C6450] p-7 text-center text-white">
                          <div className="w-14 h-14 rounded-full bg-white text-[#3D876C] font-bold text-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                            {testData.institutionName.charAt(0)}
                          </div>
                          <h2 className="text-lg font-bold tracking-tight text-white">
                            {testData.institutionName}
                          </h2>
                          <p className="text-xs text-emerald-100 mt-0.5 flex items-center justify-center gap-1 font-medium">
                            <ShieldCheck size={13} /> Official Blockchain Verified Credential
                          </p>
                        </div>

                        <div
                          className="p-7 text-slate-700 text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-2 prose-strong:text-slate-900"
                          dangerouslySetInnerHTML={{ __html: renderedBodyHtml }}
                        />

                        {hasQrTag && (
                          <div className="px-7 py-3 text-center bg-slate-50/50 border-y border-slate-100">
                            <div className="inline-block p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                              <QRCodeSVG
                                value="https://vericert.io/verify/SAMPLE-VERIFY-ID"
                                size={110}
                              />
                            </div>
                            <p className="text-[11px] text-slate-500 mt-1 font-medium">
                              Scan QR Code to verify online
                            </p>
                          </div>
                        )}

                        <div className="p-6 text-center">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 bg-[#3D876C] hover:bg-[#2C6450] text-white text-xs font-bold py-3 px-6 rounded-xl shadow-md transition-all cursor-pointer"
                          >
                            <Download size={14} />
                            View & Download Certificate (PDF)
                          </button>
                          <p className="text-[11px] text-slate-400 mt-2">
                            Anchored on Ethereum / Arbitrum blockchain
                          </p>
                        </div>

                        <div className="bg-slate-50 border-t border-slate-100 p-5 text-center">
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            Sent directly by <strong>{testData.institutionName}</strong> via VeriCert Certificate Verification System.<br />
                            Please retain this email for your official academic records.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-2.5 bg-slate-100 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                      <span>
                        ✓ Tags like <code className="text-[#3D876C] font-semibold">[Name]</code> or <code className="text-[#3D876C] font-semibold">[Course]</code> are auto-filled on delivery.
                      </span>
                      <span className="font-semibold text-[#3D876C]">
                        Desktop Ready
                      </span>
                    </div>
                  </div>
                ) : (

                  <div className="w-[375px] bg-slate-900 p-3 rounded-[40px] shadow-2xl border-4 border-slate-800 shrink-0">

                    <div className="bg-white rounded-[32px] overflow-hidden flex flex-col text-slate-800">

                      <div className="px-6 pt-3 pb-2 flex items-center justify-between text-xs font-bold text-slate-800 bg-slate-50 border-b border-slate-100">
                        <span>9:41</span>
                        <div className="w-16 h-4 bg-slate-900 rounded-full mx-auto" />
                        <div className="flex items-center gap-1 text-[10px]">
                          <span>5G</span>
                          <span>100%</span>
                        </div>
                      </div>

                      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                            {testData.institutionName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                              {testData.institutionName}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              to {testData.recipientEmail}
                            </p>
                          </div>
                        </div>
                        <Star size={14} className="text-slate-300" />
                      </div>

                      <div className="p-4 bg-slate-50/60 border-b border-slate-100">
                        <h2 className="text-sm font-bold text-slate-900 leading-snug">
                          {renderedSubject}
                        </h2>
                      </div>

                      <div className="p-3 bg-slate-100 overflow-y-auto max-h-[460px]">
                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">

                          <div className="bg-gradient-to-r from-[#3D876C] to-[#2C6450] p-4 text-center text-white">
                            <h3 className="text-sm font-bold text-white">
                              {testData.institutionName}
                            </h3>
                            <p className="text-[10px] text-emerald-100 mt-0.5">
                              Blockchain Verified Credential
                            </p>
                          </div>

                          <div
                            className="p-4 text-xs leading-relaxed text-slate-700 prose prose-xs"
                            dangerouslySetInnerHTML={{ __html: renderedBodyHtml }}
                          />

                          <div className="p-4 pt-0 text-center">
                            <button
                              type="button"
                              className="w-full py-2.5 bg-[#3D876C] text-white text-xs font-bold rounded-lg shadow-sm"
                            >
                              Download Certificate
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
                        Mobile Responsive View
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TemplateEmailTab;
