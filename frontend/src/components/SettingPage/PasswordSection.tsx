import React, { useState } from 'react';
import { Button } from '../ui/button';
import { X, Eye, EyeOff } from 'lucide-react';

interface PasswordSectionProps {
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const PasswordSection: React.FC<PasswordSectionProps> = ({ onToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [showPasswordRaw, setShowPasswordRaw] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      onToast('All password fields are required', 'error');
      return;
    }
    if (passwords.new !== passwords.confirm) {
      onToast('New password confirmation does not match', 'error');
      return;
    }
    if (passwords.new.length < 8) {
      onToast('New password must be at least 8 characters long', 'error');
      return;
    }
    setIsModalOpen(false);
    setPasswords({ current: '', new: '', confirm: '' });
    onToast('Password successfully changed!', 'success');
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setPasswords({ current: '', new: '', confirm: '' });
    setShowPasswordRaw(false);
  };

  return (
    <>
      {/* Password Row */}
      <div className="flex items-center justify-between py-1.5 border-b border-border pb-4">
        <div className="space-y-0.5">
          <p className="text-[13px] font-semibold text-foreground">Password</p>
          <p className="text-[11px] text-muted-foreground">Set a unique password to protect your Front account</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="border-border text-foreground hover:bg-accent"
        >
          Change password
        </Button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/40 backdrop-blur-xs">
          <div className="bg-card rounded-2xl border border-border w-full max-w-sm p-6 shadow-xl relative animate-in zoom-in-95 duration-150 text-foreground">
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X size={16} />
            </button>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-foreground">Change password</h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Enter your current credentials to change your security credentials.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Current password
                </label>
                <div className="relative">
                  <input
                    type={showPasswordRaw ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={(e) => setPasswords((prev) => ({ ...prev, current: e.target.value }))}
                    className="w-full h-9 pl-3 pr-10 text-xs text-foreground bg-background border border-border rounded-lg outline-none focus:border-primary"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordRaw(!showPasswordRaw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPasswordRaw ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  New password
                </label>
                <input
                  type="password"
                  value={passwords.new}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, new: e.target.value }))}
                  className="w-full h-9 px-3 text-xs text-foreground bg-background border border-border rounded-lg outline-none focus:border-primary"
                  placeholder="Min 8 characters"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Confirm new password
                </label>
                <input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((prev) => ({ ...prev, confirm: e.target.value }))}
                  className="w-full h-9 px-3 text-xs text-foreground bg-background border border-border rounded-lg outline-none focus:border-primary"
                  placeholder="••••••••"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClose}
                  className="border-border text-foreground hover:bg-accent"
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm">
                  Update password
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PasswordSection;
