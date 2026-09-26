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
    <section id="how-it-works" className="py-24 bg-transparent relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--lp-primary)]/10 border border-[var(--lp-primary)]/20 text-[var(--lp-primary)] text-xs font-bold uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(59,130,246,0.15)]">
            Workflow
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-6">
            Four Steps to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-500">Certainty</span>
          </h2>
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
            Issue tamper-proof credentials with a seamless workflow.
          </p>
        </motion.div>

        {/* Interactive Vertical Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* Main Vertical Connecting Line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[var(--lp-primary)]/0 via-[var(--lp-primary)]/40 to-[var(--lp-primary)]/0 -translate-x-1/2 hidden md:block" />
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-white/10 -translate-x-1/2 md:hidden" />

          <div className="space-y-16 sm:space-y-24 relative z-10">
            {steps.map((stepItem, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, x: isEven ? -20 : 20 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: index * 0.1, type: "spring", stiffness: 50 }}
                  className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 group ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Content Box */}
                  <div className={`w-full md:w-1/2 flex ${isEven ? 'md:justify-end' : 'md:justify-start'}`}>
                    <div className="bg-slate-900/60 border border-white/10 p-8 rounded-3xl shadow-xl hover:border-[var(--lp-primary)]/40 hover:shadow-2xl hover:shadow-[var(--lp-primary)]/15 transition-all duration-300 backdrop-blur-xl w-full max-w-md relative overflow-hidden group-hover:-translate-y-2">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--lp-accent)]/10 rounded-full blur-[40px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="text-[var(--lp-primary)] text-6xl font-black opacity-20 absolute -bottom-4 -right-4 select-none">
                        {stepItem.step}
                      </div>

                      <h3 className="text-2xl font-black text-white mb-3 relative z-10">
                        {stepItem.title}
                      </h3>
                      <p className="text-slate-400 leading-relaxed font-medium relative z-10">
                        {stepItem.description}
                      </p>
                    </div>
                  </div>

                  {/* Central Node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-950 border-4 border-slate-900 flex items-center justify-center shadow-lg group-hover:scale-125 transition-transform duration-500 z-20">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--lp-primary)] to-[var(--lp-accent)] shadow-[0_0_15px_var(--lp-primary)] group-hover:shadow-[0_0_25px_var(--lp-primary)] transition-shadow duration-500" />
                  </div>

                  {/* Image/Visual Box Placeholder */}
                  <div className={`hidden md:flex w-full md:w-1/2 ${isEven ? 'md:justify-start' : 'md:justify-end'} opacity-0 md:opacity-100`}>
                    <div className="w-full max-w-xs h-32 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-slate-600 font-bold uppercase tracking-widest text-xs">Visual Component</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWork;
