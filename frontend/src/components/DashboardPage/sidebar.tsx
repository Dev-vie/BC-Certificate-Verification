import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  Award,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useSidebar } from "../../context/SidebarContext";
import { useTheme } from "../Darkmodetoggle/themecontext";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Templates", href: "/templates", icon: FileText },
  { label: "Issue Certificate", href: "/issue-certificate", icon: FilePlus },
  { label: "Certificates", href: "/certificates", icon: Award },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { isCollapsed, isMobile, toggleSidebar, closeMobileSidebar } =
    useSidebar();
  const { theme } = useTheme();

  const handleSignOut = () => {
    logout();
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userProfile");
    navigate("/home");
  };

  const handleNavClick = (href: string) => {
    navigate(href);
    if (isMobile) {
      closeMobileSidebar();
    }
  };

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-35 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 flex flex-col h-screen bg-sidebar-bg border-r border-border transition-all duration-300 ease-in-out ${
          isMobile
            ? isCollapsed
              ? "-translate-x-full w-[240px]"
              : "translate-x-0 w-[240px] shadow-2xl"
            : isCollapsed
            ? "w-[72px]"
            : "w-[240px]"
        }`}
      >
        <div
          className={`flex items-center h-[64px] shrink-0 border-b border-border/60 ${
            !isMobile && isCollapsed
              ? "justify-center px-2"
              : "justify-between px-4"
          }`}
        >
          <Link
            to="/home"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer overflow-hidden"
            title="VeriCert Home"
          >
            <img
              src={theme === "light" ? "/logo-dark.png" : "/logo.png"}
              alt="VeriCert Logo"
              className="w-9 h-9 object-contain shrink-0"
            />
            {(!isCollapsed || isMobile) && (
              <span className="text-[17px] font-bold text-foreground tracking-tight whitespace-nowrap">
                Veri<span className="text-[#3D876C]">Cert</span>
              </span>
            )}
          </Link>

          {isMobile ? (
            <button
              type="button"
              onClick={closeMobileSidebar}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-all cursor-pointer md:hidden"
              aria-label="Close sidebar"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={toggleSidebar}
              className={`p-1.5 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-all cursor-pointer ${
                isCollapsed ? "hidden" : "flex items-center justify-center"
              }`}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>

        {!isMobile && isCollapsed && (
          <div className="flex justify-center py-2 border-b border-border/40">
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-background hover:text-primary transition-all cursor-pointer"
              aria-label="Expand sidebar"
              title="Expand sidebar"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}

        <nav className="flex-1 flex flex-col px-3 pt-5 overflow-y-auto overflow-x-hidden">
          {(!isCollapsed || isMobile) && (
            <p className="px-3 mb-2 text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Main
            </p>
          )}

          <ul className="space-y-1.5">
            {mainNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <button
                    onClick={() => handleNavClick(item.href)}
                    title={!isMobile && isCollapsed ? item.label : undefined}
                    className={`
                      group flex items-center w-full rounded-xl text-[13px] font-semibold
                      transition-all duration-200 cursor-pointer
                      ${
                        !isMobile && isCollapsed
                          ? "justify-center p-2.5"
                          : "justify-between px-3.5 py-2.5"
                      }
                      ${
                        isActive
                          ? "bg-primary/10 text-primary font-bold"
                          : "text-muted-foreground hover:bg-background hover:text-foreground"
                      }
                    `}
                  >
                    <div
                      className={`flex items-center ${
                        !isMobile && isCollapsed ? "justify-center" : "gap-3"
                      }`}
                    >
                      <Icon
                        size={19}
                        className={`shrink-0 transition-colors duration-150 ${
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        }`}
                      />
                      {(!isCollapsed || isMobile) && (
                        <span className="whitespace-nowrap">{item.label}</span>
                      )}
                    </div>
                    {(!isCollapsed || isMobile) && isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-3 mt-auto border-t border-border">
          <button
            onClick={handleSignOut}
            title={!isMobile && isCollapsed ? "Sign out" : undefined}
            className={`flex items-center w-full rounded-xl text-[13px] font-semibold text-muted-foreground hover:bg-red-500/10 hover:text-red-500 transition-all duration-150 cursor-pointer ${
              !isMobile && isCollapsed
                ? "justify-center p-2.5"
                : "gap-3 px-3.5 py-2.5"
            }`}
          >
            <LogOut
              size={19}
              className="shrink-0 text-muted-foreground group-hover:text-red-500"
            />
            {(!isCollapsed || isMobile) && (
              <span className="whitespace-nowrap">Sign out</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
