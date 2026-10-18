import { Search, SlidersHorizontal } from "lucide-react";
import { JobFilters as JobFiltersType, JOB_STATUSES, STATUS_LABELS } from "../../types/job";

export const JobFilters = ({
  filters,
  onChange
}: {
  filters: JobFiltersType;
  onChange: (filters: JobFiltersType) => void;
}) => (
  <section className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 md:grid-cols-[minmax(220px,1.5fr)_minmax(150px,.8fr)_minmax(150px,.8fr)_minmax(150px,.8fr)]">
    <label className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        value={filters.search ?? ""}
        onChange={(event) => onChange({ ...filters, search: event.target.value })}
        placeholder="Search company or role"
        aria-label="Search company or position"
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-forest focus:ring-2 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-950"
      />
    </label>
    <label className="relative">
      <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <select
        value={filters.status ?? ""}
        onChange={(event) =>
          onChange({ ...filters, status: event.target.value as JobFiltersType["status"] })
        }
        aria-label="Filter by application status"
        className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-950"
      >
        <option value="">All statuses</option>
        {JOB_STATUSES.map((status) => (
          <option value={status} key={status}>{STATUS_LABELS[status]}</option>
        ))}
      </select>
    </label>
    <label className="text-xs font-semibold text-muted dark:text-slate-400">
      Applied from
      <input
        type="date"
        value={filters.from ?? ""}
        onChange={(event) => onChange({ ...filters, from: event.target.value })}
        className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      />
    </label>
    <label className="text-xs font-semibold text-muted dark:text-slate-400">
      Applied through
      <input
        type="date"
        value={filters.to ?? ""}
        onChange={(event) => onChange({ ...filters, to: event.target.value })}
        className="mt-1 block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-normal text-ink outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
      />
    </label>
  </section>
);
