import { Link } from 'react-router-dom';
import { FiEdit2, FiPower } from 'react-icons/fi';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
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
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-50"
          >
            <FiEdit2 />
            Edit
          </Link>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<FiPower />}
            onClick={() => onToggle(row)}
            disabled={isToggling}
          >
            {row.isActive ? 'Disable' : 'Enable'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={categories}
      isLoading={isLoading}
      emptyTitle="No categories found"
      emptyDescription="Create a category or adjust the filters."
    />
  );
};

export default CategoriesTable;
