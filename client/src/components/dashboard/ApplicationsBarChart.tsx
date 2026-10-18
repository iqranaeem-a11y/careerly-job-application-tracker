import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { JobStats } from "../../types/stats";

const monthLabel = (month: string) =>
  new Intl.DateTimeFormat(undefined, { month: "short", year: "2-digit" })
    .format(new Date(`${month}-01T12:00:00`));

export const ApplicationsBarChart = ({ stats }: { stats: JobStats }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 sm:p-6">
    <div className="mb-5">
      <h2 className="font-display font-extrabold">Application activity</h2>
      <p className="mt-1 text-xs text-muted dark:text-slate-400">Applications submitted each month</p>
    </div>
    {stats.applicationsPerMonth.length === 0 ? (
      <div className="grid h-64 place-items-center text-sm text-slate-400">Your monthly activity will appear here.</div>
    ) : (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={stats.applicationsPerMonth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7ede9" />
          <XAxis dataKey="month" tickFormatter={monthLabel} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8a9990" }} />
          <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8a9990" }} />
          <Tooltip labelFormatter={(label) => monthLabel(String(label))} cursor={{ fill: "#eff5f1" }} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8e4", fontSize: 12 }} />
          <Bar dataKey="count" name="Applications" fill="#28664f" radius={[6, 6, 0, 0]} maxBarSize={42} />
        </BarChart>
      </ResponsiveContainer>
    )}
  </section>
);
