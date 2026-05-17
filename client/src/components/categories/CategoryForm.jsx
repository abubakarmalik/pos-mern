import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

const CategoryForm = ({
  form,
  isEdit,
  isSaving,
  onChange,
  onStatusChange,
  onSubmit,
}) => (
  <div className="rounded-xl bg-white p-6 shadow">
    <h2 className="text-lg font-semibold text-slate-800">
      {isEdit ? 'Edit Category' : 'New Category'}
    </h2>
    <form onSubmit={onSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={onChange}
        required
      />
      <Select
        label="Status"
        name="isActive"
        value={form.isActive ? 'true' : 'false'}
        onChange={(event) => onStatusChange(event.target.value === 'true')}
      >
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </Select>
      <Input
        label="Description"
        name="description"
        value={form.description}
        onChange={onChange}
        className="md:col-span-2"
      />
      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Category'}
        </Button>
      </div>
    </form>
  </div>
);

export default CategoryForm;
