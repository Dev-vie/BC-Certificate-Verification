import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  BadgeCheck,
  Loader2,
  AlertCircle,
  KeyRound,
} from "lucide-react";
import { AuthLeftPanel } from "./AuthLeftPanel";

const ForgotPassForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        navigate("/auth/reset-verify");
      }, 1500);
    } catch {
      setError("System error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-stretch justify-center bg-transparent text-slate-900 select-none p-2 sm:p-4">

      <AuthLeftPanel
        title="Recover Access"
        subtitle="Verify your registered email address to securely restore access to your credentials vault."
        backLink="/auth/login"
        backText="Back to login"
      />

      <div className="w-full lg:w-[42%] flex flex-col justify-center p-6 sm:p-10 md:p-14 relative bg-slate-900/80 backdrop-blur-2xl text-white overflow-hidden my-4 sm:m-4 rounded-3xl shadow-2xl shadow-emerald-950/40 select-none border border-white/15">

        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full mx-auto relative z-10">

          <div className="mb-7">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/30 shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Reset your password
            </h1>
            <p className="text-slate-300 text-sm mt-2 font-medium">
              Remembered your password?{" "}
              <Link
                to="/auth/login"
                className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>

          <div className="relative">
            {success && (
              <div className="absolute inset-0 bg-emerald-600/95 backdrop-blur-md text-white flex flex-col items-center justify-center z-20 p-6 text-center rounded-2xl animate-fade-in shadow-xl">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4"
                >
                  <BadgeCheck className="w-10 h-10 text-white stroke-[2.5]" />
                </motion.div>
                <h3 className="text-xl font-bold">Instruction Sent</h3>
                <p className="text-emerald-100 text-sm mt-2 max-w-xs">
                  A verification code has been sent to <strong>{email}</strong>
                </p>
              </div>
            )}

            {error && (
              <div className="mb-5 bg-red-950/40 border border-red-500/40 text-red-300 rounded-xl p-3.5 text-sm flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950/60 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 hover:border-white/25 transition-all font-medium shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-[0.99] transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Sending code...</span>
                  </>
                ) : (
                  <span>Send Verification Code</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassForm;
