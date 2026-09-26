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
    <section id="features" className="py-20 sm:py-24 bg-transparent border-t border-[var(--lp-border)] relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--lp-foreground)] mb-4">
            Everything you need to issue trusted credentials
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            A complete certificate management platform from design to verification.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="bg-white/[0.02] border border-[var(--lp-border)] p-8 rounded-2xl shadow-xl hover:-translate-y-1.5 hover:border-[var(--lp-primary)]/50 hover:shadow-[var(--lp-primary)]/10 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--lp-accent)]/10 text-[var(--lp-accent)] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[var(--lp-accent)]/20 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[var(--lp-foreground)] mb-3 group-hover:text-[var(--lp-accent)] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Feature;
