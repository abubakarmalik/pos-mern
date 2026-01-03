const Table = ({ columns, data }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-slate-200 text-sm">
      <thead className="bg-slate-50">
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className="px-4 py-2 text-left font-semibold text-slate-600"
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white">
        {data.length === 0 && (
          <tr>
            <td
              className="px-4 py-6 text-center text-slate-500"
              colSpan={columns.length}
            >
              No records found.
            </td>
          </tr>
        )}
        {data.map((row, index) => (
          <tr key={row.id || index} className="hover:bg-slate-50">
            {columns.map((column) => (
              <td key={column.key} className="px-4 py-2 text-slate-700">
                {column.render ? column.render(row) : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Table;
