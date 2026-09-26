import { Link, useLocation, useNavigate } from "react-router-dom";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.76 4.07 1.13.97 2.63 1.49 4.13 1.5v3.66c-1.84.05-3.64-.53-5.07-1.69-.17-.13-.33-.27-.49-.41v7.6c-.05 2.24-.97 4.41-2.67 5.86-1.92 1.62-4.63 2.19-7.06 1.48C4.6 21.36 2.66 18.72 2.67 15.8c-.08-2.6 1.63-5.06 4.14-5.83 1.41-.44 2.94-.31 4.26.37v3.7c-.86-.53-1.92-.66-2.88-.34-1.12.35-1.95 1.43-1.93 2.61.02 1.34 1.12 2.49 2.47 2.47 1.25.04 2.37-.87 2.51-2.12.06-.51.04-1.03.04-1.55v-15c.01-.02.01-.03.01-.05z" />
    </svg>
  );
}

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/home#features" },
      { label: "Verify Portal", href: "/home#verify" },
      { label: "How It Works", href: "/home#how-it-works" },
      { label: "FAQ", href: "/home#faq" },
      { label: "Subscription Plans", href: "/home#pricing" },
      { label: "Newsletter", href: "/home#newsletter" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/home#features" },
      { label: "Contact Us", href: "mailto:support@authentix.com" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

const socialLinks = [
  { icon: FacebookIcon, href: "#", label: "Facebook" },
  { icon: InstagramIcon, href: "#", label: "Instagram" },
  { icon: TiktokIcon, href: "#", label: "TikTok" },
];

export function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("/home#")) {
      e.preventDefault();
      const id = href.replace("/home#", "");
      if (location.pathname !== "/home") {
        navigate("/home");
        setTimeout(() => {
          const element = document.getElementById(id);
          if (element) {
            const headerOffset = 80;
            const targetPosition =
              element.getBoundingClientRect().top +
              window.scrollY -
              headerOffset;
            window.scrollTo({ top: targetPosition, behavior: "smooth" });
          }
        }, 100);
      } else {
        const element = document.getElementById(id);
        if (element) {
          const headerOffset = 80;
          const targetPosition =
            element.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: targetPosition, behavior: "smooth" });
        }
      }
    }
  };

  return (
    <footer className="w-full bg-[var(--lp-background)] border-t border-[var(--lp-border)] relative z-10">
      {/* Top Section: Logo + Link Columns */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-8">
          {/* Brand Column */}
          <div className="md:col-span-2">
            <Link
              to="/home"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer mb-4"
            >
              <img
                src="/logo.png"
                alt="Authentix Logo"
                className="w-12 h-12 object-contain"
              />
              <span className="font-bold text-[var(--lp-foreground)] text-2xl tracking-tight">
                Authenti<span className="text-[#3D876C]">x</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Blockchain-powered certificate verification platform built for
              educational institutions that demand absolute trust.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-sm text-slate-400 hover:text-[var(--lp-primary)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12">
        <div className="border-t border-[var(--lp-border)]" />
      </div>

      {/* Bottom Section: Social + Copyright */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-8">
        <div className="flex flex-col items-center gap-5">
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-full border border-[var(--lp-border)] flex items-center justify-center text-slate-400 hover:text-[var(--lp-primary)] hover:border-[var(--lp-primary)]/40 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Authentix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
