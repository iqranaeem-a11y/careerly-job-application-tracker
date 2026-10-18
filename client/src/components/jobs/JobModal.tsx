import { ReactNode } from "react";
import { X } from "lucide-react";

export const JobModal = ({
  title,
  description,
  children,
  onClose
}: {
  title: string;
  description: string;
  children: ReactNode;
  onClose: () => void;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-5"
    onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <section role="dialog" aria-modal="true" aria-labelledby="job-modal-title" className="max-h-[94vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-700 dark:bg-slate-900 sm:rounded-3xl sm:p-7">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 id="job-modal-title" className="font-display text-xl font-extrabold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted dark:text-slate-400">{description}</p>
        </div>
        <button type="button" onClick={onClose} aria-label="Close dialog" className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-ink dark:hover:bg-slate-800 dark:hover:text-white"><X size={18} /></button>
      </div>
      {children}
    </section>
  </div>
);
