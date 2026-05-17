import Button from '../ui/Button';
import Input from '../ui/Input';
import Modal from '../ui/Modal';
import Select from '../ui/Select';

const UserFormModal = ({
  form,
  isCreating,
  onChange,
  onClose,
  onSubmit,
  open,
}) => (
  <Modal open={open} title="Create User" onClose={onClose}>
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={onChange}
        required
      />
      <Input
        label="Username"
        name="username"
        value={form.username}
        onChange={onChange}
        required
      />
      <Input
        label="Password"
        name="password"
        type="password"
        value={form.password}
        onChange={onChange}
        required
      />
      <Select label="Role" name="role" value={form.role} onChange={onChange}>
        <option value="CASHIER">Cashier</option>
        <option value="ADMIN" disabled>
          Admin
        </option>
      </Select>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  </Modal>
);

export default UserFormModal;
