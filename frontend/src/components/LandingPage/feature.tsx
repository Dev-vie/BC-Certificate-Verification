import {
  Shield,
  QrCode,
  Globe,
  Zap,
  Database,
  GraduationCap
} from 'lucide-react';
import { motion } from 'motion/react';

export function Feature() {
  const features = [
    {
      icon: Shield,
      title: "Tamper-Proof Security",
      description: "SHA-256 cryptographic hashing ensures every certificate is permanent, immutable and fraud-resistant."
    },
    {
      icon: QrCode,
      title: "Instant QR Verification",
      description: "Anyone can verify credentials in seconds by scanning a QR code — no account needed."
    },
    {
      icon: Globe,
      title: "Universal Access",
      description: "Verification link works worldwide, 24/7, without any special software or plugins."
    },
    {
      icon: Zap,
      title: "Rapid Issuance",
      description: "Issue hundreds of certificates per hour using pre-built templates and a streamlined workflow."
    },
    {
      icon: Database,
      title: "Immutable Records",
      description: "Once anchored, blockchain records are permanent. No rewriting, no deleting, no tampering."
    },
    {
      icon: GraduationCap,
      title: "Built for Education",
      description: "Designed specifically for universities, licensing providers, and professional certification bodies."
    }
  ];

  return (
    <section id="features" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--lp-primary)]/10 border border-[var(--lp-primary)]/20 text-[var(--lp-primary)] text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            <Shield className="w-4 h-4" /> Why Choose VeriCert
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6">
            Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Credential Issuance</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            A complete suite for educational institutions to issue, manage, and cryptographically verify digital certificates.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(180px,auto)]">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            
            // Bento Box sizing logic
            let spanClass = "col-span-1";
            let bgStyle = "bg-slate-900/40";
            
            if (idx === 0) {
              // Tamper-Proof Security (Large Hero Feature)
              spanClass = "md:col-span-2 lg:col-span-2 lg:row-span-2";
              bgStyle = "bg-gradient-to-br from-blue-900/40 via-slate-900/60 to-slate-900/40";
            } else if (idx === 1) {
              // Instant QR (Wide Feature)
              spanClass = "md:col-span-1 lg:col-span-2";
            } else if (idx === 4) {
              // Immutable Records (Wide Feature)
              spanClass = "md:col-span-2 lg:col-span-2";
            } else if (idx === 5) {
              spanClass = "md:col-span-1 lg:col-span-2";
            }

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: idx * 0.08, ease: "easeOut" }}
                className={`relative overflow-hidden border border-white/10 p-8 rounded-3xl shadow-xl hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group ${spanClass} ${bgStyle} backdrop-blur-xl`}
              >
                {/* Decorative background glow on hover */}
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-32 h-32 bg-[var(--lp-primary)]/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex flex-col h-full justify-between relative z-10">
                  <div className="flex justify-between items-start">
                    <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-[var(--lp-accent)] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--lp-primary)] group-hover:text-white transition-all duration-300 shadow-inner ${idx === 0 ? 'w-16 h-16 mb-8' : ''}`}>
                      <Icon className={idx === 0 ? 'w-8 h-8' : 'w-6 h-6'} />
                    </div>
                    
                    {idx === 0 && (
                      <div className="hidden sm:flex flex-col items-end opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="font-mono text-xs text-blue-400/80 bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-500/20 mb-2">
                          0x4f8b...e9a2
                        </div>
                        <div className="font-mono text-xs text-blue-400/50 bg-blue-900/10 px-3 py-1.5 rounded-lg border border-blue-500/10 mb-2 mr-4">
                          0x7c2d...1f5e
                        </div>
                        <div className="font-mono text-xs text-blue-400/30 bg-blue-900/5 px-3 py-1.5 rounded-lg border border-blue-500/5 mr-8">
                          0x9a1b...d4c3
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Decorative background element specifically for the first card */}
                  {idx === 0 && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
                      <div className="w-[120%] h-[120%] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxwYXRoIGQ9Ik0wIDIwaDQwTTIwIDB2NDAiIHN0cm9rZT0icmdiYSg1OSwgMTMwLCAyNDYsIDAuMDcpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] opacity-50 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-1000 ease-out" style={{ backgroundSize: '40px 40px' }} />
                      <div className="absolute w-48 h-48 border border-blue-500/20 rounded-full group-hover:border-blue-500/40 group-hover:scale-110 transition-all duration-700" />
                      <div className="absolute w-64 h-64 border border-blue-500/10 rounded-full group-hover:border-blue-500/20 group-hover:scale-105 transition-all duration-1000" />
                    </div>
                  )}

                  <div className="relative z-10">
                    <h3 className={`font-black text-white mb-3 group-hover:text-[var(--lp-accent)] transition-colors ${idx === 0 ? 'text-3xl' : 'text-xl'}`}>
                      {feature.title}
                    </h3>
                    <p className={`text-slate-400 leading-relaxed font-medium ${idx === 0 ? 'text-base max-w-md' : 'text-sm'}`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Feature;
