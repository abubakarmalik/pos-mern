import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';

const RefundModal = ({
  isRefunding,
  onClose,
  onReasonChange,
  onSubmit,
  open,
  reason,
}) => (
  <Modal open={open} title="Process Refund" onClose={onClose}>
    <div className="space-y-4">
      <Input
        label="Reason"
        value={reason}
        onChange={(event) => onReasonChange(event.target.value)}
        required
      />
      <Button
        variant="danger"
        className="w-full"
        onClick={onSubmit}
        disabled={isRefunding}
      >
        {isRefunding ? 'Processing...' : 'Confirm Refund'}
      </Button>
    </div>
  </Modal>
);

export default RefundModal;
