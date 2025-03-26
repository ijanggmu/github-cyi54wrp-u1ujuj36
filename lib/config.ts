export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const config = {
  currency: {
    code: 'NPR',
    symbol: 'रू',
    format: formatCurrency,
  },
  date: {
    format: 'YYYY-MM-DD HH:mm',
  },
  pagination: {
    defaultPageSize: 10,
    maxPageSize: 100,
  },
}; 