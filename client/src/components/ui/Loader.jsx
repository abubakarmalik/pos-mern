const Loader = ({ label = 'Loading', className = '' }) => (
  <div className={`flex items-center gap-2 text-sm text-slate-500 ${className}`}>
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-cyan-600" />
    <span>{label}</span>
  </div>
);

export const PageLoader = ({ label = 'Loading' }) => (
  <div className="flex min-h-[50vh] items-center justify-center">
    <div className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-cyan-600" />
      <span className="text-sm font-medium text-slate-600">{label}</span>
    </div>
  </div>
);

export const LoadingOverlay = ({ show, label = 'Working' }) => {
  if (!show) return null;
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
      <Loader label={label} />
    </div>
  );
};

export default Loader;
