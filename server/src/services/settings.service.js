const settingsRepository = require('../repositories/settings.repository');
const { mapSettings } = require('../utils/settingsMapper');

const defaultSettings = {
  shop_name: 'My Shop',
  address: '',
  phone: '',
  currency_symbol: 'PKR',
  allow_negative_stock: false,
};

const toSettingsData = (payload = {}) => {
  const data = {};

  if (payload.shopName !== undefined) data.shop_name = payload.shopName;
  if (payload.address !== undefined) data.address = payload.address;
  if (payload.phone !== undefined) data.phone = payload.phone;
  if (payload.currencySymbol !== undefined) {
    data.currency_symbol = payload.currencySymbol;
  }
  if (payload.allowNegativeStock !== undefined) {
    data.allow_negative_stock = payload.allowNegativeStock;
  }

  return data;
};

const ensureSettings = async () => {
  const existing = await settingsRepository.find();
  if (existing) return existing;
  return settingsRepository.create(defaultSettings);
};

const getSettings = async () => mapSettings(await ensureSettings());

const updateSettings = async (payload) => {
  await ensureSettings();
  const settings = await settingsRepository.update(toSettingsData(payload));
  return mapSettings(settings);
};

module.exports = { getSettings, updateSettings };
