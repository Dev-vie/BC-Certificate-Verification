import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { AuthLeftPanel } from "../../components/auth/AuthLeftPanel";

const PendingApprovalPage: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex items-stretch justify-center bg-transparent text-slate-900 select-none p-2 sm:p-4">
      <AuthLeftPanel
        title="Pending Approval"
        subtitle="Your registration has been submitted and is currently being reviewed by the admin."
        backLink="/"
        backText="Back to website"
        activeStep={2}
      />

      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-10 md:p-14 relative bg-slate-900/80 backdrop-blur-2xl text-white overflow-hidden my-4 sm:m-4 rounded-3xl shadow-2xl shadow-blue-950/40 select-none border border-white/15">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full mx-auto relative z-10 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#3b82f6]/10 border border-[#3b82f6]/30 flex items-center justify-center text-[#3b82f6] mb-6 animate-bounce">
            <CheckCircle className="w-8 h-8" />
          </div>

          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Registration Submitted
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed mb-8">
            Thank you for registering your institution with VeriCert. Your account request is currently pending review by the system administrator. 
            <br /><br />
            An email notification will be sent to your registered address once the administrator has approved or rejected your application.
          </p>

          <Link
            to="/auth/login"
            className="w-full inline-flex items-center justify-center bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-3 px-6 rounded-xl transition-all cursor-pointer shadow-md"
          >
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PendingApprovalPage;
