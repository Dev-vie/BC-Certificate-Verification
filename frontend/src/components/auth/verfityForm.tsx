import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Loader2,
  AlertCircle,
  Mail,
  RotateCw,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { verifyEmail as verifyEmailThunk } from "../../redux/features/auth/authSlice";
import { AuthLeftPanel } from "./AuthLeftPanel";

const VerifyForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string } | null)?.email;

  const {
    loading: isLoading,
    error: authError,
    verifyEmail,
    clearError,
  } = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isResending, setIsResending] = useState(false);
  const [formError, setFormError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const error = formError || authError;

  React.useEffect(() => {
    if (!email) {
      setFormError("No email found to verify. Please register again.");
    }
  }, [email]);

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
    if (digits.length < 6) {
      inputRefs.current[digits.length]?.focus();
    } else {
      inputRefs.current[5]?.blur();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    clearError();

    if (!email) {
      setFormError("No email found to verify. Please register again.");
      return;
    }

    const code = otp.join("");
    if (code.length < 6) {
      setFormError("Please enter the complete 6-digit verification code.");
      return;
    }

    const result = await verifyEmail({ email, code });

    if (verifyEmailThunk.fulfilled.match(result)) {
      navigate("/dashboard");
    }
    // on rejection, authError from useAuth() already holds the backend
    // message (e.g. "Invalid or expired code") and renders below.
  };

  const handleResendCode = async () => {
    setFormError("");
    setIsResending(true);
    try {

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setOtp(Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch {
      setFormError("Failed to resend code. Please try again later.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-stretch justify-center bg-transparent text-slate-900 select-none p-2 sm:p-4">

      <AuthLeftPanel
        title="Secure Verification"
        subtitle="Enter the authorization code sent to your inbox to activate your institution workspace."
        backLink="/auth/login"
        backText="Back to login"
      />

      <div className="w-full lg:w-[42%] flex flex-col justify-center p-6 sm:p-10 md:p-14 relative bg-slate-900/80 backdrop-blur-2xl text-white overflow-hidden my-4 sm:m-4 rounded-3xl shadow-2xl shadow-blue-950/40 select-none border border-white/15">

        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full mx-auto relative z-10">
          <div className="mb-7">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/30 shadow-sm">
              <Mail className="w-6 h-6" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Check your email
            </h1>
            <p className="text-slate-300 text-sm mt-2 font-medium">
              We have sent a 6-digit verification code to{" "}
              {email ? (
                <span className="font-bold text-blue-400 underline underline-offset-2">{email}</span>
              ) : (
                "your email address"
              )}
              .
            </p>
          </div>

          <div className="relative">
            {error && (
              <div className="mb-5 bg-red-950/40 border border-red-500/40 text-red-300 rounded-xl p-3.5 text-sm flex items-start gap-3 shadow-sm">
                <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 active:scale-[0.99] transition-all cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify Email</span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-xs text-slate-300 font-medium">
              Didn&apos;t receive the code?{" "}
              <button
                type="button"
                onClick={handleResendCode}
                disabled={isResending}
                className="font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2 transition inline-flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {isResending ? (
                  <>
                    <RotateCw className="w-3 h-3 animate-spin" />
                    <span>Resending...</span>
                  </>
                ) : (
                  <span>Click to resend</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyForm;
