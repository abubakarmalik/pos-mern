import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import AdjustStockModal from '../components/inventory/AdjustStockModal';
import InventoryTable from '../components/inventory/InventoryTable';
import { selectUser } from '../features/auth/authSelector';
import { adjustInventory } from '../features/inventory/inventorySlice';
import { selectInventoryAdjusting } from '../features/inventory/selectors';
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
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [qtyChange, setQtyChange] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleAdjust = () => {
    dispatch(
      adjustInventory({
        productId: selectedProduct?._id,
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
