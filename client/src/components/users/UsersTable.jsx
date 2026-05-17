import Badge from '../ui/Badge';
import Table from '../ui/Table';

const formatDate = (value) => {
  if (!value) return '-';
  return new Intl.DateTimeFormat('en-PK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const UsersTable = ({ currentUser, isLoading, isToggling, onToggle, users }) => {
  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.name}</p>
          <p className="text-xs text-slate-500">{row.username}</p>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => (
        <Badge variant={row.role === 'ADMIN' ? 'info' : 'neutral'}>
          {row.role}
        </Badge>
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
      key: 'createdAt',
      label: 'Created',
      render: (row) => formatDate(row.createdAt),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) =>
        row.id === currentUser?.id ? (
          <span className="text-xs font-medium text-slate-400">Current user</span>
        ) : (
          <button
            type="button"
            onClick={() => onToggle(row.id)}
            disabled={isToggling}
            className="text-xs font-medium text-slate-600 hover:text-slate-900 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {row.isActive ? 'Disable' : 'Enable'}
          </button>
        ),
    },
  ];

  if (isLoading) return <p className="text-sm text-slate-500">Loading...</p>;
  return <Table columns={columns} data={users} />;
};

export default UsersTable;
