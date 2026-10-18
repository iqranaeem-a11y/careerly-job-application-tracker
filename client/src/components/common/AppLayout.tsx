import { BarChart3, BriefcaseBusiness, LogOut, Moon, Sun } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

const navClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
    isActive
      ? "bg-forest text-white shadow-sm"
      : "text-slate-500 hover:bg-slate-100 hover:text-ink dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
  }`;

export const AppLayout = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const signOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink transition-colors dark:bg-[#111a17] dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-[#111a17]/90">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <NavLink to="/board" className="flex shrink-0 items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-forest text-white shadow-sm">
              <BriefcaseBusiness size={19} />
            </span>
            <span>
              <span className="font-display block text-lg font-extrabold leading-tight tracking-tight">Careerly</span>
              <span className="hidden text-[11px] font-medium tracking-wide text-muted sm:block dark:text-slate-500">YOUR CAREER, ORGANIZED</span>
            </span>
          </NavLink>
          <nav className="flex items-center gap-1 rounded-2xl bg-slate-50 p-1 dark:bg-slate-900/70">
            <NavLink to="/board" className={navClass}>
              <BriefcaseBusiness size={16} /> <span>Applications</span>
            </NavLink>
            <NavLink to="/dashboard" className={navClass}>
              <BarChart3 size={16} /> <span>Insights</span>
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
            <div className="hidden text-right sm:block">
              <p className="max-w-36 truncate text-sm font-bold">{user?.name}</p>
              <p className="max-w-36 truncate text-xs text-muted dark:text-slate-500">{user?.email}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              aria-label="Log out"
              title="Log out"
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-red-600 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
        <Outlet />
      </main>
    </div>
  );
};
