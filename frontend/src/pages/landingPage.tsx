import { Header } from '../components/LandingPage/header';
import { Hero } from '../components/LandingPage/hero';
import { StatsBar } from '../components/LandingPage/statsBar';
import { Feature } from '../components/LandingPage/feature';
import { HowItWork } from '../components/LandingPage/howItWork';
import { Faq } from '../components/LandingPage/faq';
import { Subscription } from '../components/LandingPage/subscription';
import { Verify } from '../components/LandingPage/verify';
import { Footer } from '../components/LandingPage/footer';

function LandingPage() {
  return (
    <div
      style={{
        '--lp-background': '#0f172a',
        '--lp-foreground': '#f8fafc',
        '--lp-muted': '#94a3b8',
        '--lp-primary': '#3b82f6',
        '--lp-secondary': 'rgba(59, 130, 246, 0.15)',
        '--lp-accent': '#60a5fa',
        '--lp-border': 'rgba(255, 255, 255, 0.1)',
        '--font-sans': '"Inter", system-ui, -apple-system, sans-serif',
        fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      } as React.CSSProperties}
      className="relative min-h-screen text-[var(--lp-foreground)] font-sans selection:bg-[var(--lp-primary)] selection:text-white overflow-x-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900"
    >

      {/* Subtle background glow spots */}
      <div className="fixed inset-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[var(--lp-primary)]/[0.08] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--lp-accent)]/[0.05] rounded-full blur-[100px] pointer-events-none" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle, var(--lp-border) 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div className="relative z-10">
        <Header />
        <Hero />
        <StatsBar />
        <Feature />
        <HowItWork />
        <Verify />
        <Faq />
        <Subscription />
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;

