const PageHeader = ({
  title,
  description,
  actions,
  eyebrow,
  children,
  className = '',
}) => (
  <div className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`}>
    <div className="min-w-0">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">
          {eyebrow}
        </p>
      )}
      <h1 className="text-2xl font-semibold tracking-normal text-slate-950">
        {title}
      </h1>
      {description && (
        <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
          {description}
        </p>
      )}
      {children}
    </div>
    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export default PageHeader;
