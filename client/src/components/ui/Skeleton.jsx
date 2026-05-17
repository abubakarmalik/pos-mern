const Skeleton = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />
);

export const TableSkeleton = ({ rows = 6, columns = 4 }) => (
  <div className="overflow-hidden rounded-lg border border-slate-200">
    <div className="grid gap-px bg-slate-200" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
      {Array.from({ length: columns }).map((_, index) => (
        <div key={`head-${index}`} className="bg-slate-50 p-4">
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
      {Array.from({ length: rows * columns }).map((_, index) => (
        <div key={index} className="bg-white p-4">
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  </div>
);

export default Skeleton;
