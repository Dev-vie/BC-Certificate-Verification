import Sidebar from "../components/DashboardPage/sidebar";
import UserSettings from "../components/SettingPage/usersetting";
import { useState, useEffect } from "react";
import Header from "../components/DashboardPage/header";
import { useSidebar } from "../context/SidebarContext";
import { motion } from "motion/react";

const SettingPage = () => {
  const { isCollapsed, isMobile } = useSidebar();
  const [, setProfile] = useState(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Ignore parse error
      }
    }
    return {
      firstName: "Jane",
      lastName: "Smith",
      avatarUrl: null,
    };
  });

  useEffect(() => {
    const handleSync = () => {
      const saved = localStorage.getItem("userProfile");
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch {
          // Ignore parse error
        }
      }
    };
    window.addEventListener("storage", handleSync);
    return () => window.removeEventListener("storage", handleSync);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Main Application Sidebar */}
      <Sidebar />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out min-w-0 ${
          isMobile ? "ml-0" : isCollapsed ? "ml-[72px]" : "ml-[240px]"
        }`}
      >
        <Header />

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="flex-1 flex overflow-hidden"
        >
          <UserSettings />
        </motion.div>
      </div>
    </div>
  );
};

export default SettingPage;
