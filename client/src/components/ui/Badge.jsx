const colors = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-slate-100 text-slate-700',
};

const Badge = ({ variant = 'neutral', children }) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
      colors[variant]
    }`}
  >
    {children}
  </span>
);

export default Badge;
