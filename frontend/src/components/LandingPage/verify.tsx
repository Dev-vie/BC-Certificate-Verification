import { useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  QrCode,
  Upload,
  RotateCcw,
  Building,
  Calendar,
  AlertCircle,
  Camera,
  Pause,
  Play,
  X,
  Loader2,
  ExternalLink,
  ArrowRight,
  Info,
  ShieldCheck,
  Lock,
  CircleHelp,
  Sparkles,
} from "lucide-react";
import { Scanner, useDevices } from "@yudiel/react-qr-scanner";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";

import AnimatedContent from "./AnimatedContent";
import { useLazyVerifyCertificateQuery } from "../../redux/features/verification/verificationAPI";
import { BLOCKCHAIN_STATUS_DISPLAY } from "../../lib/blockchainStatusDisplay";
import Carousel from "../ui/Carousel";

type VerifyTab = "upload" | "qr";

async function calculateFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function Verify() {
  const [activeTab, setActiveTab] = useState<VerifyTab>("upload");
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [_progress, setProgress] = useState(0);
  const [manualQuery, setManualQuery] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCalculatingHash, setIsCalculatingHash] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [scannerError, setScannerError] = useState<string | null>(null);

  const devices = useDevices();

  const activeDeviceId = useMemo(() => {
    if (selectedDevice) return selectedDevice;
    if (devices && devices.length > 0) {
      const backCamera = devices.find(
        (device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("environment") ||
          device.label.toLowerCase().includes("rear"),
      );
      return backCamera ? backCamera.deviceId : devices[0].deviceId;
    }
    return null;
  }, [devices, selectedDevice]);

  const highlightCodeOnCanvas = (
    detectedCodes: any[],
    ctx: CanvasRenderingContext2D,
  ) => {
    detectedCodes.forEach((detectedCode) => {
      const { boundingBox, cornerPoints } = detectedCode;
      if (!boundingBox) return;

      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 4;
      ctx.lineJoin = "round";
      ctx.strokeRect(
        boundingBox.x,
        boundingBox.y,
        boundingBox.width,
        boundingBox.height,
      );

      ctx.fillStyle = "#EF4444";
      if (cornerPoints) {
        cornerPoints.forEach((point: { x: number; y: number }) => {
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
          ctx.fill();
        });
      }
    });
  };

  const [
    triggerVerify,
    { data: verifyResult, isLoading: isFetching, isError, reset: resetVerification },
  ] = useLazyVerifyCertificateQuery();

  const handleExecuteVerification = async (queryVal: string) => {
    let cleanVal = queryVal.trim();
    if (!cleanVal) return;
    setIsCameraActive(false);
    setProgress(0);

    if (cleanVal.includes("/verify/")) {
      cleanVal = cleanVal.split("/verify/").pop()?.trim() || cleanVal;
    }

    try {
      await triggerVerify(cleanVal).unwrap();
    } catch {
      // Error handled by RTK query state
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setSelectedFile(file);
    setIsCalculatingHash(true);
    try {
      const hash = await calculateFileHash(file);
      setIsCalculatingHash(false);
      handleExecuteVerification(hash);
    } catch (err) {
      console.error("Failed to calculate SHA-256 file hash:", err);
      setIsCalculatingHash(false);
    }
  };

  const handleReset = () => {
    resetVerification();
    setSelectedFile(null);
    setIsCalculatingHash(false);
    setProgress(0);
    setIsCameraActive(false);
    setIsPaused(false);
    setScannerError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section
      id="verify"
      className="py-20 sm:py-24 bg-transparent border-t border-[var(--lp-border)] relative z-10"
    >
      <AnimatedContent
        distance={100}
        direction="vertical"
        reverse={false}
        duration={0.8}
        ease="power3.out"
        initialOpacity={0}
        animateOpacity
        scale={1}
        threshold={0.1}
        delay={0}
      >
        <div id="verify-portal" className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 text-[#60a5fa] text-[10px] font-bold uppercase tracking-widest mb-4">
            <ShieldCheck size={12} className="text-[#60a5fa]" /> Cryptographic Verification Portal
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Verify Any Certificate <span className="bg-gradient-to-r from-[#60a5fa] to-cyan-400 bg-clip-text text-transparent">Instantly</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-6">
            No account needed. Just upload a certificate PDF or scan a QR code.
          </p>

          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={() => setIsHowItWorksOpen(true)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-sm"
            >
              <CircleHelp size={14} className="text-[#3b82f6]" />
              <span>How does verification work?</span>
            </button>
          </div>

          <div className="max-w-3xl mx-auto bg-slate-950/60 border border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden text-left">

            <div className="flex p-2 gap-2 border-b border-white/10 bg-slate-900/40">
              {[
                { id: "upload", label: "Upload Certificate (PDF)", icon: Upload },
                { id: "qr", label: "Verify by QR Code Scanner", icon: QrCode },
              ].map((tab) => {
                const IconComp = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as VerifyTab);
                      handleReset();
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl flex justify-center items-center gap-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer select-none ${isSelected
                      ? "bg-[#3b82f6]/15 text-[#60a5fa] border border-[#3b82f6]/30 shadow-sm"
                      : "border border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                  >
                    <IconComp className={`w-4 h-4 ${isSelected ? "text-[#60a5fa]" : "text-slate-400"}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6 sm:p-8">
              <AnimatePresence mode="wait">
                {!verifyResult && !isError && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                  >
                    {activeTab === "upload" ? (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-1">
                          <label className="block text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                            Upload Official Certificate (PDF)
                          </label>
                          <p className="text-[11px] text-slate-400">
                            The certificate will be processed locally in your browser to verify its hash value on the ledger.
                          </p>
                        </div>
                        <div
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0];
                            if (file) handleFileUpload(file);
                          }}
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-white/10 hover:border-[#3b82f6]/60 bg-slate-900/30 hover:bg-slate-900/60 rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer group shadow-inner relative overflow-hidden"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,application/pdf"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(file);
                            }}
                          />
                          <div className="w-14 h-14 rounded-2xl bg-[#3b82f6]/10 text-[#60a5fa] border border-[#3b82f6]/20 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:bg-[#3b82f6]/20 group-hover:border-[#3b82f6]/40 transition-all duration-300 relative">
                            {isCalculatingHash || isFetching ? (
                              <Loader2 className="w-6 h-6 animate-spin text-[#60a5fa]" />
                            ) : (
                              <>
                                <Upload className="w-6 h-6" />
                                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#60a5fa] opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#60a5fa]"></span>
                                </span>
                              </>
                            )}
                          </div>
                          <p className="text-sm font-bold text-white group-hover:text-[#60a5fa] transition-colors">
                            {selectedFile ? selectedFile.name : "Drag and drop your PDF certificate here"}
                          </p>
                          <p className="text-xs text-slate-400 mt-1.5 font-medium">
                            or <span className="text-[#60a5fa] font-bold group-hover:underline">browse files</span> from your device
                          </p>
                          <p className="text-[10px] text-slate-500 mt-3 font-semibold uppercase tracking-wider">
                            PDF Format Only &bull; Max 20MB
                          </p>
                        </div>

                        {selectedFile && (
                          <div className="flex items-center justify-between p-3.5 bg-slate-900 border border-white/10 rounded-xl text-xs text-white font-semibold">
                            <span className="truncate max-w-[280px]">{selectedFile.name}</span>
                            <Button
                              size="sm"
                              onClick={() => selectedFile && handleFileUpload(selectedFile)}
                              disabled={isCalculatingHash || isFetching}
                              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white"
                            >
                              {isCalculatingHash || isFetching ? "Verifying..." : "Verify Certificate"}
                            </Button>
                          </div>
                        )}

                        {/* Sample Credential Records */}
                        <div className="pt-2 border-t border-white/10 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-primary-light" />
                              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                                Try Sample Certificates:
                              </span>
                            </div>
                            <span className="text-[10px] text-primary-light font-semibold bg-[#3D876C]/15 px-2 py-0.5 rounded-full border border-[#3D876C]/30">
                              Public Registry
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => handleExecuteVerification("VC-2026-BLOCK-9842")}
                              className="p-3 rounded-xl bg-slate-900/60 hover:bg-[#3D876C]/10 border border-white/10 hover:border-[#3D876C]/50 text-left transition-all cursor-pointer group shadow-sm hover:scale-[1.01]"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white group-hover:text-primary-light">
                                  Alex Rivera &bull; Valid Diploma
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                                  VALID
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 truncate mt-1">
                                Blockchain Architecture & Smart Contracts
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleExecuteVerification("VC-2026-AI-7719")}
                              className="p-3 rounded-xl bg-slate-900/60 hover:bg-[#3D876C]/10 border border-white/10 hover:border-[#3D876C]/50 text-left transition-all cursor-pointer group shadow-sm hover:scale-[1.01]"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white group-hover:text-primary-light">
                                  Elena Rostova &bull; Summa Cum Laude
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                                  99%
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 truncate mt-1">
                                AI Distributed Neural Systems
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleExecuteVerification("VC-2026-REVOKED-0012")}
                              className="p-3 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/30 hover:border-rose-500/60 text-left transition-all cursor-pointer group shadow-sm hover:scale-[1.01]"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-rose-300 group-hover:text-rose-200">
                                  Marcus Vance &bull; Revoked Alert
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-bold">
                                  REVOKED
                                </span>
                              </div>
                              <p className="text-[10px] text-rose-300/80 truncate mt-1">
                                Simulates Fraud &amp; Smart Contract Invalidation
                              </p>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleExecuteVerification("VC-2026-CYBER-3301")}
                              className="p-3 rounded-xl bg-slate-900/60 hover:bg-[#3D876C]/10 border border-white/10 hover:border-[#3D876C]/50 text-left transition-all cursor-pointer group shadow-sm hover:scale-[1.01]"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-white group-hover:text-primary-light">
                                  Kwame Asante &bull; ZK-Proof
                                </span>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                                  ZK-SNARK
                                </span>
                              </div>
                              <p className="text-[10px] text-slate-400 truncate mt-1">
                                Zero-Knowledge Cryptography &amp; Security
                              </p>
                            </button>
                          </div>

                          {/* Direct Manual ID / Hash Input */}
                          <div className="pt-2 flex gap-2">
                            <input
                              type="text"
                              value={manualQuery}
                              onChange={(e) => setManualQuery(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && manualQuery.trim()) {
                                  handleExecuteVerification(manualQuery);
                                }
                              }}
                              placeholder="Or enter any Certificate ID (e.g. VC-2026-BLOCK-9842) / Hash..."
                              className="flex-1 px-4 py-2.5 bg-slate-900/90 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary-light"
                            />
                            <Button
                              size="sm"
                              type="button"
                              onClick={() => manualQuery.trim() && handleExecuteVerification(manualQuery)}
                              disabled={!manualQuery.trim() || isFetching}
                              className="bg-[#3D876C] hover:bg-[#2C6450] text-white px-4 text-xs font-bold rounded-xl cursor-pointer"
                            >
                              Verify ID
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4 text-center space-y-4 w-full">
                        {isCameraActive ? (
                          <div className="w-full max-w-md flex flex-col items-center space-y-4">
                            <div className="relative w-64 h-64 sm:w-72 sm:h-72 border border-white/15 rounded-3xl overflow-hidden bg-black shadow-inner">
                              
                              {/* Finder Corners */}
                              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[#60a5fa] z-30 pointer-events-none rounded-tl-sm" />
                              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[#60a5fa] z-30 pointer-events-none rounded-tr-sm" />
                              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[#60a5fa] z-30 pointer-events-none rounded-bl-sm" />
                              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[#60a5fa] z-30 pointer-events-none rounded-br-sm" />

                              {scannerError ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-rose-400 bg-slate-900/95 text-xs z-45">
                                  <AlertCircle className="w-8 h-8 mb-2 animate-bounce text-rose-500" />
                                  <p className="font-semibold text-center mb-3">
                                    {scannerError}
                                  </p>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setScannerError(null);
                                      setIsCameraActive(false);
                                    }}
                                    className="text-rose-300 border-rose-500/30 hover:bg-rose-500/10"
                                  >
                                    Close
                                  </Button>
                                </div>
                              ) : (
                                <Scanner
                                  onScan={(detectedCodes) => {
                                    if (detectedCodes && detectedCodes.length > 0) {
                                      const code = detectedCodes[0];
                                      const value = code.rawValue;
                                      if (value) {
                                        handleExecuteVerification(value);
                                      }
                                    }
                                  }}
                                  onError={(error) => {
                                    console.error("Scanner error:", error);
                                    setScannerError(
                                      error?.message || "Error accessing camera.",
                                    );
                                  }}
                                  paused={isPaused}
                                  constraints={
                                    activeDeviceId
                                      ? { deviceId: activeDeviceId }
                                      : { facingMode: "environment" }
                                  }
                                  components={{
                                    tracker: highlightCodeOnCanvas,
                                  }}
                                />
                              )}

                              {isCameraActive && !isPaused && !scannerError && (
                                <motion.div
                                  className="absolute left-0 right-0 h-0.5 bg-[#60a5fa] shadow-md shadow-[#60a5fa]/80 z-10 pointer-events-none"
                                  animate={{ top: ["5%", "95%", "5%"] }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "linear",
                                  }}
                                />
                              )}

                              {isPaused && (
                                <div className="absolute inset-0 bg-slate-950/75 flex items-center justify-center text-white z-20">
                                  <span className="text-xs font-semibold tracking-wide flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-full border border-slate-700">
                                    <Pause className="w-3.5 h-3.5 fill-white text-white" /> Scanner Paused
                                  </span>
                                </div>
                              )}
                            </div>

                            {!scannerError && (
                              <div className="w-full space-y-3">
                                {devices && devices.length > 1 && (
                                  <div className="flex flex-col items-center">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                                      Select Camera
                                    </label>
                                    <select
                                      value={selectedDevice || ""}
                                      onChange={(e) => setSelectedDevice(e.target.value || null)}
                                      className="text-xs py-1.5 px-3 bg-[var(--lp-background)] border border-[var(--lp-border)] rounded-lg text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[var(--lp-accent)] max-w-xs transition-all cursor-pointer"
                                    >
                                      {devices.map((device) => (
                                        <option key={device.deviceId} value={device.deviceId}>
                                          {device.label || `Camera ${device.deviceId.slice(0, 5)}...`}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                )}

                                <div className="flex justify-center items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsPaused(!isPaused)}
                                    className="flex items-center gap-1.5 text-xs text-slate-300 border-[var(--lp-border)] hover:bg-white/5"
                                  >
                                    {isPaused ? <Play className="w-3.5 h-3.5 fill-slate-300" /> : <Pause className="w-3.5 h-3.5 fill-slate-300" />}
                                    {isPaused ? "Resume" : "Pause"}
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      setIsCameraActive(false);
                                      setIsPaused(false);
                                    }}
                                    className="flex items-center gap-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white"
                                  >
                                    <X className="w-3.5 h-3.5" /> Stop Scanner
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center space-y-5 w-full">
                            <div className="w-24 h-24 rounded-2xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-[#60a5fa] shadow-inner relative">
                              <QrCode className="w-12 h-12" />
                              <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center">
                                <Camera className="w-2.5 h-2.5 text-slate-400" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-white">Scan Certificate QR Code</h4>
                              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                                Use your camera to verify certificate credentials instantly. Safe, secure, and authenticated on-chain.
                              </p>
                            </div>
                            <Button
                              onClick={() => {
                                setIsCameraActive(true);
                                setScannerError(null);
                                setIsPaused(false);
                              }}
                              className="bg-[#3b82f6] hover:bg-[#2563eb] text-white flex items-center gap-2 px-6 py-2.5 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-md"
                            >
                              <Camera className="w-4 h-4" /> Initialize Camera Scanner
                            </Button>
                            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                              Hold the certificate QR code in front of your camera.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {isFetching && (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                    <Loader2 className="w-8 h-8 text-[var(--lp-accent)] animate-spin" />
                    <p className="text-xs text-slate-300 font-medium">
                      Checking certificate records and blockchain ledger...
                    </p>
                  </div>
                )}

                {!isFetching && isError && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 py-2"
                  >
                    <div className="flex items-center gap-3 text-rose-300 bg-rose-955/60 border border-rose-500/30 p-4 rounded-xl">
                      <AlertCircle className="w-6 h-6 shrink-0 text-rose-400" />
                      <div className="text-left">
                        <span className="block text-xs font-bold uppercase tracking-wider text-rose-400">
                          Certificate Not Found
                        </span>
                        <span className="text-xs text-rose-200">
                          No matching certificate record was found for this ID, link, or hash. Please check the value and try again.
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-[var(--lp-border)] text-slate-300 hover:bg-white/5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Try Another Lookup
                      </Button>
                    </div>
                  </motion.div>
                )}

                {!isFetching && verifyResult && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6 py-2"
                  >
                    {(() => {
                      const statusDisplay =
                        BLOCKCHAIN_STATUS_DISPLAY[
                        verifyResult.blockchainStatus as keyof typeof BLOCKCHAIN_STATUS_DISPLAY
                        ] || BLOCKCHAIN_STATUS_DISPLAY.NOT_ON_CHAIN;
                      const StatusIcon = statusDisplay.icon;
                      return (
                        <div
                          className={`flex items-center gap-3.5 p-4 sm:p-5 rounded-2xl border ${statusDisplay.className} shadow-sm animate-in fade-in duration-300`}
                        >
                          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                            <StatusIcon className="w-5.5 h-5.5" />
                          </div>
                          <div className="text-left space-y-0.5">
                            <span className="block text-xs font-black uppercase tracking-wider">
                              {statusDisplay.label}
                            </span>
                            <span className="text-xs opacity-90 leading-relaxed block">
                              {statusDisplay.description}
                            </span>
                          </div>
                        </div>
                      );
                    })()}

                    <div className="border border-white/10 rounded-2xl bg-slate-900/20 p-5 sm:p-6 space-y-5 text-left relative overflow-hidden shadow-inner">
                      
                      <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Decentralized Certificate Receipt
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-[#60a5fa] bg-[#3b82f6]/10 border border-[#3b82f6]/20 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse" /> Verified On-Chain
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Recipient Details Block */}
                        <div className="space-y-3 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Recipient Identity
                          </span>
                          <div className="space-y-2">
                            <div>
                              <p className="text-[10px] text-slate-400">Full Name</p>
                              <p className="text-sm font-bold text-white">{verifyResult.certificate.recipientName}</p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400">Recipient ID Reference</p>
                              <p className="text-xs font-semibold text-slate-300">{verifyResult.certificate.recipientId || "—"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Authority Block */}
                        <div className="space-y-3 p-4 rounded-xl bg-white/[0.01] border border-white/5">
                          <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Issuer Authority
                          </span>
                          <div className="space-y-2">
                            <div>
                              <p className="text-[10px] text-slate-400">Issuing Body</p>
                              <p className="text-sm font-bold text-white flex items-center gap-1.5">
                                <Building className="w-3.5 h-3.5 text-[#60a5fa]" /> {verifyResult.certificate.issuedBy}
                              </p>
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400">Certification Authority</p>
                              <p className="text-xs font-semibold text-slate-300">Decentralized Registered Institution</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Course and Grade details full width */}
                      <div className="p-4 rounded-xl bg-white/[0.01] border border-white/5 space-y-3">
                        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Credential Metadata
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-[10px] text-slate-400">Course / Program</p>
                            <p className="text-xs font-bold text-white mt-0.5">{verifyResult.certificate.course}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400">Grade / Performance</p>
                            <p className="text-xs font-bold text-slate-200 mt-0.5">{verifyResult.certificate.grade}</p>
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <p className="text-[10px] text-slate-400">Issue Date</p>
                            <p className="text-xs font-bold text-slate-200 mt-0.5 flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(verifyResult.certificate.issueDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Certificate Identifier details */}
                      <div className="p-4 rounded-xl bg-slate-950/40 border border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Credential Signature Hash</p>
                          <p className="text-xs font-mono font-bold text-[#60a5fa] mt-1 break-all select-all">
                            {verifyResult.certificate.certificateId}
                          </p>
                        </div>
                      </div>

                      {/* Full Ledger Action Link */}
                      <div className="pt-2">
                        <Link
                          to={`/verify/${verifyResult.certificate.certificateId}`}
                          className="flex items-center justify-between p-4 bg-[#3b82f6]/10 hover:bg-[#3b82f6]/15 border border-[#3b82f6]/20 rounded-xl text-[#60a5fa] font-semibold text-xs sm:text-sm transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-2.5">
                            <ExternalLink className="w-4 h-4 text-[#60a5fa] shrink-0" />
                            <span className="font-bold">Audit Cryptographic Trail &amp; Ledger Receipt</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-[#60a5fa] group-hover:translate-x-1.5 transition-transform shrink-0" />
                        </Link>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 border-[var(--lp-border)] text-slate-300 hover:bg-white/5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Verify Another
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-white/[0.01] py-3 px-6 flex justify-center items-center gap-2 border-t border-[var(--lp-border)] text-center">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs text-slate-400">
                All verifications are read-only and cryptographically secured on-chain.
              </span>
            </div>
          </div>
        </div>
      </AnimatedContent>

      <AnimatePresence>
        {isHowItWorksOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsHowItWorksOpen(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3, bounce: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-xl bg-[#111622] border border-[var(--lp-border)] rounded-3xl shadow-2xl p-6 sm:p-8 text-left z-10 overflow-hidden"
            >

              <div className="absolute top-0 right-0 w-72 h-72 bg-[var(--lp-accent)]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

              <div className="flex items-start justify-between pb-5 border-b border-[var(--lp-border)] mb-6">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 text-[#60a5fa] flex items-center justify-center border border-[#3b82f6]/30">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[var(--lp-foreground)]">
                      How Verification Works
                    </h3>
                    <p className="text-xs text-slate-400">
                      Learn how decentralized verification guarantees authentic credentials
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHowItWorksOpen(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <Carousel
                    items={[
                      {
                        id: 1,
                        step: "01",
                        title: "Upload Certificate PDF",
                        description:
                          "Upload your downloaded PDF. Your browser computes its SHA-256 cryptographic hash locally and compares it with the immutable blockchain record.",
                        icon: <Upload size={18} />,
                        badge: "PDF Hash",
                      },
                      {
                        id: 2,
                        step: "02",
                        title: "Scan QR Code",
                        description:
                          "Click 'Start Camera Scan' and hold the certificate QR code up to your camera. The scanner immediately extracts and validates the credential.",
                        icon: <QrCode size={18} />,
                        badge: "Live QR",
                      },
                      {
                        id: 3,
                        step: "03",
                        title: "Decentralized Audit",
                        description:
                          "The smart contract on Polygon verifies the digital signature, creation timestamp, and issuing authority without third-party intermediaries.",
                        icon: <ShieldCheck size={18} />,
                        badge: "On-Chain",
                      },
                      {
                        id: 4,
                        step: "04",
                        title: "Tamper-Proof Results",
                        description:
                          "Instantly view verified student details, issuing body, grade, and blockchain transaction receipt on PolygonScan.",
                        icon: <Lock size={18} />,
                        badge: "Verified",
                      },
                    ]}
                    baseWidth={360}
                    autoplay={true}
                    autoplayDelay={3500}
                    pauseOnHover={true}
                    loop={true}
                    round={false}
                  />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--lp-border)] flex justify-end">
                <Button
                  type="button"
                  onClick={() => setIsHowItWorksOpen(false)}
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 font-bold cursor-pointer rounded-xl transition-all shadow-md"
                >
                  Got it, close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Verify;
