import { Link } from "react-router-dom";
import { ChevronLeft, Save, PanelLeft, Undo2, Redo2 } from "lucide-react";
import { Button } from "../../components/ui/button";

interface TemplateEditorHeaderProps {
  templateTitle: string;
  activeTab: "canvas" | "preview" | "email";
  onTabChange: (tab: "canvas" | "preview" | "email") => void;
  onSave: () => void;
  isSaving: boolean;
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
}

export function TemplateEditorHeader({
  templateTitle,
  activeTab,
  onTabChange,
  onSave,
  isSaving,
  isSidebarCollapsed,
  onToggleSidebar,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: TemplateEditorHeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-card border-b border-border transition-colors duration-200">
      <div className="flex items-center gap-3">
        {activeTab === "canvas" && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label={
              isSidebarCollapsed ? "Show fields panel" : "Hide fields panel"
            }
            title={isSidebarCollapsed ? "Show fields panel" : "Hide fields panel"}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              isSidebarCollapsed
                ? "bg-[#3D876C]/10 text-[#3D876C]"
                : "text-muted-foreground hover:bg-background hover:text-foreground"
            }`}
          >
            <PanelLeft size={18} />
          </button>
        )}

        <div className="w-px h-6 bg-border" />

        <Link
          to="/templates"
          className="text-muted-foreground hover:text-foreground transition-colors flex items-center"
        >
          <ChevronLeft size={20} />
          <span className="font-semibold text-sm">Templates</span>
        </Link>
        <span className="text-border">/</span>
        <h1 className="font-bold text-foreground">{templateTitle}</h1>
      </div>

      <div className="flex items-center gap-3">
        {activeTab === "canvas" && (
          <div className="flex items-center bg-background border border-border p-0.5 rounded-lg">
            <button
              type="button"
              onClick={onUndo}
              disabled={!canUndo}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Undo (Ctrl + Z)"
            >
              <Undo2 size={15} />
            </button>
            <button
              type="button"
              onClick={onRedo}
              disabled={!canRedo}
              className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
              title="Redo (Ctrl + Y or Ctrl + Shift + Z)"
            >
              <Redo2 size={15} />
            </button>
          </div>
        )}

        <div className="flex bg-background border border-border p-1 rounded-lg">
          <button
            onClick={() => onTabChange("canvas")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === "canvas"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Design Canvas
          </button>
          <button
            onClick={() => onTabChange("preview")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === "preview"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Live Preview
          </button>
          <button
            onClick={() => onTabChange("email")}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === "email"
                ? "bg-card shadow-sm text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Email Template
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onSave}
          disabled={isSaving}
          className="gap-2 h-9 cursor-pointer"
        >
          <Save size={16} />
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </div>
    </header>
  );
}

export default TemplateEditorHeader;
