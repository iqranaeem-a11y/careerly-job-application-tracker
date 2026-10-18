import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { BriefcaseBusiness } from "lucide-react";
import { Job, JobStatus, STATUS_LABELS } from "../../types/job";
import { JobCard } from "./JobCard";

const statusStyles: Record<JobStatus, { dot: string; count: string }> = {
  APPLIED: { dot: "bg-blue-500", count: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" },
  INTERVIEW: { dot: "bg-violet-500", count: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300" },
  OFFER: { dot: "bg-emerald-500", count: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  REJECTED: { dot: "bg-slate-400", count: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" }
};

export const KanbanColumn = ({
  status,
  jobs,
  onEdit,
  onDelete
}: {
  status: JobStatus;
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (job: Job) => void;
}) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const styles = statusStyles[status];

  return (
    <section className="flex min-w-[280px] flex-1 flex-col rounded-2xl bg-slate-100/80 p-2.5 dark:bg-slate-900/60 sm:min-w-[290px]">
      <div className="flex items-center justify-between px-2 pb-3 pt-1">
        <h2 className="flex items-center gap-2 text-sm font-extrabold">
          <span className={`h-2.5 w-2.5 rounded-full ${styles.dot}`} />
          {STATUS_LABELS[status]}
        </h2>
        <span className={`grid h-6 min-w-6 place-items-center rounded-lg px-1.5 text-xs font-extrabold ${styles.count}`}>{jobs.length}</span>
      </div>
      <SortableContext items={jobs.map((job) => job.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className={`kanban-scroll flex min-h-48 flex-1 flex-col gap-2.5 overflow-y-auto rounded-xl p-1 transition ${isOver ? "bg-forest/10 ring-2 ring-inset ring-forest/20" : ""}`}>
          {jobs.length > 0 ? jobs.map((job) => (
            <JobCard key={job.id} job={job} onEdit={onEdit} onDelete={onDelete} />
          )) : (
            <div className="flex min-h-44 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 px-4 text-center dark:border-slate-700">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-slate-400 dark:bg-slate-800"><BriefcaseBusiness size={16} /></span>
              <p className="mt-3 text-xs font-semibold text-slate-400">Drop an application here</p>
            </div>
          )}
        </div>
      </SortableContext>
    </section>
  );
};
