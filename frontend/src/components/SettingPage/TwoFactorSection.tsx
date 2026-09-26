import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { X, Loader2 } from 'lucide-react';
import { authAPI } from '../../redux/features/auth/authAPI';

interface TwoFactorSectionProps {
  onToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

const TwoFactorSection: React.FC<TwoFactorSectionProps> = ({ onToast }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [tfaCode, setTfaCode] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [secretFormatted, setSecretFormatted] = useState<string | null>(null);
  const [secretRaw, setSecretRaw] = useState<string | null>(null);
  const [loadingQr, setLoadingQr] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    authAPI
      .get2faStatus()
      .then((res) => {
        if (active) setIs2faEnabled(res.is2faEnabled);
      })
      .catch((err) => console.error('Failed to load 2FA status:', err));
    return () => {
      active = false;
    };
  }, []);

  const handleOpenModal = async () => {
    setIsModalOpen(true);
    if (!is2faEnabled) {
      setLoadingQr(true);
      try {
        const setupRes = await authAPI.setup2fa();
        setQrCodeUrl(setupRes.qrCodeUrl);
        setSecretFormatted(setupRes.secretFormatted);
        setSecretRaw(setupRes.secret);
      } catch (err: any) {
        onToast(err.response?.data?.message || 'Failed to initialize 2FA QR code', 'error');
      } finally {
        setLoadingQr(false);
      }
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tfaCode.length !== 6 || isNaN(Number(tfaCode))) {
      onToast('Invalid verification code. Enter a 6-digit number.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (!is2faEnabled) {

        const res = await authAPI.enable2fa({
          code: tfaCode,
          secret: secretRaw || undefined,
        });
        setIs2faEnabled(true);
        setIsModalOpen(false);
        setTfaCode('');
        onToast(res.message || 'Two-factor auth successfully enabled!', 'success');
      } else {

        const res = await authAPI.disable2fa({ code: tfaCode });
        setIs2faEnabled(false);
        setIsModalOpen(false);
        setTfaCode('');
        onToast(res.message || 'Two-factor auth disabled', 'success');
      }
    } catch (err: any) {
      onToast(
        err.response?.data?.message || 'Invalid 6-digit code. Please check your authenticator app.',
        'error'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTfaCode('');
  };

  return (
    <>

      <div className="flex items-center justify-between py-1.5">
        <div className="space-y-0.5">
          <p className="text-[13px] font-semibold text-foreground">Two-factor authentication</p>
          <p className="text-[11px] text-muted-foreground">
            {is2faEnabled
              ? 'Two-factor authentication is currently active on this account.'
              : 'Add an extra layer of security by requiring access to your phone when you log in.'}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleOpenModal}
          className={
            is2faEnabled
              ? 'text-rose-600 hover:text-rose-700 hover:bg-rose-500/10 border-rose-200 dark:border-rose-900/50'
              : 'border-border text-foreground hover:bg-accent'
          }
        >
          {is2faEnabled ? 'Disable 2FA' : 'Enable authentication'}
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
              <h3 className="text-sm font-bold text-foreground">
                {is2faEnabled ? 'Disable Two-Factor Auth' : 'Setup Two-Factor Auth'}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                {is2faEnabled
                  ? 'Confirm cancellation of mobile authorization protection by entering your authenticator code.'
                  : 'Scan the QR code with your authenticator app (Google Authenticator, Duo, Authy).'}
              </p>
            </div>
            <form onSubmit={handleVerify} className="space-y-4">
              {!is2faEnabled && (
                <div className="flex flex-col items-center gap-3 p-4 bg-muted border border-border rounded-xl">
                  {loadingQr ? (
                    <div className="w-[140px] h-[140px] flex flex-col items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="text-xs">Generating QR...</span>
                    </div>
                  ) : qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="Authenticator QR Code"
                      className="w-[140px] h-[140px] bg-white p-1.5 rounded-lg border border-border shadow-xs"
                    />
                  ) : (
                    <div className="w-[140px] h-[140px] flex items-center justify-center text-xs text-rose-500">
                      Failed to load QR code
                    </div>
                  )}
                  {secretFormatted && (
                    <p className="text-[10px] text-muted-foreground font-mono text-center select-all">
                      Key: <span className="font-bold text-foreground">{secretFormatted}</span>
                    </p>
                  )}
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  {is2faEnabled ? 'Enter verification code' : 'Enter 6-digit authenticator code'}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={tfaCode}
                  onChange={(e) => setTfaCode(e.target.value)}
                  className="w-full h-9 px-3 text-center tracking-[0.25em] text-sm font-semibold text-foreground bg-background border border-border rounded-lg outline-none focus:border-primary"
                  placeholder="000000"
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
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className={is2faEnabled ? 'bg-rose-600 hover:bg-rose-700 text-white' : 'bg-primary hover:bg-primary/90 text-primary-foreground'}
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : is2faEnabled ? (
                    'Verify & Disable'
                  ) : (
                    'Verify & Enable'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default TwoFactorSection;
