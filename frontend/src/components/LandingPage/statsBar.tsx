import { motion } from 'motion/react';
import { Award, Building2, Activity } from 'lucide-react';
import Shuffle from '../ui/trustpilotshuffle';

export function StatsBar() {
  return (
    <section className="relative py-20 text-[var(--lp-foreground)] bg-transparent">
      {/* Background ambient glow behind the stats card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/3 h-32 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden border border-white/[0.08] rounded-3xl bg-[#090d16]/60 backdrop-blur-xl py-4 px-6 sm:px-12 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-8 sm:gap-0 items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
        >
          {/* Subtle inside gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-blue-500/15 via-transparent to-sky-500/15 opacity-40 pointer-events-none" />

          {/* Stat 1 */}
          <div className="flex flex-col items-center justify-center text-center p-4 group transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4 p-3 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:scale-110 group-hover:bg-blue-500/20 group-hover:text-blue-300 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex justify-center items-center min-h-[2.5rem] tracking-tight group-hover:text-blue-300 transition-colors duration-300">
              <Shuffle
                text="12,400+"
                shuffleDirection="up"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                triggerOnHover
                respectReducedMotion={true}
                loop={false}
                loopDelay={0}
              />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
              Certificates Issued
            </div>
          </div>

          {/* Divider 1 */}
          <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />

          {/* Stat 2 */}
          <div className="flex flex-col items-center justify-center text-center p-4 group transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4 p-3 rounded-2xl bg-sky-500/10 text-sky-400 group-hover:scale-110 group-hover:bg-sky-500/20 group-hover:text-sky-300 transition-all duration-300 shadow-[0_0_15px_rgba(14,165,233,0.1)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex justify-center items-center min-h-[2.5rem] tracking-tight group-hover:text-sky-300 transition-colors duration-300">
              <Shuffle
                text="340+"
                shuffleDirection="up"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                triggerOnHover
                respectReducedMotion={true}
                loop={false}
                loopDelay={0}
              />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
              Institutions
            </div>
          </div>

          {/* Divider 2 */}
          <div className="hidden sm:block w-px h-16 bg-gradient-to-b from-transparent via-white/[0.08] to-transparent" />

          {/* Stat 3 */}
          <div className="flex flex-col items-center justify-center text-center p-4 group transition-all duration-300 hover:-translate-y-1">
            <div className="mb-4 p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:text-cyan-300 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <Activity className="w-5 h-5" />
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2 flex justify-center items-center min-h-[2.5rem] tracking-tight group-hover:text-cyan-300 transition-colors duration-300">
              <Shuffle
                text="99.9%"
                shuffleDirection="up"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                threshold={0.1}
                triggerOnce={true}
                triggerOnHover
                respectReducedMotion={true}
                loop={false}
                loopDelay={0}
              />
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors duration-300">
              Uptime SLA
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default StatsBar;
