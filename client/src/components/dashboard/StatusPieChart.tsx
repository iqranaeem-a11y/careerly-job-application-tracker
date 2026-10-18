import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { JobStatus, STATUS_LABELS } from "../../types/job";
import { JobStats } from "../../types/stats";

const colors: Record<JobStatus, string> = {
  APPLIED: "#4e8dd6",
  INTERVIEW: "#8b71d5",
  OFFER: "#3f9b72",
  REJECTED: "#a5ada8"
};

export const StatusPieChart = ({ stats }: { stats: JobStats }) => {
  const data = Object.entries(stats.byStatus).map(([status, count]) => ({
    name: STATUS_LABELS[status as JobStatus],
    value: count,
    color: colors[status as JobStatus]
  }));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
      <div className="mb-2">
        <h2 className="font-display font-extrabold">Status distribution</h2>
        <p className="mt-1 text-xs text-muted dark:text-slate-400">Where your applications stand</p>
      </div>
      {stats.total === 0 ? (
        <div className="grid h-64 place-items-center text-sm text-slate-400">Add an application to see your breakdown.</div>
      ) : (
        <>
          <div className="relative h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={82} paddingAngle={3} stroke="none">
                  {data.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8e4", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-extrabold">{stats.total}</span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Total</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {data.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-500 dark:text-slate-400">{entry.name}</span>
                <strong className="ml-auto">{entry.value}</strong>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
