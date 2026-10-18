import { FormEvent, useState } from "react";
import { Job, JobInput, JOB_STATUSES, STATUS_LABELS } from "../../types/job";

const toDateInput = (date: string | null | undefined) => date?.slice(0, 10) ?? "";

const emptyForm: JobInput = {
  company: "",
  position: "",
  location: "",
  jobUrl: "",
  salary: "",
  status: "APPLIED",
  appliedDate: new Date().toISOString().slice(0, 10),
  followUpDate: "",
  notes: ""
};

export const JobForm = ({
  initialJob,
  submitting,
  onCancel,
  onSubmit
}: {
  initialJob?: Job;
  submitting: boolean;
  onCancel: () => void;
  onSubmit: (input: JobInput) => Promise<void>;
}) => {
  const [form, setForm] = useState<JobInput>(() =>
    initialJob
      ? {
          company: initialJob.company,
          position: initialJob.position,
          location: initialJob.location ?? "",
          jobUrl: initialJob.jobUrl ?? "",
          salary: initialJob.salary ?? "",
          status: initialJob.status,
          appliedDate: toDateInput(initialJob.appliedDate),
          followUpDate: toDateInput(initialJob.followUpDate),
          notes: initialJob.notes ?? ""
        }
      : emptyForm
  );
  const update = (field: keyof JobInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit({
      ...form,
      company: form.company.trim(),
      position: form.position.trim(),
      location: form.location?.trim() || null,
      jobUrl: form.jobUrl?.trim() || null,
      salary: form.salary?.trim() || null,
      followUpDate: form.followUpDate || null,
      notes: form.notes?.trim() || null
    });
  };

  const inputClass =
    "mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-slate-400 focus:border-forest focus:ring-2 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100";
  const labelClass = "block text-xs font-bold tracking-wide text-slate-600 dark:text-slate-300";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Company <span className="text-red-500">*</span>
          <input required maxLength={120} value={form.company} onChange={(event) => update("company", event.target.value)} className={inputClass} placeholder="e.g. Northstar Labs" />
        </label>
        <label className={labelClass}>
          Job title <span className="text-red-500">*</span>
          <input required maxLength={120} value={form.position} onChange={(event) => update("position", event.target.value)} className={inputClass} placeholder="e.g. Product Designer" />
        </label>
        <label className={labelClass}>
          Location
          <input maxLength={120} value={form.location ?? ""} onChange={(event) => update("location", event.target.value)} className={inputClass} placeholder="Remote or city" />
        </label>
        <label className={labelClass}>
          Job link
          <input type="url" value={form.jobUrl ?? ""} onChange={(event) => update("jobUrl", event.target.value)} className={inputClass} placeholder="https://…" />
        </label>
        <label className={labelClass}>
          Salary
          <input maxLength={100} value={form.salary ?? ""} onChange={(event) => update("salary", event.target.value)} className={inputClass} placeholder="e.g. $90k–$110k" />
        </label>
        <label className={labelClass}>
          Status
          <select value={form.status} onChange={(event) => update("status", event.target.value)} className={inputClass}>
            {JOB_STATUSES.map((status) => <option key={status} value={status}>{STATUS_LABELS[status]}</option>)}
          </select>
        </label>
        <label className={labelClass}>
          Date applied <span className="text-red-500">*</span>
          <input required type="date" value={form.appliedDate} onChange={(event) => update("appliedDate", event.target.value)} className={inputClass} />
        </label>
        <label className={labelClass}>
          Follow-up date
          <input type="date" value={form.followUpDate ?? ""} onChange={(event) => update("followUpDate", event.target.value)} className={inputClass} />
        </label>
      </div>
      <label className={labelClass}>
        Notes
        <textarea rows={3} maxLength={5000} value={form.notes ?? ""} onChange={(event) => update("notes", event.target.value)} className={inputClass} placeholder="Interview details, contacts, or next steps…" />
      </label>
      <div className="flex justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
        <button type="button" onClick={onCancel} className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
        <button disabled={submitting} type="submit" className="rounded-xl bg-forest px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1f5641] disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? "Saving…" : initialJob ? "Save changes" : "Add application"}
        </button>
      </div>
    </form>
  );
};
