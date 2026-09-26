import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useTheme } from "../Darkmodetoggle/themecontext";
import {
  User,
  Globe,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
} from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../redux/features/auth";
import { fetchProfile, updateProfile } from "../../redux/features/auth/authSlice";

import ProfileSection, { type ProfileData } from "./ProfileSection";
import EmailSection from "./EmailSection";
import PasswordSection from "./PasswordSection";
import TwoFactorSection from "./TwoFactorSection";

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

export const UserSettings = () => {
  const dispatch = useAppDispatch();
  const institution = useAppSelector((state) => state.auth.institution);

  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<string>("profile");
  const [personalTabExpanded, setPersonalTabExpanded] = useState(true);

  const [toasts, setToasts] = useState<Toast[]>([]);

  const triggerToast = (
    message: string,
    type: "success" | "error" | "info" = "success",
  ) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const [profileData, setProfileData] = useState<ProfileData>({
    institutionName: institution?.name || "",
    username: institution?.name?.toLowerCase().replace(/\s+/g, ".") || "user",
    email: institution?.email || "",
    avatarUrl: institution?.avatar || undefined,
  });

  useEffect(() => {
    if (institution) {
      setProfileData({
        institutionName: institution.name || "",
        username: institution.name?.toLowerCase().replace(/\s+/g, ".") || "user",
        email: institution.email || "",
        avatarUrl: institution.avatar || undefined,
      });
    }
  }, [institution]);

  const handleProfileChange = async (data: Partial<ProfileData>) => {
    const updated = { ...profileData, ...data };
    setProfileData(updated);
    try {
      await dispatch(
        updateProfile({
          name: updated.institutionName,
          email: updated.email,
          avatar: updated.avatarUrl,
        }),
      ).unwrap();
      triggerToast("Profile saved to database successfully!", "success");
    } catch (err: any) {
      triggerToast(err?.toString() || "Failed to update profile", "error");
    }
  };

  const handleEmailChange = async (newEmail: string) => {
    try {
      await dispatch(
        updateProfile({
          email: newEmail,
        }),
      ).unwrap();
      triggerToast("Email address updated in database!", "success");
    } catch (err: any) {
      triggerToast(err?.toString() || "Failed to update email", "error");
    }
  };

  const personalNavItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "preferences", label: "Preferences", icon: Globe },
  ];

  return (
    <div className="flex flex-1 w-full h-[calc(100vh-64px)] overflow-hidden select-none bg-background text-foreground transition-colors duration-200">
      {/* Sub-Sidebar Panel */}
      <aside className={`bg-sidebar-bg border-r border-border flex flex-col justify-between shrink-0 h-full transition-all duration-300 ease-in-out ${personalTabExpanded ? "w-[240px]" : "w-[72px]"}`}>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          <div>
            {personalTabExpanded ? (
              <div className="flex items-center justify-between w-full px-3.5 py-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Personal
                </span>
                <button
                  type="button"
                  onClick={() => setPersonalTabExpanded(false)}
                  className="p-1 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-all cursor-pointer"
                  title="Collapse settings menu"
                >
                  <ChevronLeft size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center w-full py-2 border-b border-border/40 mb-2">
                <button
                  type="button"
                  onClick={() => setPersonalTabExpanded(true)}
                  className="p-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-primary transition-all cursor-pointer"
                  title="Expand settings menu"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            )}

            <ul className="mt-1 space-y-1">
              {personalNavItems.map((item) => {
                const isActive = activeTab === item.id;
                const IconComponent = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      title={!personalTabExpanded ? item.label : undefined}
                      className={`flex items-center rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
                        isActive
                          ? "bg-accent text-accent-foreground font-bold"
                          : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                      } ${
                        personalTabExpanded
                          ? "w-full gap-3 px-3.5 py-2.5"
                          : "justify-center w-11 h-11 mx-auto"
                      }`}
                    >
                      <IconComponent
                        size={16}
                        className={`shrink-0 ${
                          isActive
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}
                      />
                      {personalTabExpanded && <span>{item.label}</span>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>

      {/* Active Content Panel */}
      <main className="flex-1 bg-background overflow-y-auto px-12 py-10 transition-colors duration-200">
        <div className="max-w-2xl mx-auto">
          {activeTab === "profile" && (
            <div className="space-y-8 animate-in fade-in-50 duration-200">
              <ProfileSection
                profileData={profileData}
                onProfileChange={handleProfileChange}
                onToast={triggerToast}
              />

              {/* Security Action Rows */}
              <div className="border-t border-border pt-6 space-y-5">
                <EmailSection
                  currentEmail={profileData.email}
                  onEmailChange={handleEmailChange}
                  onToast={triggerToast}
                />

                <PasswordSection onToast={triggerToast} />

                <TwoFactorSection onToast={triggerToast} />
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-8 animate-in fade-in-50 duration-200">
              <div>
                <h1 className="text-xl font-bold text-foreground tracking-tight">
                  Preferences
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Adjust default styling, localization, and accessibility
                  settings.
                </p>
              </div>

              {/* Appearance Mode toggles */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Appearance
                </h3>

                <div className="flex gap-4">
                  <button
                    onClick={() => setTheme("light")}
                    className={`flex-1 p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      theme === "light"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <p className="text-xs">Light Mode</p>
                  </button>

                  <button
                    onClick={() => setTheme("dark")}
                    className={`flex-1 p-4 rounded-xl border text-center transition-all cursor-pointer ${
                      theme === "dark"
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-xs"
                        : "border-border bg-transparent text-muted-foreground hover:bg-accent hover:text-foreground"
                    }`}
                  >
                    <p className="text-xs">Dark Mode</p>
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3.5">
                <Button
                  variant="outline"
                  onClick={() => triggerToast("Preferences discarded", "info")}
                >
                  Discard
                </Button>
                <Button
                  onClick={() =>
                    triggerToast("Preferences saved successfully!", "success")
                  }
                >
                  Save Preferences
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-4 py-3 bg-card text-foreground rounded-xl shadow-lg border border-border text-xs font-semibold animate-in slide-in-from-right-4 duration-300 pointer-events-auto"
          >
            {t.type === "success" && (
              <CheckCircle2 size={15} className="text-primary" />
            )}
            {t.type === "error" && (
              <AlertCircle size={15} className="text-rose-500" />
            )}
            {t.type === "info" && (
              <Sparkles size={15} className="text-primary" />
            )}
            <span className="flex-1 pr-2">{t.message}</span>
            <button
              onClick={() =>
                setToasts((prev) => prev.filter((item) => item.id !== t.id))
              }
              className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSettings;
