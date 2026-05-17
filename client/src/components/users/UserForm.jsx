import Button from '../ui/Button';
import FormSection from '../ui/FormSection';
import Input from '../ui/Input';
import Select from '../ui/Select';

const UserForm = ({ form, isCreating, onChange, onSubmit }) => (
  <FormSection
    title="New User"
    description="Create staff access with the correct operational role."
  >
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
        <Button type="submit" loading={isCreating}>
          {isCreating ? 'Creating...' : 'Save User'}
        </Button>
      </div>
    </form>
  </FormSection>
);

export default UserForm;
