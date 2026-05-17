import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Table from '../ui/Table';

const CategoriesTable = ({ categories, isLoading, isToggling, onToggle }) => {
  const columns = [
    {
      key: 'name',
      label: 'Category',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-500">
            {row.description || 'No description'}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'danger'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Link
            to={`/categories/${row.id}/edit`}
            className="text-xs font-medium text-blue-600 hover:underline"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => onToggle(row.id)}
            disabled={isToggling}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {row.isActive ? 'Disable' : 'Enable'}
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) return <p className="text-sm text-slate-500">Loading...</p>;
  return <Table columns={columns} data={categories} />;
};

export default CategoriesTable;
