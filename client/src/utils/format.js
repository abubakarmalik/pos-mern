export const formatCurrency = (amount, currencySymbol = 'PKR') => {
  const safeAmount = Number(amount ?? 0);
  const formatted = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: safeAmount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
  return currencySymbol ? `${currencySymbol} ${formatted}` : formatted;
};
