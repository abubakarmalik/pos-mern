import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FiRotateCcw } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Input from '../components/ui/Input';
import { PageLoader } from '../components/ui/Loader';
import PageHeader from '../components/ui/PageHeader';
import Table from '../components/ui/Table';
import { formatCurrency } from '../utils/format';
import { selectUser } from '../features/auth/authSelector';
import { createRefund, fetchSale } from '../features/sales/salesSlice';
import {
  selectCurrentSale,
  selectCurrentSaleLoading,
  selectSaleRefunding,
} from '../features/sales/selectors';

const SaleDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const sale = useSelector(selectCurrentSale);
  const isLoading = useSelector(selectCurrentSaleLoading);
  const isRefunding = useSelector(selectSaleRefunding);
  const [refundOpen, setRefundOpen] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    dispatch(fetchSale(id));
  }, [dispatch, id]);

  const handleRefund = () => {
    dispatch(createRefund({ saleId: id, reason }))
      .unwrap()
      .then(() => {
        toast.success('Refund processed');
        setRefundOpen(false);
        setReason('');
        dispatch(fetchSale(id));
      })
      .catch((error) => toast.error(error.message));
  };

  if (isLoading) return <PageLoader label="Loading sale" />;
  if (!sale) return <Card>Sale not found.</Card>;

  const itemColumns = [
    {
      key: 'item',
      label: 'Item',
      render: (item) => (
        <div>
          <p className="font-medium text-slate-900">{item.nameSnapshot}</p>
          <p className="text-xs text-slate-500">{item.skuSnapshot}</p>
        </div>
      ),
    },
    { key: 'qty', label: 'Qty' },
    {
      key: 'total',
      label: 'Total',
      render: (item) => formatCurrency(item.lineTotal),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title={sale.invoiceNo}
        description={new Date(sale.createdAt).toLocaleString()}
        actions={
          user?.role === 'ADMIN' && sale.status !== 'REFUNDED' ? (
            <Button
              variant="danger"
              leftIcon={<FiRotateCcw />}
              onClick={() => setRefundOpen(true)}
            >
              Refund Sale
            </Button>
          ) : null
        }
      />

      <Card className="space-y-4">
        <Table columns={itemColumns} data={sale.items} minWidth="min-w-[520px]" />
        <div className="grid gap-3 rounded-lg bg-slate-50 p-4 text-sm sm:grid-cols-2">
          <div>
            <p className="text-slate-500">Total</p>
            <p className="text-lg font-semibold text-slate-950">{formatCurrency(sale.total)}</p>
          </div>
          <div>
            <p className="text-slate-500">Status</p>
            <p className="font-semibold text-slate-900">{sale.status}</p>
          </div>
        </div>
      </Card>

      <ConfirmDialog
        open={refundOpen}
        title="Process refund?"
        description="This is a destructive financial action and will update the sale status."
        confirmLabel="Process refund"
        loadingLabel="Processing..."
        variant="danger"
        loading={isRefunding}
        onCancel={() => setRefundOpen(false)}
        onConfirm={handleRefund}
      >
        <Input
          label="Reason"
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          required
        />
      </ConfirmDialog>
    </div>
  );
};

export default SaleDetailPage;
