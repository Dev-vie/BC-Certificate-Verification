import React, { useState } from "react";
import { AuthLeftPanel } from "./AuthLeftPanel";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { login as loginThunk } from "../../redux/features/auth/authSlice";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { loading: isLoading, error: authError, login, clearError } = useAuth();

  const [email, setEmail] = useState("admin@vericert.edu");
  const [password, setPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState("");

  const error = formError || authError;



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    clearError();

    if (!email.trim()) {
      setFormError("Please enter your email address.");
      return;
    }
    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    const result = await login({ email, password });

    if (loginThunk.fulfilled.match(result)) {
      navigate("/dashboard");
    }
    // on rejection, authError from useAuth() already holds the backend
    // message (e.g. "Invalid email or password") and renders below.
  };

  return (
    <div className="min-h-screen w-full flex items-stretch justify-center bg-transparent text-slate-900 select-none p-2 sm:p-4">

      <AuthLeftPanel
        title="Welcome Back"
        subtitle="Access your workspace to issue, manage, and verify blockchain-secured credentials with absolute integrity."
        backLink="/"
        backText="Back to website"
      />

      <div className="w-full lg:w-[42%] flex flex-col justify-center p-6 sm:p-10 md:p-14 relative bg-slate-900/80 backdrop-blur-2xl text-white overflow-hidden my-4 sm:m-4 rounded-3xl shadow-2xl shadow-blue-950/40 select-none border border-white/15">

        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

        <div className="max-w-md w-full mx-auto relative z-10">

          <div className="mb-7">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Sign in to account
            </h1>
            <p className="text-slate-300 text-sm mt-2 font-medium">
              Don&apos;t have an account?{" "}
              <Link
                to="/auth/register"
                className="font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                Register
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
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/60 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 hover:border-white/25 transition-all font-medium shadow-sm"
              />
            </div>

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-slate-950/60 border border-white/15 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 hover:border-white/25 transition-all font-medium shadow-sm"
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

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded accent-blue-500 cursor-pointer shrink-0"
                />
                <label htmlFor="rememberMe" className="text-xs text-slate-300 cursor-pointer select-none font-medium">
                  Remember me
                </label>
              </div>
              <Link
                to="/auth/forgot-pass"
                className="text-xs font-bold text-blue-400 hover:text-blue-300 underline underline-offset-2 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 active:scale-[0.99] transition-all cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Log in</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
