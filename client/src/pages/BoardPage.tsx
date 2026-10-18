import { FormEvent, useMemo, useState } from "react";
import { ArrowDownUp, Plus, Sparkles } from "lucide-react";
import { DeleteJobDialog } from "../components/jobs/DeleteJobDialog";
import { JobFilters } from "../components/jobs/JobFilters";
import { JobForm } from "../components/jobs/JobForm";
import { JobModal } from "../components/jobs/JobModal";
import { KanbanBoard } from "../components/board/KanbanBoard";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useJobs } from "../hooks/useJobs";
import { getErrorMessage } from "../services/api";
import { changeJobStatus, createJob, editJob, removeJob } from "../services/jobService";
import { Job, JobFilters as JobFiltersType, JobInput, JobStatus } from "../types/job";

export const BoardPage = () => {
  const [filters, setFilters] = useState<JobFiltersType>({});
  const { jobs, setJobs, loading, error, refresh } = useJobs(filters);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const hasFilters = useMemo(
    () => Boolean(filters.search || filters.status || filters.from || filters.to),
    [filters]
  );

  const submitJob = async (input: JobInput) => {
    setSaving(true);
    setActionError(null);
    try {
      if (editingJob) await editJob(editingJob.id, input);
      else await createJob(input);
      setCreating(false);
      setEditingJob(null);
      await refresh();
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (job: Job, status: JobStatus) => {
    setActionError(null);
    setJobs((current) => current.map((item) => item.id === job.id ? { ...item, status } : item));
    try {
      await changeJobStatus(job.id, status);
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
      await refresh();
    }
  };

  const deleteSelectedJob = async () => {
    if (!deletingJob) return;
    setSaving(true);
    setActionError(null);
    try {
      await removeJob(deletingJob.id);
      setDeletingJob(null);
      await refresh();
    } catch (requestError) {
      setActionError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const clearFilters = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setFilters({});
  };

  const closeJobModal = () => {
    setCreating(false);
    setEditingJob(null);
    setActionError(null);
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-forest dark:text-emerald-400"><Sparkles size={14} />Your workspace</p>
          <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Application board</h1>
          <p className="mt-2 text-sm text-muted dark:text-slate-400">Keep the momentum going. Your next opportunity is on the board.</p>
        </div>
        <button type="button" onClick={() => { setActionError(null); setCreating(true); }} className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1f5641]"><Plus size={17} /> Add application</button>
      </section>

      <JobFilters filters={filters} onChange={setFilters} />
      {actionError && <ErrorMessage message={actionError} />}
      {error && <ErrorMessage message={error} />}
      {loading ? <LoadingSpinner label="Loading your applications" /> : (
        <>
          <div className="flex items-center justify-between gap-3 text-xs text-muted dark:text-slate-400">
            <p>{jobs.length} {jobs.length === 1 ? "application" : "applications"}{hasFilters ? " match your filters" : " in your search"}</p>
            {hasFilters && <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 font-bold text-forest hover:underline dark:text-emerald-400"><ArrowDownUp size={13} /> Clear filters</button>}
          </div>
          {jobs.length === 0 && !hasFilters ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/50">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-mint text-forest dark:bg-emerald-950 dark:text-emerald-300"><Plus size={24} /></span>
              <h2 className="font-display mt-5 text-xl font-extrabold">Your board starts here</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted dark:text-slate-400">Add the roles you’re pursuing and keep every next step in one calm, organized place.</p>
              <button type="button" onClick={() => setCreating(true)} className="mt-5 rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1f5641]">Add your first application</button>
            </div>
          ) : jobs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center text-sm text-muted dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400">No applications match these filters. Try changing or clearing them.</div>
          ) : (
            <KanbanBoard jobs={jobs} onStatusChange={changeStatus} onEdit={(job) => { setActionError(null); setEditingJob(job); }} onDelete={setDeletingJob} />
          )}
        </>
      )}

      {(creating || editingJob) && (
        <JobModal title={editingJob ? "Edit application" : "Add an application"} description={editingJob ? "Update the details and keep your search current." : "Capture the details now; you can update the status as things progress."} onClose={closeJobModal}>
          {actionError && <div className="mb-4"><ErrorMessage message={actionError} /></div>}
          <JobForm key={editingJob?.id ?? "new"} initialJob={editingJob ?? undefined} submitting={saving} onCancel={closeJobModal} onSubmit={submitJob} />
        </JobModal>
      )}
      {deletingJob && <DeleteJobDialog company={deletingJob.company} deleting={saving} onCancel={() => setDeletingJob(null)} onConfirm={deleteSelectedJob} />}
    </div>
  );
};
