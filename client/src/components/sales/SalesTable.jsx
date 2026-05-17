import { Link } from 'react-router-dom';
import Badge from '../ui/Badge';
import Table from '../ui/Table';
import { formatCurrency } from '../../utils/format';

const SalesTable = ({ isLoading, sales }) => {
  const columns = [
    {
      key: 'invoiceNo',
      label: 'Invoice',
      render: (row) => (
        <Link
          to={`/sales/${row.id}`}
          className="font-medium text-blue-600 hover:underline"
        >
          {row.invoiceNo}
        </Link>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
    {
      key: 'total',
      label: 'Total',
      render: (row) => formatCurrency(row.total),
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge variant={row.status === 'REFUNDED' ? 'danger' : 'success'}>
          {row.status}
        </Badge>
      ),
    },
  ];

  if (isLoading) return <p className="text-sm text-slate-500">Loading...</p>;
  return <Table columns={columns} data={sales} />;
};

export default SalesTable;
