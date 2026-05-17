const colors = {
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  warning: 'bg-amber-50 text-amber-700 ring-amber-600/20',
  danger: 'bg-red-50 text-red-700 ring-red-600/20',
  info: 'bg-cyan-50 text-cyan-700 ring-cyan-600/20',
  neutral: 'bg-slate-100 text-slate-700 ring-slate-500/20',
};

const Badge = ({ variant = 'neutral', children, className = '' }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
      colors[variant]
    } ${className}`}
  >
    {children}
  </span>
);

export default Badge;
