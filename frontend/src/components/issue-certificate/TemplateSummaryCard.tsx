import { useState, useEffect } from 'react';
import { ChevronRight, Layers, Loader2 } from 'lucide-react';
import type { IssueCertificateTemplate } from './types';
import { renderTemplatePreview } from '../../utils/templateAssets';

interface TemplateSummaryCardProps {
  template: IssueCertificateTemplate;
  onChangeTemplate: () => void;
}

export const TemplateSummaryCard = ({ template, onChangeTemplate }: TemplateSummaryCardProps) => {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isLoadingCover, setIsLoadingCover] = useState(false);

  const fileUrl = template?.templateFileUrl || template?.filePath;

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
        console.error('Failed to load template cover preview in TemplateSummaryCard:', err);
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
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors duration-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/20 overflow-hidden shadow-sm">
            {isLoadingCover ? (
              <Loader2 size={18} className="animate-spin text-muted-foreground" />
            ) : coverUrl ? (
              <img
                src={coverUrl}
                alt={template.title}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${template.gradientClass || 'from-primary to-primary-hover'} text-white`}>
                <Layers size={18} />
              </div>
            )}
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] text-muted-foreground uppercase">Template</p>
            <h3 className="mt-0.5 text-base font-bold text-foreground">{template.title}</h3>
            <p className="text-xs text-muted-foreground">
              {template.fieldsCount} fields mapped {template.category ? `· ${template.category}` : ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onChangeTemplate}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold text-foreground hover:bg-card hover:border-muted-foreground/30 transition-colors cursor-pointer"
        >
          Change Template
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default TemplateSummaryCard;
