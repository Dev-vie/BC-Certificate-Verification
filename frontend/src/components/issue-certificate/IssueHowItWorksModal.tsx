import React from "react";
import {
  X,
  FileCheck2,
  Users,
  Lock,
  MailCheck,
  CheckCircle2,
  Lightbulb,
  Layers,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import Carousel, { type CarouselItemData } from "../ui/Carousel";

interface IssueHowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IssueHowItWorksModal: React.FC<IssueHowItWorksModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const carouselSteps: CarouselItemData[] = [
    {
      id: 1,
      step: "01",
      title: "Select Template",
      description:
        "Choose the pre-configured certificate design template for this issuance. Switch or preview designs at any time.",
      icon: <Layers size={18} />,
      badge: "Template",
    },
    {
      id: 2,
      step: "02",
      title: "Single or Bulk CSV",
      description:
        "Issue an individual certificate in the form, or upload a CSV spreadsheet to batch generate hundreds of certificates at once.",
      icon: <Users size={18} />,
      badge: "Issuance",
    },
    {
      id: 3,
      step: "03",
      title: "Blockchain Anchoring",
      description:
        "The system generates the official certificate PDF, calculates its SHA-256 hash, and securely anchors it on Polygon testnet.",
      icon: <Lock size={18} />,
      badge: "Security",
    },
    {
      id: 4,
      step: "04",
      title: "Automated Email Delivery",
      description:
        "Students automatically receive their tamper-proof PDF with an embedded verification QR code for employers to check instantly.",
      icon: <MailCheck size={18} />,
      badge: "Delivery",
    },
  ];

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
          className="relative w-full max-w-xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left transition-colors duration-200 my-8"
        >

          <div className="flex items-start justify-between p-6 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#3D876C]/10 text-[#3D876C] flex items-center justify-center border border-[#3D876C]/20">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  Certificate Issuance Guide
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Learn how to issue individual or bulk blockchain-verified credentials
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

          <div className="p-6 space-y-5">
            <div className="flex justify-center">
              <Carousel
                items={carouselSteps}
                baseWidth={360}
                autoplay={true}
                autoplayDelay={3500}
                pauseOnHover={true}
                loop={true}
                round={false}
              />
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-[#3D876C]/30 flex items-start gap-3">
              <Lightbulb className="w-4 h-4 text-[#3D876C] shrink-0 mt-0.5" />
              <div className="text-xs text-foreground">
                <span className="font-bold text-[#3D876C] inline">Bulk CSV Tip: </span>
                <span className="text-muted-foreground leading-relaxed">
                  Download our sample CSV template from the bulk tab to format your student recipient rows accurately.
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 border-t border-border flex justify-end bg-muted/10">
            <Button
              type="button"
              onClick={onClose}
              className="bg-[#3D876C] hover:bg-[#2C6450] text-white px-6 font-semibold cursor-pointer rounded-xl"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Got it, let's issue
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IssueHowItWorksModal;
