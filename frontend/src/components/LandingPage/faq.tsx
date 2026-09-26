import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const faqData = [
  {
    question: "How does blockchain verification work?",
    answer: "When a certificate is issued, a unique cryptographic hash (SHA-256) of the document is generated and stored on the immutable blockchain ledger. During verification, our engine recalculates the hash of the presented document and compares it to the blockchain record. If they match exactly, the certificate is authentic. Even a tiny change of a single character in the certificate changes the hash completely, exposing any tampering."
  },
  {
    question: "Do verifiers need to create an account?",
    answer: "No, verifiers (such as employers, HR departments, or university registrars) do not need to register or create an account. They can instantly verify any credential by scanning the QR code on the certificate or pasting the verification URL/hash directly into our public verification portal."
  },
  {
    question: "Which blockchain networks do you support?",
    answer: "Authentix currently anchors cryptographic hashes to the Polygon blockchain network for maximum decentralization and security. We also support compatible EVM networks and private permissioned networks (like Hyperledger Fabric) for enterprise and institutional clients with high-frequency issuing needs."
  },
  {
    question: "Can I fully customize the certificate design?",
    answer: "Yes, absolutely! The Authentix platform includes a visual drag-and-drop template designer. You can upload custom background images, incorporate university logos and signature seals, choose typography styles, and insert dynamic fields (like Student Name, Course, Issue Date) that automatically populate upon issuance."
  },
  {
    question: "Is there a limit on certificates I can issue?",
    answer: "There are no hard limits on the number of certificates you can issue. Our scalable batch processing engine can anchor thousands of credentials simultaneously. We offer flexible tiers tailored to both small institutions and global universities with high-volume requirements."
  }
];

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 sm:py-24 bg-transparent border-t border-[var(--lp-border)] relative z-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--lp-foreground)] mb-4">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg text-slate-400">
            Quick answers to how Authentix secures your institutional credentials.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-white/[0.02] rounded-2xl overflow-hidden border transition-all duration-300 ${
                  isOpen
                    ? "border-[var(--lp-accent)]/50 shadow-lg shadow-[var(--lp-accent)]/5"
                    : "border-[var(--lp-border)] hover:border-slate-700"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex justify-between items-center text-left focus:outline-hidden cursor-pointer"
                >
                  <span className={`text-base sm:text-lg font-semibold transition-colors ${
                    isOpen ? "text-[var(--lp-accent)]" : "text-[var(--lp-foreground)]"
                  }`}>
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <Minus className="w-5 h-5 text-[var(--lp-accent)] shrink-0" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="px-6 pb-6 text-sm sm:text-base text-slate-400 leading-relaxed border-t border-[var(--lp-border)] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Faq;
