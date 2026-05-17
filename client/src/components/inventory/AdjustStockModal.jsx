import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const AdjustStockModal = ({
  isAdjusting,
  note,
  onClose,
  onNoteChange,
  onQtyChange,
  onSubmit,
  open,
  qtyChange,
  selectedProduct,
}) => (
  <Modal
    open={open}
    title={`Adjust Stock - ${selectedProduct?.name || ''}`}
    onClose={onClose}
  >
    <div className="space-y-4">
      <Input
        label="Quantity Change"
        type="number"
        value={qtyChange}
        onChange={(event) => onQtyChange(event.target.value)}
        helperText="Use a negative number to reduce stock."
      />
      <Input
        label="Note"
        value={note}
        onChange={(event) => onNoteChange(event.target.value)}
      />
      <Button onClick={onSubmit} loading={isAdjusting} className="w-full">
        {isAdjusting ? 'Saving...' : 'Apply Adjustment'}
      </Button>
    </div>
  </Modal>
);

export default AdjustStockModal;
