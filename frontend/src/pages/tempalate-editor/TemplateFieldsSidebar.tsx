import type { ComponentType } from "react";
import { Trash2 } from "lucide-react";
import { AVAILABLE_FIELDS, SPECIAL_FIELDS } from "./templateEditorConstants";
import type { CanvasField } from "./templateEditorConstants";

interface TemplateFieldsSidebarProps {
  canvasFields: CanvasField[];
  selectedFieldId?: string | null;
  onSelectField?: (fieldId: string) => void;
  onAddField: (fieldId: string, name: string) => void;
  onRemoveField: (fieldId: string) => void;
  isCollapsed: boolean;
}

function FieldButton({
  field,
  isAdded,
  isSelected,
  onAddField,
  onRemoveField,
  onSelectField,
}: {
  field: {
    id: string;
    name: string;
    icon: ComponentType<{ size?: number; className?: string }>;
  };
  isAdded: boolean;
  isSelected?: boolean;
  onAddField: (fieldId: string, name: string) => void;
  onRemoveField: (fieldId: string) => void;
  onSelectField?: (fieldId: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 group">
      <button
        onClick={() => {
          if (isAdded) {
            onSelectField?.(field.id);
          } else {
            onAddField(field.id, field.name);
          }
        }}
        draggable={!isAdded}
        onDragStart={(event) => {
          if (isAdded) return;
          event.dataTransfer.setData("application/x-template-field", field.id);
          event.dataTransfer.effectAllowed = "copy";
        }}
        className={`flex-1 flex items-center justify-between p-2.5 rounded-lg text-sm transition-all cursor-pointer ${
          isSelected
            ? "bg-[#3D876C]/15 text-[#3D876C] font-semibold border border-[#3D876C]/40"
            : isAdded
            ? "text-foreground hover:bg-background/80 bg-background/40"
            : "text-foreground hover:bg-background"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <field.icon
            size={16}
            className={
              isSelected || isAdded
                ? "text-[#3D876C]"
                : "text-muted-foreground group-hover:text-[#3D876C]"
            }
          />
          <span className="truncate">{field.name}</span>
        </div>
        {isAdded && (
          <span
            className={`text-xs px-1.5 py-0.5 rounded-xs font-semibold ${
              isSelected
                ? "bg-[#3D876C] text-white"
                : "text-[#3D876C] bg-[#3D876C]/10"
            }`}
          >
            {isSelected ? "Selected" : "Placed"}
          </span>
        )}
      </button>

      {isAdded && (
        <button
          type="button"
          onClick={() => onRemoveField(field.id)}
          title={`Remove ${field.name}`}
          className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
}

export function TemplateFieldsSidebar({
  canvasFields,
  selectedFieldId,
  onSelectField,
  onAddField,
  onRemoveField,
  isCollapsed,
}: TemplateFieldsSidebarProps) {
  return (
    <div
      className="bg-card border-r border-border flex flex-col h-full overflow-hidden transition-[width] duration-200 ease-out"
      style={{ width: isCollapsed ? 0 : 260 }}
    >

      <div className="w-[260px] flex flex-col h-full overflow-y-auto">
        <div className="p-4">
          <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-4">
            Fields
          </p>
          <div className="space-y-1">
            {AVAILABLE_FIELDS.map((field) => (
              <FieldButton
                key={field.id}
                field={field}
                isAdded={canvasFields.some((f) => f.id === field.id)}
                isSelected={selectedFieldId === field.id}
                onAddField={onAddField}
                onRemoveField={onRemoveField}
                onSelectField={onSelectField}
              />
            ))}
          </div>

          <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mt-8 mb-4">
            Special
          </p>
          <div className="space-y-1">
            {SPECIAL_FIELDS.map((field) => (
              <FieldButton
                key={field.id}
                field={field}
                isAdded={canvasFields.some((f) => f.id === field.id)}
                isSelected={selectedFieldId === field.id}
                onAddField={onAddField}
                onRemoveField={onRemoveField}
                onSelectField={onSelectField}
              />
            ))}
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground font-semibold">
            {canvasFields.length} fields on canvas
          </p>
        </div>
      </div>
    </div>
  );
}

export default TemplateFieldsSidebar;
