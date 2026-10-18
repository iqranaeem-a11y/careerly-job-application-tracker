export const LoadingSpinner = ({ label = "Loading" }: { label?: string }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-sm text-muted dark:text-slate-400">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-forest/20 border-t-forest" />
    {label}
  </div>
);
