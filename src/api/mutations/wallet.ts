import { trpc } from '../trpc/client';
import type {
  CreateWalletInput,
  UpdateWalletInput,
  CreateTransactionInput,
  SyncEmailsInput
} from '@/entities/types/wallet';

/**
 * Wallet Mutations
 * Organized collection of all wallet-related tRPC mutations
 */

// Create wallet
export const useCreateWallet = () => {
  return trpc.wallet.create.useMutation();
};

// Update wallet
export const useUpdateWallet = () => {
  return trpc.wallet.update.useMutation();
};

// Delete wallet
export const useDeleteWallet = () => {
  return trpc.wallet.delete.useMutation();
};

// Create transaction
export const useCreateTransaction = () => {
  return trpc.wallet.createTransaction.useMutation();
};

// Update transaction
export const useUpdateTransaction = () => {
  return trpc.wallet.updateTransaction.useMutation();
};

// Delete transaction
export const useDeleteTransaction = () => {
  return trpc.wallet.deleteTransaction.useMutation();
};

// Bulk update transactions
export const useBulkUpdateTransactions = () => {
  return trpc.wallet.bulkUpdateTransactions.useMutation();
};

// Sync emails
export const useSyncEmails = () => {
  return trpc.wallet.syncEmails.useMutation();
};

// Sync Gmail
export const useSyncGmail = () => {
  return trpc.wallet.syncGmail.useMutation();
};