import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import { Button } from '../ui/button';
import { SignInModal } from './signInModal';
import heroImage from '../../assets/Adobe Express - file-cropped.png';
import certificateBackImage from '../../assets/Adobe Express - file (1).png';

export function Hero() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  // 3D Tilt motion state values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Map mouse coordinate relative to card center to degree tilt values (-12 to 12 degrees)
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-12, 12]);

  // Spring transition config for buttery smooth response
  const springConfig = { damping: 25, stiffness: 180 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    // Calculate normalized position relative to center (-0.5 to 0.5)
    const relativeX = (event.clientX - rect.left - width / 2) / width;
    const relativeY = (event.clientY - rect.top - height / 2) / height;
    mouseX.set(relativeX);
    mouseY.set(relativeY);
  };

  const handleMouseLeave = () => {
    // Return card to neutral level state
    mouseX.set(0);
    mouseY.set(0);
  };

  const handleIssueCertificateClick = () => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setIsModalOpen(true);
    }
  };

  const handleVerifyClick = () => {
    const verifySection = document.getElementById('verify') || document.getElementById('verify-portal');
    if (verifySection) {
      const headerOffset = 80;
      const targetPosition = verifySection.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-44 pb-24 overflow-hidden text-[var(--lp-foreground)] bg-transparent">
      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-12 w-full">
        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-start text-left"
          >
            {/* Powered by Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--lp-accent)]/20 bg-[var(--lp-secondary)] mb-10">
              <span className="w-2 h-2 rounded-full bg-[var(--lp-accent)] animate-pulse" />
              <span className="text-xs font-semibold text-[var(--lp-primary)] tracking-wide uppercase">
                Powered by Polygon Blockchain
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[58px] lg:leading-[1.15] font-bold tracking-tight text-[var(--lp-foreground)] mb-8">
              Secure Blockchain <br />
              <span className="text-[var(--lp-accent)]">Certificate Verification</span>
            </h1>

            <p className="text-base sm:text-lg text-[var(--lp-muted)] max-w-lg mb-12 leading-relaxed">
              Issue, store, and verify digital certificates with tamper-proof blockchain technology. Built for educational institutions that demand absolute trust.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-start w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                onClick={handleIssueCertificateClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[var(--lp-primary)] hover:bg-[var(--lp-primary)]/90 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-[var(--lp-primary)]/20 cursor-pointer"
              >
                <Award className="w-5 h-5" /> Issue a Certificate
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleVerifyClick}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-transparent border border-[var(--lp-border)] hover:bg-[var(--lp-primary)]/8 hover:border-[var(--lp-primary)]/40 hover:text-[var(--lp-primary)] text-[var(--lp-foreground)] font-semibold px-8 py-4 rounded-xl transition-all cursor-pointer group"
              >
                Verify Certificate <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Dynamic Animated Card (Continuous Float + 3D Mouse Tilt + Flip) */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:flex flex-col items-center justify-end w-full relative gap-6"
          >
            {/* Continuous Float Wrapper */}
            <motion.div
              animate={{
                y: [0, -12, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-full"
            >
              {/* 3D Tilt, Hover and Click Flip Card */}
              <motion.div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsFlipped(!isFlipped)}
                whileHover={{ scale: 1.025 }}
                transition={{ duration: 0.3 }}
                style={{
                  transformStyle: "preserve-3d",
                  perspective: "1000px",
                  rotateX: springRotateX,
                  rotateY: springRotateY,
                }}
                className="relative w-full max-w-xl mx-auto cursor-pointer group"
              >
                {/* Large soft backdrop shape that tilts with the card */}
                <div
                  className="absolute right-[-10%] top-[10%] w-[120%] h-[120%] bg-radial from-[var(--lp-accent)]/10 via-[var(--lp-primary)]/3 to-transparent rounded-full filter blur-3xl -z-10 transition-colors duration-300 group-hover:from-[var(--lp-accent)]/20"
                  style={{
                    transform: "translateZ(-40px)",
                  }}
                />

                {/* 3D Flip Card Container */}
                <motion.div
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  style={{ transformStyle: "preserve-3d" }}
                  className="relative w-full"
                >
                  {/* Front Side */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "translateZ(30px)",
                    }}
                    className="relative w-full h-full"
                  >
                    <img
                      src={heroImage}
                      alt="Authentix Secure Credentials Portal - Front"
                      className="w-full h-auto object-contain select-none pointer-events-none shadow-orbit-hover"
                    />
                  </div>

                  {/* Back Side */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg) translateZ(30px)",
                    }}
                    className="absolute inset-0 w-full h-full"
                  >
                    <img
                      src={certificateBackImage}
                      alt="Authentix Secure Credentials Portal - Back"
                      className="w-full h-auto object-contain select-none pointer-events-none shadow-orbit-hover"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </AnimatePresence>
    </section>
  );
}

export default Hero;
