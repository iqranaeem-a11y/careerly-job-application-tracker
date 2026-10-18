import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, ExternalLink, MapPin, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { Job } from "../../types/job";

const dateInputValue = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

const prettyDate = (value: string) =>
  new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" })
    .format(new Date(`${value.slice(0, 10)}T12:00:00`));

const reminderTone = (date: string) => {
  const today = dateInputValue(new Date());
  if (date < today) return "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300";
  if (date === today) return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300";
  return "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400";
};

export const JobCard = ({
  job,
  onEdit,
  onDelete
}: {
  job: Job;
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
    data: { status: job.status }
  });

  return (
    <article
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`group relative touch-none rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-soft dark:border-slate-800 dark:bg-slate-900 ${isDragging ? "z-10 opacity-50 shadow-xl" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold uppercase tracking-[.13em] text-forest dark:text-emerald-400">{job.company}</p>
          <h3 className="mt-1 truncate font-display text-[15px] font-extrabold tracking-tight">{job.position}</h3>
        </div>
        <div className="relative">
          <button type="button" aria-label={`Actions for ${job.company}`} onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open); }} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 opacity-100 transition hover:bg-slate-100 hover:text-ink dark:hover:bg-slate-800 dark:hover:text-white sm:opacity-0 sm:group-hover:opacity-100"><MoreHorizontal size={18} /></button>
          {menuOpen && (
            <div className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
              <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); setMenuOpen(false); onEdit(job); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700"><Pencil size={14} /> Edit</button>
              <button type="button" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => { event.stopPropagation(); setMenuOpen(false); onDelete(job); }} className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-semibold text-red-600 hover:bg-red-50 dark:text-red-300 dark:hover:bg-red-950/50"><Trash2 size={14} /> Delete</button>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 space-y-2 text-xs text-slate-500 dark:text-slate-400">
        {job.location && <p className="flex items-center gap-2 truncate"><MapPin size={14} className="shrink-0 text-slate-400" />{job.location}</p>}
        <p className="flex items-center gap-2"><CalendarDays size={14} className="shrink-0 text-slate-400" />Applied {prettyDate(job.appliedDate)}</p>
      </div>
      {job.followUpDate && (
        <div className={`mt-3 flex items-center gap-2 rounded-lg border px-2.5 py-2 text-[11px] font-bold ${reminderTone(job.followUpDate.slice(0, 10))}`}>
          <CalendarDays size={13} /> Follow up {job.followUpDate.slice(0, 10) < dateInputValue(new Date()) ? "overdue" : job.followUpDate.slice(0, 10) === dateInputValue(new Date()) ? "today" : prettyDate(job.followUpDate)}
        </div>
      )}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
        <span className="truncate text-xs font-semibold text-slate-500 dark:text-slate-400">{job.salary || "Salary not listed"}</span>
        {job.jobUrl && <a href={job.jobUrl} target="_blank" rel="noreferrer" onPointerDown={(event) => event.stopPropagation()} onClick={(event) => event.stopPropagation()} aria-label={`Open ${job.company} job listing`} className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-forest dark:hover:bg-slate-800"><ExternalLink size={14} /></a>}
      </div>
    </article>
  );
};
