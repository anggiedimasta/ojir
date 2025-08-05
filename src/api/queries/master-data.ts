import { trpc } from '../trpc/client';

/**
 * Master Data Queries
 * Organized collection of all master-data-related tRPC queries
 */

// Get all master data
export const useMasterData = () => {
  return trpc.masterData.getAll.useQuery();
};

// Get banks
export const useBanks = () => {
  return trpc.masterData.getBanks.useQuery();
};

// Get payment methods
export const usePaymentMethods = () => {
  return trpc.masterData.getPaymentMethods.useQuery();
};

// Get transaction categories
export const useTransactionCategories = () => {
  return trpc.masterData.getTransactionCategories.useQuery();
};

// Get currencies
export const useCurrencies = () => {
  return trpc.masterData.getCurrencies.useQuery();
};

// Get countries
export const useCountries = () => {
  return trpc.masterData.getCountries.useQuery();
};