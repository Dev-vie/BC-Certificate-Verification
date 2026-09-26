import React from "react";
import {
  X,
  FileText,
  MousePointerClick,
  QrCode,
  Sparkles,
  CheckCircle2,
  Lightbulb,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";

interface TemplateHowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TemplateHowItWorksModal: React.FC<TemplateHowItWorksModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col text-left transition-colors duration-200 my-8"
        >

          <div className="flex items-start justify-between p-6 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3D876C]/10 text-[#3D876C] flex items-center justify-center border border-[#3D876C]/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  How Template Creation Works
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Follow these simple steps to upload and customize your certificate templates
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">

            <div className="p-4 rounded-xl border border-border bg-background flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#3D876C]/10 text-[#3D876C] flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <FileText className="w-4 h-4 text-[#3D876C]" />
                  <span>Prepare Your PDF Certificate Design</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Design your blank certificate background in Canva, Figma, Illustrator, or Word. Leave empty spaces for dynamic variables (e.g., student name, issue date, grade, and QR code). Export it as a <strong>single-page PDF document (max 20MB)</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#3D876C]/10 text-[#3D876C] flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <MousePointerClick className="w-4 h-4 text-[#3D876C]" />
                  <span>Upload & Name Your Template</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click <strong>"New Template"</strong> or drop your PDF into the upload area. Enter a descriptive title (e.g., <em>"Cybersecurity Bootcamp Certificate"</em>) and click <strong>"Upload Template"</strong>.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#3D876C]/10 text-[#3D876C] flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                3
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <QrCode className="w-4 h-4 text-[#3D876C]" />
                  <span>Drag & Drop Dynamic Placeholders</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Inside the visual template editor, drag placeholders (Recipient Name, Course, Issue Date, Certificate ID, and QR Code) to your desired canvas positions. Customize font style, size, color, and alignment in the styling panel.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-background flex gap-3.5">
              <div className="w-8 h-8 rounded-full bg-[#3D876C]/10 text-[#3D876C] flex items-center justify-center text-sm font-bold shrink-0 mt-0.5">
                4
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                  <Sparkles className="w-4 h-4 text-[#3D876C]" />
                  <span>Save & Issue On Blockchain</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Click <strong>"Save Template"</strong>. You can now use this template to issue verified single or batch certificates with tamper-proof cryptographic hashes recorded directly on-chain.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-500/10 border border-[#3D876C]/30 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[#3D876C] shrink-0 mt-0.5" />
              <div className="text-xs text-foreground space-y-1">
                <span className="font-bold text-[#3D876C] block">Pro Tip:</span>
                <span className="text-muted-foreground leading-relaxed block">
                  Ensure the PDF is in landscape (or portrait) orientation matching your desired output. You can preview exactly how recipient data fills the placeholders before issuing certificates!
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-border flex justify-end bg-muted/10">
            <Button
              type="button"
              onClick={onClose}
              className="bg-[#3D876C] hover:bg-[#2C6450] text-white px-6 font-semibold cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Got it, let's start
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TemplateHowItWorksModal;
