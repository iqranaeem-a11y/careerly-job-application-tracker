import { BriefcaseBusiness, CalendarCheck2, Percent, Trophy } from "lucide-react";
import { JobStats } from "../../types/stats";

const metrics = [
  { key: "total", label: "Total applications", icon: BriefcaseBusiness, color: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300" },
  { key: "interviewRate", label: "Interview rate", icon: CalendarCheck2, color: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300" },
  { key: "offerRate", label: "Offer rate", icon: Trophy, color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300" },
  { key: "active", label: "In progress", icon: Percent, color: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300" }
] as const;

export const StatsCards = ({ stats }: { stats: JobStats }) => {
  const values: Record<(typeof metrics)[number]["key"], string | number> = {
    total: stats.total,
    interviewRate: `${stats.interviewRate}%`,
    offerRate: `${stats.offerRate}%`,
    active: stats.byStatus.APPLIED + stats.byStatus.INTERVIEW
  };

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ key, label, icon: Icon, color }) => (
        <article key={key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-muted dark:text-slate-400">{label}</p>
            <span className={`grid h-9 w-9 place-items-center rounded-xl ${color}`}><Icon size={17} /></span>
          </div>
          <p className="mt-4 font-display text-3xl font-extrabold tracking-tight">{values[key]}</p>
          <p className="mt-1 text-xs text-slate-400">{key === "interviewRate" ? "Reached interview or offer" : key === "offerRate" ? "Applications with an offer" : key === "active" ? "Applied or interviewing" : "Across your job search"}</p>
        </article>
      ))}
    </div>
  );
};
