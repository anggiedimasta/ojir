import { trpc } from '../trpc/client';
import type { TransactionFilters, DateRange } from '@/entities/types/wallet';

/**
 * Wallet Queries
 * Organized collection of all wallet-related tRPC queries
 */

// Get all wallets
export const useWallets = () => {
  return trpc.wallet.getAll.useQuery();
};

// Get wallet by ID
export const useWallet = (id: string) => {
  return trpc.wallet.getById.useQuery({ id });
};

// Get transactions with filters
export const useTransactions = (filters: TransactionFilters) => {
  return trpc.wallet.getTransactions.useQuery(filters);
};

// Get transaction by ID
export const useTransaction = (id: string) => {
  return trpc.wallet.getTransactionById.useQuery({ id });
};

// Get wallet summary
export const useWalletSummary = (dateRange: DateRange) => {
  return trpc.wallet.getSummary.useQuery(dateRange);
};

// Get transaction summary
export const useTransactionSummary = (dateRange: DateRange) => {
  return trpc.wallet.getTransactionSummary.useQuery(dateRange);
};

// Get banks
export const useBanks = () => {
  return trpc.wallet.getBanks.useQuery();
};

// Get payment methods
export const usePaymentMethods = () => {
  return trpc.wallet.getPaymentMethods.useQuery();
};

// Get master data
export const useMasterData = () => {
  return trpc.wallet.getMasterData.useQuery();
}; 