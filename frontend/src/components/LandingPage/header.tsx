import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../ui/button";
import { useAuth } from "../../hooks/useAuth";

const navLinks = [
  { href: "#features", id: "features", label: "Features" },
  { href: "#how-it-works", id: "how-it-works", label: "How It Works" },
  { href: "#verify", id: "verify", label: "Verify Certificate" },
  { href: "#faq", id: "faq", label: "FAQ" },
  { href: "#pricing", id: "pricing", label: "Subscription" },
  { href: "#newsletter", id: "newsletter", label: "Newsletter" },
];

export function Header({
  theme: _theme = "dark",
}: {
  theme?: "light" | "dark";
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("features");

  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const token = localStorage.getItem("token");
  const isAuthStorage = localStorage.getItem("isAuthenticated") === "true";
  const { isAuthenticated: isAuthRedux } = useAuth();
  const isAuthenticated = isAuthStorage || Boolean(token) || isAuthRedux;
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 40);

      if (isClickScrollingRef.current) return;

      const focalPoint = 200;
      let currentSectionId = "";

      for (const link of navLinks) {
        let el = document.getElementById(link.id);
        if (!el && link.id === "verify") {
          el = document.getElementById("verify-portal");
        }
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalPoint && rect.bottom >= focalPoint) {
            currentSectionId = link.id;
            break;
          }
        }
      }

      if (
        !currentSectionId &&
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 60
      ) {
        currentSectionId = "faq";
      }

      if (currentSectionId && currentSectionId !== activeTab) {
        setActiveTab(currentSectionId);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  const handleSmoothScroll = (href: string, id: string) => {
    setActiveTab(id);
    isClickScrollingRef.current = true;

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (location.pathname !== "/home") {
      window.location.href = `/home${href}`;
      return;
    }

    const targetId = href.replace("#", "");
    let target = document.getElementById(targetId);
    if (!target && targetId === "verify") {
      target = document.getElementById("verify-portal");
    }

    if (target) {
      const headerOffset = 80;
      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }

    clickTimeoutRef.current = setTimeout(() => {
      isClickScrollingRef.current = false;
    }, 850);
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed left-0 right-0 mx-auto transition-all duration-500 ease-out z-50 flex justify-center ${
        isScroll
          ? "top-4 w-[calc(100%-2rem)] max-w-6xl rounded-2xl border border-[var(--lp-border)] bg-[var(--lp-background)]/80 backdrop-blur-md py-3 px-6 md:px-6 shadow-xl shadow-[var(--lp-primary)]/15"
          : "top-0 w-full max-w-full rounded-none bg-transparent backdrop-blur-none py-6 px-6 md:px-12 shadow-none"
      }`}
    >
      <div className="w-full flex items-center justify-between max-w-7xl">
        <Link
          to="/home"
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <img
            src="/logo.png"
            alt="VeriCert Logo"
            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform"
          />
          <span className="font-bold text-[var(--lp-foreground)] text-xl tracking-tight">
            Veri<span className="text-[#3D876C]">Cert</span>
          </span>
        </Link>

        {/* Right Side: Navigation Links + Auth / CTA */}
        <div className="hidden md:flex items-center gap-10 relative">
          {/* Navigation Links */}
          <div className="flex items-center gap-8 relative">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleSmoothScroll(link.href, link.id)}
                  className={`relative py-1 text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? "text-[var(--lp-primary)] font-semibold"
                      : "text-slate-400 hover:text-[var(--lp-foreground)]"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--lp-primary)] rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                      }}
                    />
                  )}
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Auth / CTA */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 shrink-0">
              <Link to="/dashboard">
                <Button
                  variant="default"
                  size="md"
                  className="flex items-center gap-2 cursor-pointer bg-[var(--lp-primary)] hover:bg-[var(--lp-primary)]/90 text-white text-xs font-semibold shadow-md shadow-black/30 rounded-xl px-5 py-2 transition-all hover:scale-105"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-4 shrink-0">
              <Link
                to="/auth/login"
                className="text-xs font-semibold text-slate-400 hover:text-[var(--lp-foreground)] transition-colors px-4 py-2 rounded-full"
              >
                Login
              </Link>
              <Link to="/auth/register">
                <Button
                  variant="default"
                  size="md"
                  className="bg-[var(--lp-primary)] hover:bg-[var(--lp-primary)]/90 text-white text-xs font-semibold px-5 py-2 rounded-full shadow-md shadow-[var(--lp-primary)]/30 transition-all hover:scale-105 cursor-pointer"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-400 hover:text-[var(--lp-foreground)] rounded-lg focus:outline-hidden cursor-pointer"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full left-4 right-4 mt-2 md:hidden border border-[var(--lp-border)] bg-[var(--lp-background)]/95 backdrop-blur-2xl p-6 rounded-2xl space-y-3 shadow-2xl text-[var(--lp-foreground)]"
          >
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => {
                  handleSmoothScroll(link.href, link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left text-sm font-semibold py-2.5 px-3.5 rounded-xl transition-colors cursor-pointer ${
                  activeTab === link.id
                    ? "text-[var(--lp-primary)] bg-[var(--lp-secondary)] border border-[var(--lp-primary)]/20"
                    : "text-slate-400 hover:text-[var(--lp-foreground)] hover:bg-white/5"
                }`}
              >
                {link.label}
              </button>
            ))}

            {isAuthenticated ? (
              <div className="pt-4 border-t border-[var(--lp-border)] flex flex-col gap-3">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant="default"
                    size="md"
                    className="w-full flex items-center justify-center gap-2 bg-[var(--lp-primary)] hover:bg-[var(--lp-primary)]/90 text-white py-2.5 rounded-xl"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-[var(--lp-border)] flex flex-col gap-3">
                <Link
                  to="/auth/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 text-xs font-semibold text-slate-400 hover:text-[var(--lp-foreground)] border border-[var(--lp-border)] rounded-xl bg-white/5"
                >
                  Login
                </Link>
                <Link
                  to="/auth/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant="default"
                    size="md"
                    className="w-full bg-[var(--lp-primary)] hover:bg-[var(--lp-primary)]/90 text-white py-2.5 rounded-xl text-xs"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export default Header;
