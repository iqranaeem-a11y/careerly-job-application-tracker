import { useStats } from "../hooks/useStats";
import { ApplicationsBarChart } from "../components/dashboard/ApplicationsBarChart";
import { StatsCards } from "../components/dashboard/StatsCards";
import { StatusPieChart } from "../components/dashboard/StatusPieChart";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { LoadingSpinner } from "../components/common/LoadingSpinner";

export const DashboardPage = () => {
  const { stats, loading, error } = useStats();

  return (
    <div className="space-y-7">
      <section>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-forest dark:text-emerald-400">A clearer picture</p>
        <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">Search insights</h1>
        <p className="mt-2 text-sm text-muted dark:text-slate-400">Small signals that help you understand your job search momentum.</p>
      </section>
      {error && <ErrorMessage message={error} />}
      {loading ? <LoadingSpinner label="Preparing your insights" /> : stats ? (
        <>
          <StatsCards stats={stats} />
          <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
            <ApplicationsBarChart stats={stats} />
            <StatusPieChart stats={stats} />
          </div>
          <p className="text-xs leading-5 text-slate-400">Interview rate counts applications currently in Interview or Offer. Offer rate counts applications currently in Offer.</p>
        </>
      ) : null}
    </div>
  );
};
