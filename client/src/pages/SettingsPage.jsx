import { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { apiFetch } from '../api/client';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';

const SettingsPage = () => {
  const [form, setForm] = useState({
    shopName: '',
    address: '',
    phone: '',
    currencySymbol: 'PKR',
    allowNegativeStock: false,
  });

  const { data: settingsData } = useQuery({
    queryKey: ['settings'],
    queryFn: () => apiFetch('/settings'),
  });

  useEffect(() => {
    if (settingsData?.data) {
      setForm(settingsData.data);
    }
  }, [settingsData]);

  const mutation = useMutation({
    mutationFn: (payload) => apiFetch('/settings', { method: 'PATCH', body: payload }),
    onSuccess: () => toast.success('Settings updated'),
    onError: (error) => toast.error(error.message),
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate({
      ...form,
      allowNegativeStock: form.allowNegativeStock === 'true' || form.allowNegativeStock === true,
    });
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-lg font-semibold text-slate-800">Settings</h2>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 md:grid-cols-2">
        <Input label="Shop Name" name="shopName" value={form.shopName} onChange={handleChange} />
        <Input label="Phone" name="phone" value={form.phone} onChange={handleChange} />
        <Input label="Address" name="address" value={form.address} onChange={handleChange} />
        <Input label="Currency Symbol" name="currencySymbol" value={form.currencySymbol} onChange={handleChange} />
        <Select
          label="Allow Negative Stock"
          name="allowNegativeStock"
          value={form.allowNegativeStock ? 'true' : 'false'}
          onChange={handleChange}
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </Select>
        <div className="md:col-span-2 flex justify-end">
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
