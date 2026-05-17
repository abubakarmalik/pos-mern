import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const UserForm = ({ form, isCreating, onChange, onSubmit }) => (
  <div className="rounded-xl bg-white p-6 shadow">
    <h2 className="text-lg font-semibold text-slate-800">New User</h2>
    <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
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
        <option value="ADMIN">Admin</option>
      </Select>
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={isCreating}>
          {isCreating ? 'Creating...' : 'Save User'}
        </Button>
      </div>
    </form>
  </div>
);

export default UserForm;
