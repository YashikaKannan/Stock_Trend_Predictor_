// A small reusable currency formatter for Indian Rupees (INR)
// Usage: import { formatINR } from '../utils/currency';

export function formatINR(value, { minimumFractionDigits = 2, maximumFractionDigits = 2 } = {}) {
  if (value === null || value === undefined) return 'N/A';
  const num = Number(value);
  if (!isFinite(num)) return 'N/A';

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    currencyDisplay: 'symbol',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
}

export default formatINR;