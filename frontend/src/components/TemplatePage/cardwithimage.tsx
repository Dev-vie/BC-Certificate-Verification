import { useState, useEffect, useRef } from 'react';
import { BookOpen, Briefcase, BarChart3, Cpu, Globe, Plus, Calendar, Grid, Edit3, Compass, Sparkles, MoreVertical, Trash2, Eye, Loader2 } from 'lucide-react';
import { renderTemplatePreview } from '../../utils/templateAssets';

export interface CardWithImageProps {
  isUpload?: boolean;
  title?: string;
  category?: string;
  status?: 'Active' | 'Draft';
  fieldsCount?: number;
  date?: string;
  gradientClass?: string;
  templateFileUrl?: string;
  onActionClick?: () => void;
  onClick?: () => void;
  onViewClick?: () => void;
  onDeleteClick?: () => void;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Academia':
      return <BookOpen size={13} className="text-purple-500" />;
    case 'Business':
      return <Briefcase size={13} className="text-primary" />;
    case 'Data & AI':
      return <BarChart3 size={13} className="text-amber-500" />;
    case 'Engineering':
      return <Cpu size={13} className="text-blue-500" />;
    case 'Marketing':
      return <Globe size={13} className="text-pink-500" />;
    default:
      return <Sparkles size={13} className="text-slate-500" />;
  }
};

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'Academia':
      return { text: 'text-purple-500', bg: 'bg-purple-500/[0.08]' };
    case 'Business':
      return { text: 'text-primary', bg: 'bg-primary/[0.08]' };
    case 'Data & AI':
      return { text: 'text-amber-500', bg: 'bg-amber-500/[0.08]' };
    case 'Engineering':
      return { text: 'text-blue-500', bg: 'bg-blue-500/[0.08]' };
    case 'Marketing':
      return { text: 'text-pink-500', bg: 'bg-pink-500/[0.08]' };
    default:
      return { text: 'text-slate-500', bg: 'bg-slate-500/[0.08]' };
  }
};

const getTopIcon = (category: string) => {
  switch (category) {
    case 'Academia':
      return <BookOpen size={24} className="text-white" />;
    case 'Business':
      return <Briefcase size={24} className="text-white" />;
    case 'Data & AI':
      return <BarChart3 size={24} className="text-white" />;
    case 'Engineering':
      return <Cpu size={24} className="text-white" />;
    case 'Marketing':
      return <Globe size={24} className="text-white" />;
    default:
      return <Sparkles size={24} className="text-white" />;
  }
};

export const CardWithImage = ({
  isUpload = false,
  title = '',
  category = 'Academia',
  status = 'Active',
  fieldsCount = 0,
  date = '',
  gradientClass = 'from-violet-500 to-fuchsia-500',
  templateFileUrl,
  onActionClick,
  onClick,
  onViewClick,
  onDeleteClick,
}: CardWithImageProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [isLoadingCover, setIsLoadingCover] = useState(false);
  const [hasImgError, setHasImgError] = useState(false);

  useEffect(() => {
    setHasImgError(false);
    if (!templateFileUrl) {
      setCoverUrl(null);
      return;
    }
    let isSubscribed = true;
    setIsLoadingCover(true);

    renderTemplatePreview(templateFileUrl)
      .then((url) => {
        if (isSubscribed) {
          setCoverUrl(url);
          setIsLoadingCover(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load template cover preview:', err);
        if (isSubscribed) {
          setIsLoadingCover(false);
        }
      });

    return () => {
      isSubscribed = false;
    };
  }, [templateFileUrl]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  if (isUpload) {
    return (
      <div
        onClick={onClick}
        className="flex flex-col items-center justify-center h-full min-h-[360px] bg-card rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/[0.02] cursor-pointer transition-all duration-300 group text-foreground"
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-background group-hover:bg-primary/10 group-hover:scale-105 transition-all duration-300 mb-4 shadow-sm">
          <Plus size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">Upload template</p>
        <p className="text-xs text-muted-foreground mt-1">PDF • max 20 MB</p>
      </div>
    );
  }

  const catStyles = getCategoryStyles(category);
  const isDraft = status === 'Draft';

  return (
    <div
      onClick={onClick}
      className="flex flex-col bg-card text-foreground rounded-2xl border border-border overflow-hidden hover:shadow-md hover:border-border/80 transition-all duration-300 cursor-pointer"
    >
      {/* Top section: uploaded template preview or colorful fallback header */}
      <div className="relative w-full aspect-[16/9] bg-background/50 overflow-hidden flex items-center justify-center border-b border-border/40">
        {coverUrl && !hasImgError ? (
          <img
            src={coverUrl}
            alt={title}
            onError={() => setHasImgError(true)}
            className="w-full h-full object-cover object-top"
          />
        ) : isLoadingCover ? (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <Loader2 size={24} className="text-white animate-spin" />
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center`}>
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 shadow-md">
              {getTopIcon(category)}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card/95 border border-border backdrop-blur-sm shadow-sm text-[10px] font-bold">
          <span className={`w-1.5 h-1.5 rounded-full ${isDraft ? 'bg-amber-500' : 'bg-primary'}`} />
          <span className="text-foreground/95">{status}</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col p-5">
        <div className="flex items-center justify-between mb-2.5 relative">
          <div className="flex items-center gap-1.5">
            {getCategoryIcon(category)}
            <span className={`text-[10px] font-bold uppercase tracking-wider ${catStyles.text}`}>
              {category}
            </span>
          </div>

          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
            >
              <MoreVertical size={15} />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-card border border-border rounded-xl shadow-lg py-1 z-20 text-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onViewClick?.();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-background flex items-center gap-2 text-foreground cursor-pointer"
                >
                  <Eye size={13} className="text-muted-foreground" />
                  View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onDeleteClick?.();
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-rose-500/10 flex items-center gap-2 text-rose-500 cursor-pointer"
                >
                  <Trash2 size={13} className="text-rose-500/60" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-[15px] font-bold text-foreground line-clamp-1 mb-3">
          {title}
        </h3>

        {/* Info Rows */}
        <div className="flex items-center justify-between text-muted-foreground text-xs mb-5">
          <div className="flex items-center gap-1">
            <Grid size={13} className="text-muted-foreground/60" />
            <span>
              {fieldsCount > 0 ? `${fieldsCount} fields mapped` : 'No fields mapped'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar size={13} className="text-muted-foreground/60" />
            <span>{date}</span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onActionClick?.();
          }}
          className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border ${
            isDraft
              ? 'bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400'
              : 'bg-primary/10 border-primary/20 hover:bg-primary/20 text-primary'
          }`}
        >
          {isDraft ? (
            <>
              <Compass size={14} className="text-amber-500" />
              Map placeholders
            </>
          ) : (
            <>
              <Edit3 size={14} className="text-primary" />
              Edit placeholders
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default CardWithImage;
