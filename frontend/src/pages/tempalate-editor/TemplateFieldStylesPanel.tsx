import { Type } from "lucide-react";
import { Button } from "../../components/ui/button";
import type { CanvasField } from "./templateEditorConstants";

interface TemplateFieldStylesPanelProps {
  selectedField: CanvasField | undefined;
  updateField: (updates: Partial<CanvasField>) => void;
  onRemoveField: (fieldId: string) => void;
  fontSearch: string;
  setFontSearch: (value: string) => void;
  filteredFontOptions: readonly string[];
}

export function TemplateFieldStylesPanel({
  selectedField,
  updateField,
  onRemoveField,
  fontSearch,
  setFontSearch,
  filteredFontOptions,
}: TemplateFieldStylesPanelProps) {
  return (
    <div className="w-[300px] bg-card border-l border-border h-full overflow-y-auto transition-colors duration-200">
      {selectedField ? (
        <div className="p-6">
          <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase mb-2">
            Field Styles
          </p>
          <h3 className="font-bold text-foreground mb-8">
            {selectedField.name}
          </h3>

          <div className="space-y-6">

            <div>
              <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block mb-3">
                Size
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Width px
                  </label>
                  <input
                    type="number"
                    value={selectedField.width}
                    onChange={(e) =>
                      updateField({ width: Number(e.target.value) })
                    }
                    className="w-full bg-background border border-border text-foreground rounded-lg p-2 text-sm focus:ring-1 focus:ring-[#3D876C] outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Height px
                  </label>
                  <input
                    type="number"
                    value={selectedField.height}
                    onChange={(e) =>
                      updateField({ height: Number(e.target.value) })
                    }
                    className="w-full bg-background border border-border text-foreground rounded-lg p-2 text-sm focus:ring-1 focus:ring-[#3D876C] outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block mb-3">
                Font Family
              </label>
              <input
                type="text"
                value={fontSearch}
                onChange={(e) => setFontSearch(e.target.value)}
                placeholder="Search fonts..."
                className="w-full mb-2 bg-background border border-border text-foreground rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#3D876C] outline-none placeholder:text-muted-foreground/60"
              />
              <select
                value={selectedField.fontFamily}
                onChange={(e) => updateField({ fontFamily: e.target.value })}
                className="w-full bg-background border border-border text-foreground rounded-lg p-2.5 text-sm focus:ring-1 focus:ring-[#3D876C] outline-none"
              >
                {filteredFontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block mb-3">
                  Font Size
                </label>
                <input
                  type="number"
                  value={selectedField.fontSize}
                  onChange={(e) =>
                    updateField({ fontSize: Number(e.target.value) })
                  }
                  className="w-full bg-background border border-border text-foreground rounded-lg p-2 text-sm font-semibold text-right focus:ring-1 focus:ring-[#3D876C] outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block mb-3">
                  Style
                </label>
                <div className="flex bg-background border border-border p-1 rounded-lg gap-1">
                  <button
                    onClick={() =>
                      updateField({ isBold: !selectedField.isBold })
                    }
                    className={`flex-1 p-1.5 rounded-md font-bold text-sm cursor-pointer ${
                      selectedField.isBold
                        ? "bg-[#3D876C] text-white shadow-sm"
                        : "text-muted-foreground hover:bg-card"
                    }`}
                  >
                    B
                  </button>
                  <button
                    onClick={() =>
                      updateField({ isItalic: !selectedField.isItalic })
                    }
                    className={`flex-1 p-1.5 rounded-md italic text-sm font-serif cursor-pointer ${
                      selectedField.isItalic
                        ? "bg-[#3D876C] text-white shadow-sm"
                        : "text-muted-foreground hover:bg-card"
                    }`}
                  >
                    I
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block mb-3">
                Color
              </label>
              <div className="flex items-center gap-3 bg-background border border-border rounded-lg p-2">
                <input
                  type="color"
                  value={selectedField.color}
                  onChange={(e) => updateField({ color: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-none p-0 outline-none"
                />
                <input
                  type="text"
                  value={selectedField.color}
                  onChange={(e) => updateField({ color: e.target.value })}
                  className="flex-1 bg-transparent text-sm font-semibold text-foreground outline-none uppercase"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block mb-3">
                Alignment
              </label>
              <div className="flex bg-background border border-border p-1 rounded-lg gap-1">
                {(["left", "center", "right"] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateField({ align })}
                    className={`flex-1 p-2 rounded-md flex justify-center cursor-pointer ${
                      selectedField.align === align
                        ? "bg-[#3D876C] text-white shadow-sm"
                        : "text-muted-foreground hover:bg-card"
                    }`}
                  >
                    <div className="flex flex-col gap-[3px] w-[14px]">
                      <div
                        className={`h-[2px] bg-current rounded-full ${
                          align === "center"
                            ? "w-[10px] mx-auto"
                            : align === "right"
                            ? "w-[10px] ml-auto"
                            : "w-[10px]"
                        }`}
                      />
                      <div className="h-[2px] bg-current rounded-full w-full" />
                      <div
                        className={`h-[2px] bg-current rounded-full ${
                          align === "center"
                            ? "w-[10px] mx-auto"
                            : align === "right"
                            ? "w-[10px] ml-auto"
                            : "w-[10px]"
                        }`}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase block mb-3">
                Position
              </label>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    X px
                  </label>
                  <input
                    type="number"
                    value={selectedField.x}
                    onChange={(e) => updateField({ x: Number(e.target.value) })}
                    className="w-full bg-background border border-border text-foreground rounded-lg p-2 text-sm focus:ring-1 focus:ring-[#3D876C] outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Y px
                  </label>
                  <input
                    type="number"
                    value={selectedField.y}
                    onChange={(e) => updateField({ y: Number(e.target.value) })}
                    className="w-full bg-background border border-border text-foreground rounded-lg p-2 text-sm focus:ring-1 focus:ring-[#3D876C] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <Button
              variant="outline"
              onClick={() => onRemoveField(selectedField.id)}
              className="w-full border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-600 transition-colors cursor-pointer"
            >
              Remove field
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center mb-4">
            <Type size={24} className="text-muted-foreground/60" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No field selected
          </p>
          <p className="text-xs mt-1">
            Select a field on the canvas to customize its styles
          </p>
        </div>
      )}
    </div>
  );
}

export default TemplateFieldStylesPanel;
