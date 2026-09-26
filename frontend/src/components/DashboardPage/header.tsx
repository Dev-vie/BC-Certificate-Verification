import React, { useState, useEffect, useRef } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronDown, LogOut, Settings } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export interface BreadcrumbObject {
  parent?: string;
  current?: string;
}

interface HeaderProps {

  breadcrumb?: string[] | BreadcrumbObject;
}

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/templates": "Templates",
  "/issue-certificate": "Issue Certificate",
  "/certificates": "Certificates",
  "/settings": "Settings",
};

const SUBROUTE_LABELS: Record<string, string> = {
  certificates: "Certificate Detail",
  templates: "Template Detail",
};

function deriveBreadcrumb(pathname: string): string[] {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return [];

  const rootPath = `/${segments[0]}`;
  const rootLabel = ROUTE_LABELS[rootPath];
  if (!rootLabel) return [];

  if (segments.length === 1) {
    return [rootLabel];
  }

  const subLabel = SUBROUTE_LABELS[segments[0]] ?? "Details";
  return [rootLabel, subLabel];
}

function normalizeBreadcrumbs(
  breadcrumb: HeaderProps["breadcrumb"],
  pathname: string,
): string[] {
  if (Array.isArray(breadcrumb)) {
    return breadcrumb;
  }
  if (breadcrumb && typeof breadcrumb === "object") {
    const list: string[] = [];
    if (breadcrumb.parent) list.push(breadcrumb.parent);
    if (breadcrumb.current) list.push(breadcrumb.current);
    return list;
  }
  return deriveBreadcrumb(pathname);
}

export const Header: React.FC<HeaderProps> = ({ breadcrumb }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { institution, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const crumbs = normalizeBreadcrumbs(breadcrumb, location.pathname);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userProfile");
    navigate("/home");
  };

  const name = institution?.name || "Institution";
  const email = institution?.email || "admin@authentix.com";
  const avatar = institution?.avatar;
  const initial = name.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-[64px] px-8 bg-header-bg/85 backdrop-blur-md border-b border-border/60 transition-colors duration-200 shrink-0">
      
      {/* Left side: Breadcrumbs */}
      <div className="flex items-center gap-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-1.5">
          {crumbs.map((label, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <React.Fragment key={`${label}-${i}`}>
                {i > 0 && (
                  <ChevronRight size={14} className="text-muted-foreground" />
                )}
                <span
                  className={
                    isLast
                      ? "font-semibold text-foreground"
                      : "font-medium text-foreground"
                  }
                >
                  {label}
                </span>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Right side: User Profile Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2.5 p-1 px-2 cursor-pointer select-none"
        >
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-7 h-7 rounded-full object-cover border border-[#3D876C]/30"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#3D876C] text-white flex items-center justify-center font-bold text-xs">
              {initial}
            </div>
          )}
          <span className="hidden sm:block text-xs font-semibold text-foreground max-w-[120px] truncate">
            {name}
          </span>
          <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border bg-card p-2.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-150 z-50">
            {/* Header info */}
            <div className="px-3 py-2 border-b border-border/40 mb-1.5">
              <p className="text-xs font-bold text-foreground truncate">{name}</p>
              <p className="text-[10px] text-muted-foreground truncate mt-0.5">{email}</p>
            </div>

            {/* Links */}
            <ul className="space-y-0.5">
              <li>
                <Link
                  to="/settings"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-foreground hover:bg-background transition-colors"
                >
                  <Settings size={14} className="text-muted-foreground" />
                  <span>Account Settings</span>
                </Link>
              </li>
              <li>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer text-left"
                >
                  <LogOut size={14} className="text-rose-500" />
                  <span>Sign out</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
