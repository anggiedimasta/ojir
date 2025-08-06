// Static data constants

export const SUPPORTED_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
] as const;

export const TRANSACTION_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Business',
  'Investment',
  'Other',
] as const;

export const PAYMENT_METHODS = [
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Cash',
  'Digital Wallet',
  'Check',
  'Other',
] as const;

export const DATE_FILTER_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'current-day', label: 'Today' },
  { value: 'current-week', label: 'This Week' },
  { value: 'current-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'custom', label: 'Custom Range' },
] as const;

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;