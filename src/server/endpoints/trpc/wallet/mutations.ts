import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../../api/trpc";
import { transactions, wallets } from "~/server/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { sql } from "drizzle-orm";

// Custom error class for auth errors that should trigger sign-out
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const walletMutations = {
  // Create wallet
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      type: z.enum(['debit', 'credit', 'savings']),
      bankCode: z.string(),
      accountNumber: z.string().optional(),
      balance: z.string(),
      currency: z.string().default('IDR'),
      color: z.string().default('blue'),
      icon: z.string().default('wallet'),
      isDefault: z.boolean().default(false),
    }))
    .mutation(async ({ ctx, input }) => {
      // If this is set as default, unset other defaults
      if (input.isDefault) {
        await ctx.db
          .update(wallets)
          .set({ isDefault: false })
          .where(
            and(
              eq(wallets.userId, ctx.session.user.id),
              eq(wallets.isDefault, true)
            )
          );
      }

      const newWallet = await ctx.db
        .insert(wallets)
        .values({
          userId: ctx.session.user.id,
          name: input.name,
          type: input.type,
          bankCode: input.bankCode,
          accountNumber: input.accountNumber,
          balance: input.balance,
          currency: input.currency,
          color: input.color,
          icon: input.icon,
          isDefault: input.isDefault,
        })
        .returning();

      return newWallet[0];
    }),

  // Update wallet
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1).optional(),
      type: z.enum(['debit', 'credit', 'savings']).optional(),
      bankCode: z.string().optional(),
      accountNumber: z.string().optional(),
      balance: z.string().optional(),
      currency: z.string().optional(),
      color: z.string().optional(),
      icon: z.string().optional(),
      isDefault: z.boolean().optional(),
      isActive: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // If this is set as default, unset other defaults
      if (updateData.isDefault) {
        await ctx.db
          .update(wallets)
          .set({ isDefault: false })
          .where(
            and(
              eq(wallets.userId, ctx.session.user.id),
              eq(wallets.isDefault, true),
              eq(wallets.id, id)
            )
          );
      }

      const updatedWallet = await ctx.db
        .update(wallets)
        .set(updateData)
        .where(
          and(
            eq(wallets.id, id),
            eq(wallets.userId, ctx.session.user.id)
          )
        )
        .returning();

      const wallet = updatedWallet[0];
      if (!wallet) {
        throw new Error('Wallet not found');
      }

      return wallet;
    }),

  // Delete wallet
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if wallet has transactions
      const transactionCount = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(transactions)
        .where(
          and(
            eq(transactions.walletId, input.id),
            eq(transactions.userId, ctx.session.user.id)
          )
        );

      const count = transactionCount[0]?.count;
      if (count && Number(count) > 0) {
        throw new Error('Cannot delete wallet with existing transactions');
      }

      const deletedWallet = await ctx.db
        .delete(wallets)
        .where(
          and(
            eq(wallets.id, input.id),
            eq(wallets.userId, ctx.session.user.id)
          )
        )
        .returning();

      if (!deletedWallet[0]) {
        throw new Error('Wallet not found');
      }

      return deletedWallet[0];
    }),

  // Create transaction
  createTransaction: protectedProcedure
    .input(z.object({
      walletId: z.string(),
      amount: z.string(),
      direction: z.enum(['in', 'out']),
      recipient: z.string(),
      location: z.string().optional(),
      transactionDate: z.string(),
      fee: z.string().optional(),
      totalAmount: z.string().optional(),
      currency: z.string().optional(),
      transactionRefNo: z.string().optional(),
      qrisRefNo: z.string().optional(),
      merchantPan: z.string().optional(),
      customerPan: z.string().optional(),
      acquirer: z.string().optional(),
      terminalId: z.string().optional(),
      sourceOfFund: z.string().optional(),
      sourceAccount: z.string().optional(),
      recipientBank: z.string().optional(),
      recipientBankAccount: z.string().optional(),
      transferPurpose: z.string().optional(),
      bankSender: z.string().optional(),
      emailSubject: z.string().optional(),
      transactionType: z.string().optional(),
      status: z.string().optional(),
      virtualAccountNo: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const newTransaction = await ctx.db
        .insert(transactions)
        .values({
          userId: ctx.session.user.id,
          walletId: input.walletId,
          amount: input.amount,
          direction: input.direction,
          recipient: input.recipient,
          location: input.location,
          transactionDate: new Date(input.transactionDate),
          fee: input.fee || "0.00",
          totalAmount: input.totalAmount || input.amount,
          currency: input.currency || "IDR",
          transactionRefNo: input.transactionRefNo,
          qrisRefNo: input.qrisRefNo,
          merchantPan: input.merchantPan,
          customerPan: input.customerPan,
          acquirer: input.acquirer,
          terminalId: input.terminalId,
          sourceOfFund: input.sourceOfFund,
          sourceAccount: input.sourceAccount,
          recipientBank: input.recipientBank,
          recipientBankAccount: input.recipientBankAccount,
          transferPurpose: input.transferPurpose,
          bankSender: input.bankSender,
          emailSubject: input.emailSubject,
          transactionType: input.transactionType,
          status: input.status,
          virtualAccountNo: input.virtualAccountNo,
        })
        .returning();

      return newTransaction[0];
    }),

  // Update transaction
  updateTransaction: protectedProcedure
    .input(z.object({
      id: z.string(),
      walletId: z.string().optional(),
      amount: z.string().optional(),
      direction: z.enum(['in', 'out']).optional(),
      recipient: z.string().optional(),
      location: z.string().optional(),
      transactionDate: z.string().optional(),
      fee: z.string().optional(),
      totalAmount: z.string().optional(),
      currency: z.string().optional(),
      transactionRefNo: z.string().optional(),
      qrisRefNo: z.string().optional(),
      merchantPan: z.string().optional(),
      customerPan: z.string().optional(),
      acquirer: z.string().optional(),
      terminalId: z.string().optional(),
      sourceOfFund: z.string().optional(),
      sourceAccount: z.string().optional(),
      recipientBank: z.string().optional(),
      recipientBankAccount: z.string().optional(),
      transferPurpose: z.string().optional(),
      bankSender: z.string().optional(),
      emailSubject: z.string().optional(),
      transactionType: z.string().optional(),
      status: z.string().optional(),
      virtualAccountNo: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, transactionDate, ...updateData } = input;

      const finalUpdateData = {
        ...updateData,
        ...(transactionDate && { transactionDate: new Date(transactionDate) }),
      };

      const updatedTransaction = await ctx.db
        .update(transactions)
        .set(finalUpdateData)
        .where(
          and(
            eq(transactions.id, id),
            eq(transactions.userId, ctx.session.user.id)
          )
        )
        .returning();

      if (!updatedTransaction[0]) {
        throw new Error('Transaction not found');
      }

      return updatedTransaction[0];
    }),

  // Delete transaction
  deleteTransaction: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedTransaction = await ctx.db
        .delete(transactions)
        .where(
          and(
            eq(transactions.id, input.id),
            eq(transactions.userId, ctx.session.user.id)
          )
        )
        .returning();

      if (!deletedTransaction[0]) {
        throw new Error('Transaction not found');
      }

      return deletedTransaction[0];
    }),

  // Bulk update transactions
  bulkUpdateTransactions: protectedProcedure
    .input(z.object({
      ids: z.array(z.string()),
      updates: z.object({
        recipient: z.string().optional(),
        location: z.string().optional(),
        sourceOfFund: z.string().optional(),
        transferPurpose: z.string().optional(),
        status: z.string().optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const updatedTransactions = await ctx.db
        .update(transactions)
        .set(input.updates)
        .where(
          and(
            inArray(transactions.id, input.ids),
            eq(transactions.userId, ctx.session.user.id)
          )
        )
        .returning();

      return updatedTransactions;
    }),
};