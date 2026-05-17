const toNumber = (value) => (value == null ? value : Number(value));

const mapRefund = (refund) => {
  if (!refund) return null;

  return {
    id: refund.id,
    _id: refund.id,
    saleId: refund.sale_id,
    reason: refund.reason,
    refundAmount: toNumber(refund.refund_amount),
    createdBy: refund.created_by,
    createdAt: refund.created_at,
    sale: refund.sales
      ? {
          id: refund.sales.id,
          invoiceNo: refund.sales.invoice_no,
          total: toNumber(refund.sales.total),
          status: refund.sales.status,
          createdAt: refund.sales.created_at,
        }
      : null,
    createdByUser: refund.users
      ? {
          id: refund.users.id,
          name: refund.users.name,
          username: refund.users.username,
          role: refund.users.role,
        }
      : null,
  };
};

module.exports = { mapRefund };
