import { FormEvent, useState } from "react";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { useAuth } from "../hooks/useAuth";
import { getErrorMessage } from "../services/api";

export const RegisterPage = () => {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      await register({ name, email, password });
      navigate("/board", { replace: true });
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-5 py-12 dark:bg-[#111a17]">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-7 shadow-soft dark:border-slate-800 dark:bg-slate-900 sm:p-9">
        <Link to="/login" className="mb-8 flex items-center gap-2 font-display text-lg font-extrabold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-forest text-white"><BriefcaseBusiness size={17} /></span>Careerly</Link>
        <p className="text-xs font-bold uppercase tracking-[.16em] text-forest dark:text-emerald-400">A fresh start</p>
        <h1 className="font-display mt-2 text-3xl font-extrabold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-muted dark:text-slate-400">Build a little more clarity into your job search.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          {error && <ErrorMessage message={error} />}
          <label className="block text-sm font-bold">Full name
            <input required maxLength={100} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-950" placeholder="Your name" />
          </label>
          <label className="block text-sm font-bold">Email address
            <input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-950" placeholder="you@example.com" />
          </label>
          <label className="block text-sm font-bold">Password
            <input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-normal outline-none focus:border-forest focus:ring-2 focus:ring-forest/10 dark:border-slate-700 dark:bg-slate-950" placeholder="At least 8 characters" />
          </label>
          <button disabled={submitting} type="submit" className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-forest px-4 py-3 text-sm font-bold text-white transition hover:bg-[#1f5641] disabled:opacity-60">{submitting ? "Creating account…" : "Create account"} {!submitting && <ArrowRight size={16} />}</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted dark:text-slate-400">Already have an account? <Link to="/login" className="font-bold text-forest hover:underline dark:text-emerald-400">Sign in</Link></p>
      </div>
    </main>
  );
};
