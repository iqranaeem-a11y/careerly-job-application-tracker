import { FormEvent, useState } from "react";
import { ArrowRight, BriefcaseBusiness, CheckCircle2 } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/api";
import { ErrorMessage } from "../components/common/ErrorMessage";

export const LoginPage = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/board" replace />;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login({ email, password });
      navigate("/board", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen bg-white dark:bg-[#111a17] lg:grid-cols-[1.05fr_.95fr]">
      <aside className="relative hidden overflow-hidden bg-[#193d31] px-12 py-10 text-white lg:flex lg:flex-col lg:justify-between xl:px-20">
        <div className="absolute -right-32 -top-28 h-96 w-96 rounded-full border border-white/10" />
        <div className="absolute -bottom-32 -left-28 h-96 w-96 rounded-full border border-white/10" />
        <Link to="/login" className="relative flex items-center gap-3 font-display text-lg font-extrabold"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10"><BriefcaseBusiness size={19} /></span>Careerly</Link>
        <div className="relative max-w-xl py-12">
          <span className="rounded-full border border-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.18em] text-emerald-200">Your next chapter starts here</span>
          <h1 className="font-display mt-7 text-5xl font-extrabold leading-[1.08] tracking-tight xl:text-6xl">Make your job search feel like <span className="text-emerald-300">progress.</span></h1>
          <p className="mt-6 max-w-md text-base leading-7 text-white/65">A calmer place to keep track of the opportunities, conversations, and follow-ups that move your career forward.</p>
          <div className="mt-9 space-y-3 text-sm font-medium text-white/80">
            {["See every opportunity at a glance", "Never miss an important follow-up", "Learn from your search with clear insights"].map((line) => <p key={line} className="flex items-center gap-3"><CheckCircle2 size={17} className="text-emerald-300" />{line}</p>)}
          </div>
        </div>
        <p className="relative text-xs text-white/45">A little more clarity for the road ahead.</p>
      </aside>
      <main className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-md">
          <Link to="/login" className="mb-12 flex items-center gap-2 font-display text-lg font-extrabold lg:hidden"><span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white"><BriefcaseBusiness size={17} /></span>Careerly</Link>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-forest dark:text-emerald-400">Welcome back</p>
          <h2 className="font-display mt-2 text-3xl font-extrabold tracking-tight">Sign in to your space</h2>
          <p className="mt-2 text-sm text-muted dark:text-slate-400">Pick up right where your job search left off.</p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            {error && <ErrorMessage message={error} />}
            <label className="block text-sm font-bold">
              Email address
              <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-900" placeholder="you@example.com" />
            </label>
            <label className="block text-sm font-bold">
              Password
              <input required type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal outline-none transition focus:border-forest focus:ring-2 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-900" placeholder="Enter your password" />
            </label>
            <button disabled={submitting} type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#1f5641] disabled:opacity-60">{submitting ? "Signing in…" : "Sign in"} {!submitting && <ArrowRight size={16} />}</button>
          </form>
          <p className="mt-7 text-center text-sm text-muted dark:text-slate-400">New to Careerly? <Link to="/register" className="font-bold text-forest hover:underline dark:text-emerald-400">Create an account</Link></p>
        </div>
      </main>
    </div>
  );
};
