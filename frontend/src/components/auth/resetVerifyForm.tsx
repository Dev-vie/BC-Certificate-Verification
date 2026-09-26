import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { AuthLeftPanel } from "./AuthLeftPanel";
import {
  Eye,
  EyeOff,
  BadgeCheck,
  Loader2,
  AlertCircle,
  KeyRound,
} from "lucide-react";

const ResetVerifyForm: React.FC = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (!/^\d+$/.test(pastedData)) return;

    const digits = pastedData.slice(0, 6).split("");
    const newOtp = [...otp];
    digits.forEach((digit, idx) => {
      newOtp[idx] = digit;
      if (inputRefs.current[idx]) {
        inputRefs.current[idx]!.value = digit;
      }
    });
    setOtp(newOtp);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }
    if (!newPassword) {
      setError("Please enter a new password.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => {
        navigate("/auth/login");
      }, 1200);
    } catch {
      setError("Failed to reset password. Code may be invalid.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-stretch justify-center bg-transparent text-white select-none p-2 sm:p-4">

      <AuthLeftPanel
        title="Secure Password Reset"
        subtitle="Establish a strong, cryptographic security key for your institution workspace."
        backLink="/auth/login"
        backText="Back to login"
      />

      <div className="w-full lg:w-[42%] flex flex-col justify-center p-6 sm:p-10 md:p-14 relative bg-slate-900/80 backdrop-blur-2xl text-white overflow-hidden my-4 sm:m-4 rounded-3xl shadow-2xl shadow-blue-950/40 select-none border border-white/15">
        <div className="max-w-md w-full mx-auto relative z-10">
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30 shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Set new password
            </h1>
            <p className="text-slate-300 text-sm mt-2">
              Enter the 6-digit code sent to your email and set your new password.
            </p>
          </div>

          <div className="relative">
            {success && (
              <div className="absolute inset-0 bg-blue-600/95 backdrop-blur-md text-white flex flex-col items-center justify-center z-20 p-6 text-center rounded-2xl animate-fade-in shadow-xl">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4"
                >
                  <BadgeCheck className="w-10 h-10 text-white stroke-[2.5]" />
                </motion.div>
                <h3 className="text-xl font-bold">Password Reset!</h3>
                <p className="text-blue-100 text-sm mt-2 max-w-xs">
                  Your password has been updated. Redirecting to login...
                </p>
              </div>
            )}

            {error && (
              <div className="mb-5 bg-red-950/40 border border-red-500/40 text-red-300 rounded-xl p-3.5 text-sm flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2">
                  Verification Code
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-12 h-14 text-center text-xl font-bold rounded-xl border border-white/15 bg-slate-950/60 hover:border-white/25 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all text-white shadow-sm"
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full px-4 py-3.5 pr-12 rounded-xl border border-white/15 bg-slate-950/60 hover:border-white/25 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all text-white placeholder:text-slate-400 text-sm shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none p-1 transition cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3.5 rounded-xl border border-white/15 bg-slate-950/60 hover:border-white/25 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all text-white placeholder:text-slate-400 text-sm shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 active:scale-[0.99] transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Resetting password...</span>
                  </>
                ) : (
                  <span>Reset Password</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetVerifyForm;
