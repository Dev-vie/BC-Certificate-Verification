import React, { useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface EmailSectionProps {
  currentEmail: string;
  onEmailChange: (newEmail: string) => void;
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const EmailSection: React.FC<EmailSectionProps> = ({ currentEmail, onEmailChange, onToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.includes('@')) {
      onToast('Please enter a valid email address', 'error');
      return;
    }
    if (!password) {
      onToast('Password verification is required', 'error');
      return;
    }
    onEmailChange(newEmail);
    setIsModalOpen(false);
    setNewEmail('');
    setPassword('');
    onToast('Login email address updated successfully!', 'success');
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setNewEmail('');
    setPassword('');
  };

  return (
    <>
      {/* Email Row */}
      <div className="flex items-center justify-between py-1.5 border-b border-border pb-4">
        <div className="space-y-0.5">
          <p className="text-[13px] font-semibold text-foreground">Email address</p>
          <p className="text-[11px] text-muted-foreground">Change your Front login email address (currently: {currentEmail})</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="border-border text-foreground hover:bg-accent"
        >
          Change email
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
              <h3 className="text-sm font-bold text-foreground">Change login email</h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Enter your new email address and verify your password.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  New email address
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full h-9 px-3 text-xs text-foreground bg-background border border-border rounded-lg outline-none focus:border-primary"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Current password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
                  Update email
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EmailSection;
