import { createTRPCRouter } from "../../../api/trpc";
import { walletQueries } from "./queries";
import { walletMutations } from "./mutations";

export const walletRouter = createTRPCRouter({
  // Queries
  getAll: walletQueries.getWallets,
  getById: walletQueries.getWalletWithBank,
  getTransactions: walletQueries.getTransactions,
  getTransactionById: walletQueries.getTransactionById,
  getSummary: walletQueries.getSummary,
  getTransactionSummary: walletQueries.getSummary, // Alias for consistency
  getBanks: walletQueries.getBanks,
  getPaymentMethods: walletQueries.getPaymentMethods,
  getMasterData: walletQueries.getMasterData,

  // Mutations
  create: walletMutations.create,
  update: walletMutations.update,
  delete: walletMutations.delete,
  createTransaction: walletMutations.createTransaction,
  updateTransaction: walletMutations.updateTransaction,
  deleteTransaction: walletMutations.deleteTransaction,
  bulkUpdateTransactions: walletMutations.bulkUpdateTransactions,
});