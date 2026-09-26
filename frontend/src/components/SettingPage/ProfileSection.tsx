import { useState, useEffect, useRef } from "react";
import { Upload, Trash2, Loader2 } from "lucide-react";
import { Button } from "../ui/button";

export interface ProfileData {
  institutionName: string;
  username: string;
  email: string;
  avatarUrl?: string;
}

interface ProfileSectionProps {
  profileData: ProfileData;
  onProfileChange: (data: Partial<ProfileData>) => void;
  onToast: (msg: string, type?: "success" | "error" | "info") => void;
}

export const ProfileSection = ({
  profileData,
  onProfileChange,
  onToast,
}: ProfileSectionProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tempData, setTempData] = useState<ProfileData>({ ...profileData });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setTempData({ ...profileData });
  }, [profileData]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: 1MB
    if (file.size > 1024 * 1024) {
      onToast("Profile picture must be less than 1MB", "error");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64String = reader.result as string;
        await onProfileChange({ avatarUrl: base64String });
        onToast("Profile picture updated", "success");
      } catch (err: any) {
        onToast(err.message || "Failed to upload avatar", "error");
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      onToast("Failed to read profile picture file", "error");
      setIsUploading(false);
    };
  };

  const handleAvatarDelete = async () => {
    try {
      setIsUploading(true);
      await onProfileChange({ avatarUrl: null as any });
      onToast("Profile picture removed", "success");
    } catch (err: any) {
      onToast(err.message || "Failed to remove avatar", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempData.institutionName.trim() || !tempData.username.trim()) {
      onToast("Institution name and username are required", "error");
      return;
    }

    try {
      setIsUploading(true);
      await onProfileChange({
        institutionName: tempData.institutionName.trim(),
        username: tempData.username.trim(),
      });
      onToast("Profile updated successfully", "success");
    } catch (err: any) {
      onToast(err.message || "Failed to update profile", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    onToast("Changes discarded", "info");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          Profile
        </h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your personal identity details across Authentix.
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 p-5 bg-card/40 border border-border rounded-2xl">
        <div className="relative">
          {isUploading ? (
            <div className="w-20 h-20 rounded-full bg-background flex items-center justify-center border border-border">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : tempData.avatarUrl ? (
            <img
              src={tempData.avatarUrl}
              alt="Avatar Preview"
              className="w-20 h-20 rounded-full object-cover border border-border shadow-sm"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold uppercase shadow-sm border border-border">
              {tempData.institutionName.substring(0, 2)}
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-foreground/90">
            Profile picture
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-border text-foreground hover:bg-accent"
            >
              <Upload size={13} className="mr-1.5" />
              Edit
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAvatarDelete}
              disabled={!tempData.avatarUrl}
              className="text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 border-border"
            >
              <Trash2 size={13} className="mr-1.5" />
              Delete
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed max-w-sm">
            This picture will appear on Front collaboration, not external
            communication.
            <br />
            (Image format must be less than 1MB).
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-2">
            <label
              htmlFor="institutionName"
              className="block text-xs font-semibold text-foreground/90 mb-1.5"
            >
              Institution name{" "}
              <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              id="institutionName"
              type="text"
              value={tempData.institutionName}
              onChange={(e) =>
                setTempData((prev) => ({
                  ...prev,
                  institutionName: e.target.value,
                }))
              }
              className="w-full h-10 px-3.5 text-xs text-foreground bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-150"
              required
            />
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-xs font-semibold text-foreground/90 mb-1.5"
            >
              Username <span className="text-rose-500 font-bold">*</span>
            </label>
            <input
              id="username"
              type="text"
              value={tempData.username}
              onChange={(e) =>
                setTempData((prev) => ({ ...prev, username: e.target.value }))
              }
              className="w-full h-10 px-3.5 text-xs text-foreground bg-background border border-border rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-150"
              required
            />
          </div>

          <div>
            <label
              htmlFor="emailDisplay"
              className="block text-xs font-semibold text-foreground/90 mb-1.5"
            >
              Email address
            </label>
            <input
              id="emailDisplay"
              type="email"
              value={tempData.email}
              disabled
              className="w-full h-10 px-3.5 text-xs text-muted-foreground/80 bg-muted border border-border rounded-xl cursor-not-allowed select-none outline-none"
            />
          </div>
        </div>

        {/* Form Action Footer */}
        <div className="border-t border-border pt-6 flex items-center justify-end gap-3.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="border-border text-foreground hover:bg-accent"
          >
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSection;
