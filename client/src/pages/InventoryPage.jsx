import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import AdjustStockModal from '../components/inventory/AdjustStockModal';
import InventoryTable from '../components/inventory/InventoryTable';
import StockLedgerTable from '../components/inventory/StockLedgerTable';
import { selectUser } from '../features/auth/authSelector';
import {
  adjustInventory,
  fetchStockLedger,
} from '../features/inventory/inventorySlice';
import {
  selectInventoryAdjusting,
  selectStockLedger,
  selectStockLedgerLoading,
  selectStockLedgerPagination,
} from '../features/inventory/selectors';
import { fetchProducts } from '../features/products/productsSlice';
import {
  selectProducts,
  selectProductsLoading,
} from '../features/products/selectors';

const InventoryPage = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const products = useSelector(selectProducts);
  const isLoading = useSelector(selectProductsLoading);
  const isAdjusting = useSelector(selectInventoryAdjusting);
  const ledger = useSelector(selectStockLedger);
  const ledgerPagination = useSelector(selectStockLedgerPagination);
  const isLedgerLoading = useSelector(selectStockLedgerLoading);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qtyChange, setQtyChange] = useState('');
  const [note, setNote] = useState('');
  const [ledgerPage, setLedgerPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStockLedger({ page: ledgerPage, limit: 20 }));
  }, [dispatch, ledgerPage]);

  const handleAdjust = () => {
    dispatch(
      adjustInventory({
        productId: selectedProduct?.id,
        qtyChange: Number(qtyChange),
        note,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success('Stock adjusted');
        setAdjustOpen(false);
        setQtyChange('');
        setNote('');
        dispatch(fetchProducts());
        dispatch(fetchStockLedger({ page: ledgerPage, limit: 20 }));
      })
      .catch((error) => toast.error(error.message));
  };

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setAdjustOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-slate-800">Inventory</h2>
      </div>
      <div className="rounded-xl bg-white p-4 shadow">
        <InventoryTable
          isLoading={isLoading}
          onAdjust={openAdjustModal}
          products={products}
          user={user}
        />
      </div>

      <div className="rounded-xl bg-white p-4 shadow">
        <h3 className="mb-4 text-base font-semibold text-slate-800">
          Stock Ledger
        </h3>
        <StockLedgerTable
          isLoading={isLedgerLoading}
          ledger={ledger}
          onPageChange={setLedgerPage}
          pagination={ledgerPagination}
        />
      </div>

      <AdjustStockModal
        isAdjusting={isAdjusting}
        note={note}
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        onNoteChange={setNote}
        onQtyChange={setQtyChange}
        onSubmit={handleAdjust}
        qtyChange={qtyChange}
        selectedProduct={selectedProduct}
      />
    </div>
  );
};

export default InventoryPage;
