import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
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
    dispatch(fetchSale(id))
      .unwrap()
      .catch((error) => toast.error(error.message));
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

  if (isLoading) return <div>Loading...</div>;
  if (!sale) return <div>Sale not found.</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">{sale.invoiceNo}</h2>
            <p className="text-sm text-slate-500">{new Date(sale.createdAt).toLocaleString()}</p>
          </div>
          {user?.role === 'ADMIN' && sale.status !== 'REFUNDED' && (
            <Button variant="danger" onClick={() => setRefundOpen(true)}>
              Refund Sale
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-600">
            <tr>
              <th className="py-2">Item</th>
              <th className="py-2">Qty</th>
              <th className="py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item) => (
              <tr key={item.productId} className="border-t border-slate-100">
                <td className="py-2">
                  <p className="font-medium text-slate-800">{item.nameSnapshot}</p>
                  <p className="text-xs text-slate-500">{item.skuSnapshot}</p>
                </td>
                <td className="py-2">{item.qty}</td>
                <td className="py-2">{formatCurrency(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-sm text-slate-600">
          <p>Total: {formatCurrency(sale.total)}</p>
          <p>Status: {sale.status}</p>
        </div>
      </div>

      <Modal
        open={refundOpen}
        title="Process Refund"
        onClose={() => setRefundOpen(false)}
      >
        <div className="space-y-4">
          <Input
            label="Reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            required
          />
          <Button
            variant="danger"
            className="w-full"
            onClick={handleRefund}
            disabled={isRefunding}
          >
            {isRefunding ? 'Processing...' : 'Confirm Refund'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SaleDetailPage;
