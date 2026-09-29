import React, { useState } from "react";
import { X, UploadCloud, Loader2, CircleHelp } from "lucide-react";
import { Button } from "../ui/button";
import { TemplateHowItWorksModal } from "./TemplateHowItWorksModal";

interface CreateNewTemplateProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; file: File }) => void;
  isSubmitting?: boolean;
  submitError?: unknown;
}

export const CreateNewTemplate: React.FC<CreateNewTemplateProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  submitError,
}) => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [showGuide, setShowGuide] = useState(false);

  const isPdfFile = (candidate: File) =>
    candidate.type === "application/pdf" ||
    candidate.name.toLowerCase().endsWith(".pdf");

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      if (isPdfFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (isPdfFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) return;
    onSubmit({ title, file });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-card rounded-2xl w-full max-w-md shadow-xl overflow-hidden flex flex-col border border-border transition-colors duration-200">
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-foreground">
                Upload Template
              </h2>
              <button
                type="button"
                onClick={() => setShowGuide(true)}
                className="inline-flex items-center justify-center text-slate-400 hover:text-primary-light transition-colors cursor-pointer p-1"
              >
                <CircleHelp size={16} />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a PDF certificate design to use as a template.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:bg-background hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-2xl bg-background hover:bg-primary/10 hover:border-primary/50 transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 flex items-center justify-center bg-card border border-border rounded-xl shadow-sm mb-4 group-hover:scale-105 transition-transform text-muted-foreground group-hover:text-primary">
              <UploadCloud size={24} />
            </div>

            <p className="text-sm font-medium text-foreground text-center relative">
              {file ? (
                <span className="text-primary font-bold">{file.name}</span>
              ) : (
                <>
                  Drop a PDF here or{" "}
                  <label className="text-primary hover:underline cursor-pointer">
                    click to browse
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </label>
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              PDF only • max 20 MB
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Template Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AWS Cloud Practitioner"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              />
            </div>
          </div>

          {submitError ? (
            <p className="text-sm text-red-500 -mt-2">
              Upload failed. Please try again.
            </p>
          ) : null}

          <div className="flex items-center gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 py-3 border-border bg-background text-foreground hover:bg-card cursor-pointer"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 py-3 flex items-center justify-center gap-2 cursor-pointer"
              disabled={!title || !file || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <UploadCloud size={18} />
                  Upload Template
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      <TemplateHowItWorksModal
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
      />
    </div>
  );
};

export default CreateNewTemplate;
