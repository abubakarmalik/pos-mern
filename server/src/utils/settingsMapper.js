const mapSettings = (settings) => {
  if (!settings) return null;

  return {
    id: settings.id,
    shopName: settings.shop_name,
    address: settings.address,
    phone: settings.phone,
    currencySymbol: settings.currency_symbol,
    allowNegativeStock: settings.allow_negative_stock,
    createdAt: settings.created_at,
    updatedAt: settings.updated_at,
  };
};

module.exports = { mapSettings };
