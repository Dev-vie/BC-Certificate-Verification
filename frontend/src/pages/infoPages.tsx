import { useState } from 'react';
import Header from '../components/LandingPage/header';
import Footer from '../components/LandingPage/footer';
import { ShaderBackground } from '../components/LandingPage/ShaderBackground';
import { Button } from '../components/ui/button';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden flex flex-col justify-between">

      <div className="fixed inset-0 w-full h-full -z-10">
        <ShaderBackground />
      </div>

      <Header theme="dark" />

      <main className="flex-1 max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10 w-full">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-3.5 mb-8 border-b border-white/10 pb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
              <p className="text-xs text-slate-400 mt-1">Last Updated: July 20, 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
            <p className="leading-relaxed">
              At VeriCert, we take your privacy and data security seriously. This Privacy Policy describes how we collect, use, and protect information when you use our blockchain-based certificate verification services.
            </p>

            <h2 className="text-lg font-bold text-white pt-4 border-t border-white/10">1. Information We Collect</h2>
            <p className="leading-relaxed">
              We collect information necessary to issue, store, and verify digital credentials. This includes institutional email addresses, administrative names, template configurations, and public key identifiers. We do not store raw personal identity information on the blockchain; only cryptographic hashes are permanently recorded.
            </p>

            <h2 className="text-lg font-bold text-white pt-4 border-t border-white/10">2. How We Use Information</h2>
            <ul className="list-disc pl-5 space-y-2 leading-relaxed text-slate-300">
              <li>To provide, maintain, and verify institutional credentials.</li>
              <li>To manage administrative access logs for audit transparency.</li>
              <li>To monitor systems security and prevent fraudulent credential issuance.</li>
            </ul>

            <h2 className="text-lg font-bold text-white pt-4 border-t border-white/10">3. Blockchain Ledger Immutability</h2>
            <p className="leading-relaxed">
              Certificates issued through VeriCert are anchored on public or consortium blockchain ledgers. These cryptographic ledger records (containing verification hashes, dates, and issuer signatures) are permanent, public, and cannot be deleted or modified. This design guarantees credentials cannot be falsified.
            </p>

            <h2 className="text-lg font-bold text-white pt-4 border-t border-white/10">4. Contact Information</h2>
            <p className="leading-relaxed">
              If you have any questions or concerns regarding this policy, please reach out to us via our Contact Page.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden flex flex-col justify-between">

      <div className="fixed inset-0 w-full h-full -z-10">
        <ShaderBackground />
      </div>

      <Header theme="dark" />

      <main className="flex-1 max-w-4xl mx-auto px-6 pt-32 pb-20 relative z-10 w-full">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-2xl p-8 md:p-12 shadow-2xl">
          <div className="flex items-center gap-3.5 mb-8 border-b border-white/10 pb-6">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Service</h1>
              <p className="text-xs text-slate-400 mt-1">Last Updated: July 20, 2026</p>
            </div>
          </div>

          <div className="space-y-6 text-slate-300 text-sm md:text-base leading-relaxed">
            <p className="leading-relaxed">
              Welcome to VeriCert. By accessing or using our blockchain certificate verification platform, you agree to comply with and be bound by the following Terms of Service.
            </p>

            <h2 className="text-lg font-bold text-white pt-4 border-t border-white/10">1. Acceptable Use Policy</h2>
            <p className="leading-relaxed">
              You agree to use VeriCert only for authenticating and verifying legitimate educational credentials. Issuing false, misleading, or unauthorized credentials will result in immediate termination of institutional access and may be reported to relevant legal authorities.
            </p>

            <h2 className="text-lg font-bold text-white pt-4 border-t border-white/10">2. Institutional Responsibility</h2>
            <p className="leading-relaxed">
              Partner institutions are solely responsible for ensuring the accuracy of student data and verifying the identity of administrative accounts authorized to sign and anchor certificates.
            </p>

            <h2 className="text-lg font-bold text-white pt-4 border-t border-white/10">3. Platform Availability & Fees</h2>
            <p className="leading-relaxed">
              While we strive for 99.9% uptime, we are not liable for transient network disruptions, blockchain ledger congestion, or gas fee fluctuations that could impact transaction anchoring times.
            </p>

            <h2 className="text-lg font-bold text-white pt-4 border-t border-white/10">4. Modifications to Terms</h2>
            <p className="leading-relaxed">
              We reserve the right to modify these terms at any time. Your continued use of the platform constitutes acceptance of revised terms.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden flex flex-col justify-between">

      <div className="fixed inset-0 w-full h-full -z-10">
        <ShaderBackground />
      </div>

      <Header theme="dark" />

      <main className="flex-1 max-w-5xl mx-auto px-6 pt-32 pb-20 relative z-10 w-full">
        <div className="grid md:grid-cols-12 gap-8 items-stretch">

          <div className="md:col-span-5 bg-slate-950/90 backdrop-blur-xl border border-white/15 text-white rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden select-none">
            <div className="absolute top-[-20%] left-[-20%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] pointer-events-none" />

            <div className="z-10">
              <h2 className="text-2xl font-extrabold tracking-tight text-white">Contact Information</h2>
              <p className="text-slate-300 text-xs mt-2 leading-relaxed">
                Have questions about enterprise integrations or institutional deployment? Fill out the form and our team will respond within 24 hours.
              </p>

              <div className="mt-10 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Email Support</p>
                    <p className="text-sm font-semibold mt-0.5 text-white">support@vericert.edu</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Institutional Helpline</p>
                    <p className="text-sm font-semibold mt-0.5 text-white">+1 (800) 555-CERT</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Headquarters</p>
                    <p className="text-sm font-semibold mt-0.5 text-white">Silicon Valley, CA, USA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6 mt-12 z-10">
              <p className="text-xs text-slate-400">VeriCert Verification Systems</p>
            </div>
          </div>

          <div className="md:col-span-7 bg-slate-900/80 backdrop-blur-xl border border-white/15 rounded-2xl p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            {submitted ? (
              <div className="flex-grow flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 shadow-lg flex items-center justify-center mb-5 animate-bounce">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Transmitted</h3>
                <p className="text-slate-300 text-sm max-w-sm mx-auto mt-2 leading-relaxed">
                  Thank you for reaching out, {formData.name}. We have logged your request and will contact you shortly at {formData.email}.
                </p>
                <Button variant="outline" className="mt-6 border-white/15 text-slate-200 hover:bg-white/10" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', message: '' }); }}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Send a Message</h3>
                  <p className="text-xs text-slate-400 mt-1">Connect with our system engineers and integration experts.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 block">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Smith"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-10 px-3.5 text-xs text-white bg-slate-950/80 border border-white/15 rounded-xl outline-hidden focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 block">Institutional Email</label>
                    <input
                      type="email"
                      required
                      placeholder="jsmith@university.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full h-10 px-3.5 text-xs text-white bg-slate-950/80 border border-white/15 rounded-xl outline-hidden focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-500"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1.5 block">Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tell us about your organization and credentials verification requirements..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-3.5 text-xs text-white bg-slate-950/80 border border-white/15 rounded-xl outline-hidden focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder-slate-500 resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 active:scale-[0.99] transition-all cursor-pointer"
                >
                  {loading ? 'Transmitting...' : 'Send Message'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
