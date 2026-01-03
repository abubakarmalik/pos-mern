import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { apiFetch } from '../api/client';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { formatCurrency } from '../utils/format';
import { useAuth } from '../auth/AuthProvider';

const SaleDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [refundOpen, setRefundOpen] = useState(false);
  const [reason, setReason] = useState('');

  const { data: saleData, isLoading } = useQuery({
    queryKey: ['sales', id],
    queryFn: () => apiFetch(`/sales/${id}`),
  });

  const refundMutation = useMutation({
    mutationFn: () => apiFetch('/refunds', { method: 'POST', body: { saleId: id, reason } }),
    onSuccess: () => {
      toast.success('Refund processed');
      setRefundOpen(false);
      setReason('');
      queryClient.invalidateQueries({ queryKey: ['sales', id] });
    },
    onError: (error) => toast.error(error.message),
  });

  if (isLoading) return <div>Loading...</div>;
  const sale = saleData?.data;
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
                <td className="py-2">{formatCurrency(item.lineTotalCents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-sm text-slate-600">
          <p>Total: {formatCurrency(sale.totalCents)}</p>
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
            onClick={() => refundMutation.mutate()}
            disabled={refundMutation.isLoading}
          >
            {refundMutation.isLoading ? 'Processing...' : 'Confirm Refund'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default SaleDetailPage;
