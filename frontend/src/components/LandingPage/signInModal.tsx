import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Shield, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs"
      />

      <div className="z-10 flex flex-col items-center gap-6 max-w-md w-full">

        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--lp-primary)] shadow-lg shadow-[var(--lp-accent)]/20">
            <Shield className="w-5.5 h-5.5 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[var(--lp-foreground)] drop-shadow-sm">
            VeriCert
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full bg-[#111622] rounded-3xl p-8 shadow-2xl border border-[var(--lp-border)] overflow-hidden flex flex-col items-center text-center"
        >

          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-2xl font-bold text-white tracking-tight mt-4 mb-3 max-w-[280px]">
            Sign in to access your dashboard
          </h3>
          <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-xs">
            You need to be signed in to issue and manage certificates.
          </p>

          <button
            onClick={() => {
              onClose();
              navigate('/auth/login');
            }}
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-white font-semibold text-sm bg-[var(--lp-primary)] hover:bg-[var(--lp-primary)]/90 active:scale-98 shadow-lg shadow-[var(--lp-primary)]/10 hover:shadow-xl hover:shadow-[var(--lp-primary)]/20 transition-all cursor-pointer"
          >
            <span>Sign in to continue</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SignInModal;
