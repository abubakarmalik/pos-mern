import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import AdjustStockModal from '../components/inventory/AdjustStockModal';
import InventoryTable from '../components/inventory/InventoryTable';
import StockLedgerTable from '../components/inventory/StockLedgerTable';
import Card from '../components/ui/Card';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Input from '../components/ui/Input';
import PageHeader from '../components/ui/PageHeader';
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
import useDebounce from '../hooks/useDebounce';

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
  const [confirmAdjust, setConfirmAdjust] = useState(false);
  const [ledgerSearch, setLedgerSearch] = useState('');
  const debouncedLedgerSearch = useDebounce(ledgerSearch);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStockLedger({
      page: ledgerPage,
      limit: 20,
      search: debouncedLedgerSearch,
    }));
  }, [debouncedLedgerSearch, dispatch, ledgerPage]);

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
        dispatch(fetchStockLedger({
          page: ledgerPage,
          limit: 20,
          search: debouncedLedgerSearch,
        }));
      })
      .catch((error) => toast.error(error.message));
  };

  const openAdjustModal = (product) => {
    setSelectedProduct(product);
    setAdjustOpen(true);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Inventory"
        description="Monitor stock levels and review ledger movement across products."
      />
      <Card>
        <InventoryTable
          isLoading={isLoading}
          onAdjust={openAdjustModal}
          products={products}
          user={user}
        />
      </Card>

      <Card>
        <h3 className="mb-4 text-base font-semibold text-slate-800">
          Stock Ledger
        </h3>
        <div className="mb-4 max-w-md">
          <Input
            label="Search ledger"
            placeholder="Search by product name or SKU"
            value={ledgerSearch}
            onChange={(event) => {
              setLedgerSearch(event.target.value);
              setLedgerPage(1);
            }}
          />
        </div>
        <StockLedgerTable
          isLoading={isLedgerLoading}
          ledger={ledger}
          onPageChange={setLedgerPage}
          pagination={ledgerPagination}
        />
      </Card>

      <AdjustStockModal
        isAdjusting={isAdjusting}
        note={note}
        open={adjustOpen}
        onClose={() => setAdjustOpen(false)}
        onNoteChange={setNote}
        onQtyChange={setQtyChange}
        onSubmit={() => setConfirmAdjust(true)}
        qtyChange={qtyChange}
        selectedProduct={selectedProduct}
      />
      <ConfirmDialog
        open={confirmAdjust}
        title="Apply stock adjustment?"
        description={`This will change ${selectedProduct?.name || 'the product'} stock by ${Number(qtyChange) || 0}.`}
        confirmLabel="Apply adjustment"
        loadingLabel="Saving..."
        variant="danger"
        loading={isAdjusting}
        onCancel={() => setConfirmAdjust(false)}
        onConfirm={() => {
          setConfirmAdjust(false);
          handleAdjust();
        }}
      />
    </div>
  );
};

export default InventoryPage;
