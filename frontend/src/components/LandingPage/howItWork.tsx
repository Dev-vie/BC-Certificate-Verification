import { motion } from 'motion/react';

export function HowItWork() {
  const steps = [
    {
      step: "01",
      title: "Design a Template",
      description: "Upload your background, add your logo and position fields using the visual editor."
    },
    {
      step: "02",
      title: "Issue a Certificate",
      description: "Select a template, fill in student details, and issue in one click."
    },
    {
      step: "03",
      title: "Blockchain Anchoring",
      description: "A SHA-256 hash of the certificate is automatically stored on the blockchain."
    },
    {
      step: "04",
      title: "Share & Verify",
      description: "Recipient gets a QR code and link. Anyone can verify authenticity instantly."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-transparent border-t border-[var(--lp-border)] relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 sm:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--lp-foreground)] mb-4">
            How it works
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
            Issue tamper-proof credentials in four steps.
          </p>
        </motion.div>

        {/* Stepper Workflow with Connecting Line */}
        <div className="relative">
          <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-[var(--lp-border)] z-0" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative z-10">
            {steps.map((stepItem, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: index * 0.12 }}
                className="flex flex-col items-center text-center group"
              >
                <div className="w-16 h-16 rounded-full bg-[var(--lp-primary)] text-white flex items-center justify-center font-extrabold text-xl mb-6 shadow-lg shadow-[var(--lp-primary)]/20 border-4 border-[var(--lp-background)] group-hover:scale-110 group-hover:bg-[var(--lp-accent)] transition-all duration-300">
                  {stepItem.step}
                </div>
                <h3 className="text-lg font-bold text-[var(--lp-foreground)] mb-2 group-hover:text-[var(--lp-accent)] transition-colors">
                  {stepItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed px-4">
                  {stepItem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWork;
