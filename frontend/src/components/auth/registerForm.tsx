import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { registerInstitution } from "../../redux/features/auth/authSlice";
import { AuthLeftPanel } from "./AuthLeftPanel";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    loading: isLoading,
    error: authError,
    register,
    clearError,
  } = useAuth();

  const [institutionName, setInstitutionName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [formError, setFormError] = useState("");

  const error = formError || authError;

  const [, setTxHash] = useState(
    "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  );

  useEffect(() => {
    if (!institutionName && !email) {
      const timer = setTimeout(() => {
        setTxHash("0x71C7656EC7ab88b098defB751B7401B5f6d8976F");
      }, 0);
      return () => clearTimeout(timer);
    }

    let iterations = 0;
    const chars = "0123456789ABCDEFabcdef";
    const targetHash =
      "0x" +
      Array.from({ length: 40 }, (_, i) => {
        const combined = institutionName + email;
        if (combined.length === 0) return "f";
        const charIndex =
          (combined.charCodeAt(i % combined.length) + i) % chars.length;
        return chars[charIndex];
      }).join("");

    const interval = setInterval(() => {
      setTxHash(() => {
        return (
          "0x" +
          Array.from({ length: 40 }, (_, i) => {
            if (i < iterations) {
              return targetHash[i + 2];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("")
        );
      });

      iterations += 4;
      if (iterations >= 40) {
        clearInterval(interval);
        setTxHash(targetHash);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [institutionName, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    clearError();

    if (!institutionName.trim()) {
      setFormError("Please enter your institution name.");
      return;
    }
    if (!email.trim()) {
      setFormError("Please enter your email.");
      return;
    }
    if (!password) {
      setFormError("Please enter a secure password.");
      return;
    }
    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (!agreeTerms) {
      setFormError("You must agree to the Terms & Conditions.");
      return;
    }

    const result = await register({
      name: institutionName,
      email,
      password,
      confirmPassword,
    });

    if (registerInstitution.fulfilled.match(result)) {
      navigate("/auth/pending-approval", { state: { email } });
    }
    // on rejection, `authError` from useAuth() already holds the message
    // and will render in the error banner below — nothing else to do here.
  };

  return (
    <div className="min-h-screen w-full flex items-stretch justify-center bg-transparent text-slate-900 select-none p-2 sm:p-4">

      <AuthLeftPanel
        title="Create Institution Workspace"
        subtitle="Join VeriCert to establish your decentralized identity, issue tamper-proof certificates, and automate credential verification."
        backLink="/"
        backText="Back to website"
      />

      <div className="w-full lg:w-[42%] flex flex-col justify-center p-6 sm:p-10 md:p-14 relative bg-slate-900/80 backdrop-blur-2xl text-white overflow-hidden my-4 sm:m-4 rounded-3xl shadow-2xl shadow-emerald-950/40 select-none border border-white/15">

        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full mx-auto relative z-10">

          <div className="mb-7">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Create an account
            </h1>
            <p className="text-slate-300 text-sm mt-2 font-medium">
              Already have an account?{" "}
              <Link
                to="/auth/login"
                className="font-bold text-emerald-400 hover:text-emerald-300 underline underline-offset-2 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-950/40 border border-red-500/40 text-red-300 rounded-xl p-3.5 text-sm flex items-start gap-3 shadow-sm">
              <AlertCircle className="w-4.5 h-4.5 text-red-400 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="Institution Name"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/60 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 hover:border-white/25 transition-all font-medium shadow-sm"
              />
            </div>

            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/60 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 hover:border-white/25 transition-all font-medium shadow-sm"
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-950/60 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 hover:border-white/25 transition-all font-medium shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-950/60 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 hover:border-white/25 transition-all font-medium shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition cursor-pointer p-1"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="terms"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer shrink-0"
              />
              <label htmlFor="terms" className="text-xs text-slate-300 cursor-pointer select-none font-medium">
                I agree to the{" "}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="font-bold text-emerald-400 underline underline-offset-2 hover:text-emerald-300 transition-colors cursor-pointer bg-transparent border-0 p-0 inline-block align-baseline"
                >
                  Terms & Conditions
                </button>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-[0.99] transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create account</span>
              )}
            </button>
          </form>


        </div>
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-white/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-left">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Terms &amp; Conditions</h3>
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer text-xl font-bold bg-transparent border-0 p-1"
              >
                &times;
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-4 text-slate-300 text-xs leading-relaxed max-h-[50vh]">
              <p className="font-semibold text-white">Last updated: August 28, 2026</p>
              
              <p>Welcome to VeriCert. By creating an account or using our blockchain certificate verification system, you agree to comply with and be bound by the following terms of service:</p>

              <div>
                <h4 className="font-bold text-white mb-1">1. Issuer Responsibility</h4>
                <p>Institutions are solely responsible for the accuracy, validity, and legitimacy of all academic credentials, certificates, and student records uploaded, generated, or issued through the VeriCert platform.</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1 font-sans">2. Blockchain Immutability</h4>
                <p>You acknowledge and agree that certificate hashes anchored on the public blockchain are permanent, public, and immutable. Once written to the ledger, this data cannot be modified, deleted, or erased. Revocations must be performed explicitly using the smart contract functions provided in your workspace.</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1">3. Workspace &amp; Key Security</h4>
                <p>You are entirely responsible for maintaining the confidentiality of your account credentials, passwords, API keys, and multi-factor authentication (2FA) tokens. VeriCert is not liable for any losses arising from security breaches on your end.</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1 font-sans">4. Acceptable Use Policy</h4>
                <p>You agree not to upload fraudulent data, impersonate other educational institutions, bypass subscription constraints, or deploy malicious scripts. Violation of these terms will result in immediate termination of your workspace.</p>
              </div>

              <div>
                <h4 className="font-bold text-white mb-1 font-sans">5. Limitation of Liability</h4>
                <p>VeriCert provides decentralized credential infrastructure "as is" and holds no liability for network outages, blockchain transaction delays, gas fee fluctuations, or validating decisions made by third parties.</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTermsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
