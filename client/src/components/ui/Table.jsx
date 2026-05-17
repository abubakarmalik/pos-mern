import EmptyState from './EmptyState';
import { TableSkeleton } from './Skeleton';

const Table = ({
  columns,
  data,
  isLoading = false,
  emptyTitle,
  emptyDescription,
  minWidth = 'min-w-[720px]',
}) => {
  if (isLoading) return <TableSkeleton columns={columns.length} />;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className={`${minWidth} w-full divide-y divide-slate-200 text-sm`}>
          <thead className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {data.length === 0 && (
              <tr>
                <td className="p-4" colSpan={columns.length}>
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            )}
            {data.map((row, index) => (
              <tr key={row.id || index} className="transition hover:bg-cyan-50/40">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-3 align-middle text-slate-700 ${column.cellClassName || ''}`}
                  >
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
