import { AlertTriangle } from "lucide-react";

export const DeleteJobDialog = ({
  company,
  deleting,
  onCancel,
  onConfirm
}: {
  company: string;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void>;
}) => (
  <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4 backdrop-blur-sm">
    <section role="alertdialog" aria-modal="true" className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">
      <div className="grid h-11 w-11 place-items-center rounded-2xl bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300"><AlertTriangle size={20} /></div>
      <h2 className="mt-4 font-display text-lg font-extrabold">Delete this application?</h2>
      <p className="mt-2 text-sm leading-6 text-muted dark:text-slate-400">The application at <strong className="text-ink dark:text-white">{company}</strong> will be permanently removed. This action cannot be undone.</p>
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
        <button type="button" onClick={() => void onConfirm()} disabled={deleting} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 disabled:opacity-60">{deleting ? "Deleting…" : "Delete application"}</button>
      </div>
    </section>
  </div>
);
