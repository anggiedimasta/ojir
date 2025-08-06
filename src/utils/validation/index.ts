// Validation utility functions
// TODO: Move validation-related utilities here

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidCurrency = (amount: string): boolean => {
  const currencyRegex = /^\d+(\.\d{1,2})?$/;
  return currencyRegex.test(amount);
};