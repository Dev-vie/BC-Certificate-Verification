import { useState, useEffect } from "react";
import { X, Layers, Loader2 } from "lucide-react";
import type { IssueCertificateTemplate } from "./types";
import { renderTemplatePreview } from "../../utils/templateAssets";
import { AnimatedItem } from "../ui/AnimatedList";

interface TemplatePickerModalProps {
  isOpen: boolean;
  templates: IssueCertificateTemplate[];
  selectedTemplateId?: string;
  onSelect: (templateId: string) => void;
  onClose: () => void;
}

const TemplatePickerItem = ({
  template,
  isSelected,
  onSelect,
}: {
  template: IssueCertificateTemplate;
  isSelected: boolean;
  onSelect: (id: string) => void;
}) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isLoadingCover, setIsLoadingCover] = useState(false);
  const fileUrl = template.templateFileUrl || template.filePath;

  useEffect(() => {
    if (!fileUrl) {
      setCoverUrl(null);
      return;
    }
    let isSubscribed = true;
    setIsLoadingCover(true);
    renderTemplatePreview(fileUrl)
      .then((url) => {
        if (isSubscribed) {
          setCoverUrl(url);
          setIsLoadingCover(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load template cover preview in TemplatePickerModal:", err);
        if (isSubscribed) {
          setCoverUrl(null);
          setIsLoadingCover(false);
        }
      });
    return () => {
      isSubscribed = false;
    };
  }, [fileUrl]);

  return (
    <button
      type="button"
      onClick={() => onSelect(template.id)}
      className={`w-full rounded-2xl border p-4 text-left transition-all cursor-pointer ${
        isSelected
          ? "border-primary bg-primary/10 shadow-sm"
          : "border-border bg-background hover:border-muted-foreground/40 hover:bg-card"
      }`}
    >
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-muted-foreground">
        {template.category}
      </p>
      <div className="mt-2 flex items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-foreground">{template.title}</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            {template.fieldsCount} fields mapped
          </p>
        </div>
        <div className="relative h-12 w-12 rounded-2xl border border-border bg-muted/20 shrink-0 overflow-hidden shadow-sm flex items-center justify-center">
          {isLoadingCover ? (
            <Loader2 size={16} className="animate-spin text-muted-foreground" />
          ) : coverUrl ? (
            <img
              src={coverUrl}
              alt={template.title}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div
              className={`h-full w-full flex items-center justify-center bg-gradient-to-br ${
                template.gradientClass || "from-primary to-primary-hover"
              } text-white`}
            >
              <Layers size={16} />
            </div>
          )}
        </div>
      </div>
    </button>
  );
};

export const TemplatePickerModal = ({
  isOpen,
  templates,
  selectedTemplateId,
  onSelect,
  onClose,
}: TemplatePickerModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-3xl bg-card border border-border shadow-2xl overflow-hidden transition-colors duration-200"
        onClick={(event) => event.stopPropagation()}
      >

        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              Select Template
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Choose the certificate template to issue from.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6">
          <div className="grid gap-3 md:grid-cols-2">
            {templates.map((template, index) => (
              <AnimatedItem key={template.id} index={index} delay={index * 0.05}>
                <TemplatePickerItem
                  template={template}
                  isSelected={template.id === selectedTemplateId}
                  onSelect={onSelect}
                />
              </AnimatedItem>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePickerModal;
