import { Link } from "react-router-dom";

export const NotFoundPage = () => (
  <main className="grid min-h-screen place-items-center bg-canvas px-5 text-center dark:bg-[#111a17]">
    <div>
      <p className="font-display text-7xl font-extrabold tracking-tight text-forest dark:text-emerald-400">404</p>
      <h1 className="mt-3 text-xl font-extrabold">This page took a different turn.</h1>
      <p className="mt-2 text-sm text-muted dark:text-slate-400">The page you’re looking for isn’t here.</p>
      <Link to="/" className="mt-6 inline-block rounded-xl bg-forest px-4 py-2.5 text-sm font-bold text-white">Back to Careerly</Link>
    </div>
  </main>
);
