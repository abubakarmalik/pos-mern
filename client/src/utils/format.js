export const formatCurrency = (valueCents, currencySymbol = '$') => {
  const amount = (valueCents || 0) / 100;
  return `${currencySymbol}${amount.toFixed(2)}`;
};

export const toCents = (value) => {
  if (value === '' || value == null) return 0;
  return Math.round(Number(value) * 100);
};
