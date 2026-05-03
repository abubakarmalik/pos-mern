import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { fetchSettings, updateSettings } from '../features/settings/settingsSlice';
import {
  selectSettings,
  selectSettingsSaving,
} from '../features/settings/selectors';

const SettingsPage = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectSettings);
  const isSaving = useSelector(selectSettingsSaving);
  const [form, setForm] = useState({
    shopName: '',
    address: '',
    phone: '',
    currencySymbol: 'PKR',
    allowNegativeStock: false,
  });

  useEffect(() => {
    dispatch(fetchSettings())
      .unwrap()
      .catch((error) => toast.error(error.message));
  }, [dispatch]);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    dispatch(updateSettings({
      ...form,
      allowNegativeStock: form.allowNegativeStock === 'true' || form.allowNegativeStock === true,
    }))
      .unwrap()
      .then(() => toast.success('Settings updated'))
      .catch((error) => toast.error(error.message));
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
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
