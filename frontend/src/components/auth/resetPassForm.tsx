import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Key,
  Eye,
  EyeOff,
  Lock,
  ArrowLeft,
  Loader2,
  AlertCircle,
  BadgeCheck
} from 'lucide-react';

const ResetPassForm: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newPassword) {
      setError('Please enter a new password.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (!confirmPassword) {
      setError('Please confirm your new password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuccess(true);
      setTimeout(() => {
        navigate('/auth/login');
      }, 1500);
    } catch {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between bg-transparent text-white p-6 relative overflow-hidden select-none">

      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] rounded-full bg-teal-400/10 blur-[120px] pointer-events-none" />

      <div className="flex items-center gap-2.5 z-10 pt-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-md shadow-emerald-600/20">
          <Lock className="w-4.5 h-4.5 text-white" />
        </div>
        <span className="font-bold text-lg text-white tracking-tight">
          Authentix
        </span>
      </div>

      <div className="my-auto max-w-md w-full mx-auto z-10">

        <div className="bg-slate-900/80 border border-white/15 backdrop-blur-2xl rounded-3xl p-6 sm:p-10 shadow-2xl shadow-emerald-950/40 relative overflow-hidden flex flex-col items-center text-white">

          {success ? (
            <div className="absolute inset-0 bg-emerald-600/95 backdrop-blur-md text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in z-20">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-4"
              >
                <BadgeCheck className="w-10 h-10 text-white stroke-[2.5]" />
              </motion.div>
              <h3 className="text-xl font-bold">Password Reset Success</h3>
              <p className="text-emerald-100 text-sm mt-2 max-w-xs leading-relaxed">
                Your credentials have been successfully updated. Redirecting you to login...
              </p>
            </div>
          ) : null}

          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-5 shadow-sm shrink-0">
            <Key className="w-7 h-7 text-emerald-400 stroke-[2]" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight text-center">
            Set new password
          </h1>
          <p className="text-slate-300 text-sm mt-2 mb-8 text-center leading-relaxed max-w-xs">
            Enter your new password below
          </p>

          {error && (
            <div className="w-full mb-5 bg-red-950/40 border border-red-500/40 text-red-300 rounded-xl p-3.5 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span className="font-medium leading-relaxed">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">

            <div>
              <label className="text-[11px] font-bold text-slate-300 tracking-wider uppercase mb-1.5 block">
                New Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-white/15 bg-slate-950/60 hover:border-white/25 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition-all text-white placeholder:text-slate-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none p-1 rounded transition cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 tracking-wider uppercase mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border border-white/15 bg-slate-950/60 hover:border-white/25 focus:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-500 transition-all text-white placeholder:text-slate-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white focus:outline-none p-1 rounded transition cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-[0.99] transition-all cursor-pointer select-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Resetting...</span>
                </>
              ) : (
                <span>Confirm</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/10 text-center w-full">
            <Link
              to="/auth/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-300 hover:text-emerald-400 transition duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to the login screen</span>
            </Link>
          </div>

        </div>
      </div>

      <div className="w-full max-w-md mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-xs border-t border-white/10 pt-6 pb-4">
        <div className="flex items-center gap-1.5 font-medium">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>AES-256 Bit Encryption</span>
        </div>
        <span className="font-mono">Authentix Security</span>
      </div>

    </div>
  );
};

export default ResetPassForm;
