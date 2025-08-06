// Wallet Queries
// This file contains all wallet-related query hooks

import { api } from '~/utils/api';
import type { TransactionFilters } from '~/entities/types/wallet';

// Get all transactions query
export const useTransactions = (filters?: TransactionFilters) => {
  return api.wallet.getTransactions.useQuery(filters || {});
};

// Get single transaction query
export const useTransaction = (id: string) => {
  return api.wallet.getTransaction.useQuery({ id });
};

// Get all wallets query
export const useWallets = () => {
  return api.wallet.getAll.useQuery();
};

// Get single wallet query
export const useWallet = (id: string) => {
  return api.wallet.getById.useQuery({ walletId: id });
};

// Get wallet balance query
export const useWalletBalance = (id: string) => {
  return api.wallet.getWalletBalance.useQuery({ id });
};

// Get wallet stats query
export const useWalletStats = (id: string) => {
  return api.wallet.getWalletStats.useQuery({ id });
};

// Get transaction stats query
export const useTransactionStats = (filters?: TransactionFilters) => {
  return api.wallet.getTransactionStats.useQuery(filters || {});
};

// Get transaction summary query
export const useTransactionSummary = (filters?: TransactionFilters) => {
  return api.wallet.getSummary.useQuery(filters || {});
};

// Get banks query
export const useBanks = () => {
  return api.wallet.getBanks.useQuery();
};

// Get payment methods query
export const usePaymentMethods = () => {
  return api.wallet.getPaymentMethods.useQuery();
};