import Button from './Button';
import Modal from './Modal';

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  loadingLabel,
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
  onCancel,
  onConfirm,
  children,
}) => (
  <Modal open={open} title={title} onClose={onCancel} size="sm">
    <div className="space-y-4">
      {description && <p className="text-sm leading-6 text-slate-600">{description}</p>}
      {children}
      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm} loading={loading}>
          {loading && loadingLabel ? loadingLabel : confirmLabel}
        </Button>
      </div>
    </div>
  </Modal>
);

export default ConfirmDialog;
