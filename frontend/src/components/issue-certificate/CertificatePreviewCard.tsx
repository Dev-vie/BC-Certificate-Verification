import { CheckCircle2, QrCode } from 'lucide-react';
import type { IssueCertificateFormValues, IssueCertificateTemplate } from './types';

interface CertificatePreviewCardProps {
  template: IssueCertificateTemplate;
  previewUrl: string | null;
  values: IssueCertificateFormValues;
}

export const CertificatePreviewCard = ({ template, previewUrl, values }: CertificatePreviewCardProps) => {
  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Certificate Preview</h3>
        </div>
        <span className="rounded-full bg-primary-lighter px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
          Live
        </span>
      </div>

      <div className="bg-primary-lighter p-3">
        <div className="relative aspect-[0.78/1] overflow-hidden rounded-2xl border border-primary-light bg-white shadow-sm">
          <div className="absolute inset-x-0 top-0 h-4 bg-[#7ee2c8]" />

          {previewUrl ? (
            <img
              src={previewUrl}
              alt={`${template.title} preview`}
              className="absolute inset-0 h-full w-full object-contain bg-white"
              draggable={false}
            />
          ) : (
            <div className="absolute inset-0 bg-white" />
          )}

          <div className="absolute inset-0 flex flex-col items-center px-8 pt-8 text-center">
            <div className="rounded-full bg-primary p-2.5 text-white shadow-md shadow-primary/20">
              <CheckCircle2 size={22} />
            </div>
            <p className="mt-4 text-[10px] font-bold tracking-[0.22em] text-primary uppercase">{template.title}</p>
            <p className="mt-3 text-[10px] font-semibold tracking-[0.28em] text-slate-300 uppercase">This certifies that</p>
            <p className="mt-2 text-[18px] font-bold text-slate-300">{values.recipientName || 'Recipient Name'}</p>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">Has completed</p>
            <p className="mt-1 text-[11px] font-medium text-slate-300">{values.courseProgram || 'Course / Program'}</p>

            <div className="mt-auto w-full pb-6">
              <div className="mx-auto mb-3 h-14 w-14 rounded-xl border border-primary-light bg-white/90 shadow-sm flex items-center justify-center text-primary">
                <QrCode size={26} />
              </div>
              <div className="grid grid-cols-3 items-end gap-2 text-[10px] text-slate-400">
                <div className="text-left">
                  <p className="font-semibold uppercase tracking-[0.18em]">Grade</p>
                  <p className="mt-1 text-slate-700">{values.grade || '—'}</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold uppercase tracking-[0.18em]">ID</p>
                  <p className="mt-1 text-slate-700">{values.recipientId || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold uppercase tracking-[0.18em]">Date</p>
                  <p className="mt-1 font-semibold text-slate-700">{values.issueDate || '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificatePreviewCard;
