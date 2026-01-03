const Select = ({ label, error, className = '', children, ...props }) => (
  <label className="block text-sm">
    {label && <span className="text-slate-600">{label}</span>}
    <select
      className={`mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${className}`}
      {...props}
    >
      {children}
    </select>
    {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
  </label>
);

export default Select;
