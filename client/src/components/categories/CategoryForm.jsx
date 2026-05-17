import Button from '../ui/Button';
import FormSection from '../ui/FormSection';
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
  <FormSection
    title={isEdit ? 'Edit Category' : 'New Category'}
    description="Category names appear in filters, product forms, and reports."
  >
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
        <Button type="submit" loading={isSaving}>
          {isSaving ? (isEdit ? 'Updating...' : 'Creating...') : 'Save Category'}
        </Button>
      </div>
    </form>
  </FormSection>
);

export default CategoryForm;
