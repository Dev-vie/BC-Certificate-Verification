import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { ClickSpark } from "../components/ui/ClickSpark";
import { useTheme } from "../components/Darkmodetoggle/themecontext";

const DASHBOARD_ROUTES = [
  "/dashboard",
  "/templates",
  "/issue-certificate",
  "/certificates",
  "/settings",
];

const RootLayout = () => {
  const { pathname } = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const isDashboard = DASHBOARD_ROUTES.some(
      (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isDashboard) {
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
      } else {
        root.classList.add(theme);
      }
    } else {
      root.classList.add("dark");
    }
  }, [pathname, theme]);

  return (
    <ClickSpark
      sparkColor="#50A083"
      sparkSize={12}
      sparkRadius={18}
      sparkCount={8}
      duration={450}
      easing="ease-out"
    >
      <div className="w-full min-h-screen bg-background text-foreground transition-colors duration-200">
        <Outlet />
      </div>
    </ClickSpark>
  );
};

export default RootLayout;
