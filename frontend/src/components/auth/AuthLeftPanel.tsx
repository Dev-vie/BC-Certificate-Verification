import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export interface StepItem {
  step: number;
  label: string;
  description?: string;
}

export interface AuthLeftPanelProps {
  title?: string;
  subtitle?: string;
  backLink?: string;
  backText?: string;
  steps?: StepItem[];
  activeStep?: number;
}

export const AuthLeftPanel: React.FC<AuthLeftPanelProps> = ({
  title = "Get Started with Us",
  subtitle = "Complete these easy steps to register your account & start verifying certificates.",
  backLink = "/",
  backText = "Back to website",
}) => {
  return (
    <div className="relative hidden lg:flex lg:w-[58%] flex-col justify-between p-6 sm:p-10 xl:p-12 text-white overflow-hidden my-4 select-none">

      <div className="absolute top-1/3 -left-20 w-[400px] h-[400px] rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[350px] h-[350px] rounded-full bg-teal-500/10 blur-[100px] pointer-events-none" />

      {/* Top Section: Back button on top left */}
      <div className="flex items-center justify-start z-10 w-full mb-6">
        <Link
          to={backLink}
          className="flex items-center gap-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-200 hover:scale-105 shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {backText}
        </Link>
      </div>

      {/* Center Section: Big static Logo + Title + Description */}
      <div className="z-10 my-auto py-8 w-full max-w-xl flex flex-col items-center text-center mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-center gap-4 sm:gap-5 select-none">
          <img
            src="/logo.png"
            alt="VeriCert Logo"
            className="w-20 h-20 md:w-26 md:h-26 object-contain drop-shadow-[0_8px_24px_rgba(61,135,108,0.2)] hover:scale-105 transition-transform duration-300"
          />
          <span className="text-4xl md:text-5xl font-black tracking-widest text-white uppercase">
            VERI<span className="text-[#3D876C]">CERT</span>
          </span>
        </div>

        <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-tight mt-10">
          {title}
        </h2>

        <p className="mt-4 text-slate-300/90 text-sm sm:text-base leading-relaxed max-w-md font-medium">
          {subtitle}
        </p>
      </div>
    </div>
  );
};
