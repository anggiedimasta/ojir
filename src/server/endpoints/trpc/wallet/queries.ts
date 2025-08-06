import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../../api/trpc";
import { transactions, wallets, banks } from "~/server/db/schema";
import { eq, and, gte, lte, desc, sql, asc, ilike, or, isNull, SQL, inArray } from "drizzle-orm";
import type { TransactionSummary } from "~/entities/types/wallet";

// Helper function to safely create OR conditions
const createOrCondition = (conditions: (SQL<unknown> | undefined)[]): SQL<unknown> | undefined => {
  const validConditions = conditions.filter(Boolean) as SQL<unknown>[];
  return validConditions.length > 0 ? or(...validConditions) : undefined;
};

// Helper function to safely create AND conditions
const createAndCondition = (conditions: (SQL<unknown> | undefined)[]): SQL<unknown> | undefined => {
  const validConditions = conditions.filter(Boolean) as SQL<unknown>[];
  return validConditions.length > 0 ? and(...validConditions) : undefined;
};

export const walletQueries = {
  // Get user wallets with bank information
  getWallets: protectedProcedure.query(async ({ ctx }) => {
    // Ensure user has an uncategorized wallet
    const uncategorizedWallet = await ctx.db
      .select()
      .from(wallets)
      .where(
        and(
          eq(wallets.userId, ctx.session.user.id),
          eq(wallets.name, 'Uncategorized')
        )
      )
      .limit(1);

    // Create uncategorized wallet if it doesn't exist
    if (!uncategorizedWallet[0]) {
      await ctx.db
        .insert(wallets)
        .values({
          userId: ctx.session.user.id,
          name: 'Uncategorized',
          type: 'debit',
          bankCode: 'unknown',
          balance: '0',
          currency: 'IDR',
          color: 'gray',
          icon: 'wallet',
          isDefault: false,
        });
    }

    const userWallets = await ctx.db
      .select({
        id: wallets.id,
        userId: wallets.userId,
        name: wallets.name,
        type: wallets.type,
        bankCode: wallets.bankCode,
        accountNumber: wallets.accountNumber,
        balance: wallets.balance,
        currency: wallets.currency,
        isActive: wallets.isActive,
        isDefault: wallets.isDefault,
        color: wallets.color,
        icon: wallets.icon,
        createdAt: wallets.createdAt,
        updatedAt: wallets.updatedAt,
        bank: {
          id: banks.id,
          code: banks.code,
          name: banks.name,
          displayName: banks.displayName,
          iconPath: banks.iconPath,
          isActive: banks.isActive,
          sortOrder: banks.sortOrder,
        },
      })
      .from(wallets)
      .leftJoin(banks, eq(wallets.bankCode, banks.code))
      .where(eq(wallets.userId, ctx.session.user.id))
      .orderBy(asc(wallets.isDefault), asc(wallets.name));

    return userWallets;
  }),

  // Get wallet with bank details
  getWalletWithBank: protectedProcedure
    .input(z.object({ walletId: z.string() }))
    .query(async ({ ctx, input }) => {
      const wallet = await ctx.db
        .select({
          wallet: wallets,
          bank: {
            id: banks.id,
            code: banks.code,
            name: banks.name,
            displayName: banks.displayName,
            iconPath: banks.iconPath,
            isActive: banks.isActive,
            sortOrder: banks.sortOrder,
          },
        })
        .from(wallets)
        .leftJoin(banks, eq(wallets.bankCode, banks.code))
        .where(
          and(
            eq(wallets.id, input.walletId),
            eq(wallets.userId, ctx.session.user.id)
          )
        )
        .limit(1);

      if (!wallet[0]) {
        throw new Error('Wallet not found');
      }

      return wallet[0];
    }),

  // Get transactions with filters
  getTransactions: protectedProcedure
    .input(z.object({
      walletId: z.string().optional(),
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      search: z.string().optional(),
      bankFilter: z.string().optional(),
      paymentMethodFilter: z.string().optional(),
      sortBy: z.enum(['date', 'amount', 'description']).default('date'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
    }))
    .query(async ({ ctx, input }) => {
      const conditions: SQL<unknown>[] = [eq(transactions.userId, ctx.session.user.id)];

      if (input.walletId) {
        conditions.push(eq(transactions.walletId, input.walletId));
      }

      if (input.startDate) {
        conditions.push(gte(transactions.transactionDate, new Date(input.startDate)));
      }

      if (input.endDate) {
        conditions.push(lte(transactions.transactionDate, new Date(input.endDate)));
      }

      if (input.search) {
        const searchCondition = or(
          ilike(transactions.recipient, `%${input.search}%`),
          ilike(transactions.location, `%${input.search}%`),
          ilike(transactions.transferPurpose, `%${input.search}%`)
        );
        if (searchCondition) {
          conditions.push(searchCondition);
        }
      }

      if (input.bankFilter) {
        conditions.push(eq(transactions.recipientBank, input.bankFilter));
      }

      if (input.paymentMethodFilter) {
        conditions.push(eq(transactions.transactionType, input.paymentMethodFilter));
      }

      const orderBy = input.sortOrder === 'desc' ? desc(transactions.transactionDate) : asc(transactions.transactionDate);

      const results = await ctx.db
        .select()
        .from(transactions)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(input.limit)
        .offset(input.offset);

      const total = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(transactions)
        .where(and(...conditions));

      return {
        transactions: results,
        total: total[0]?.count || 0,
        hasMore: results.length === input.limit,
      };
    }),

  // Get transaction by ID
  getTransactionById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const transaction = await ctx.db
        .select()
        .from(transactions)
        .where(
          and(
            eq(transactions.id, input.id),
            eq(transactions.userId, ctx.session.user.id)
          )
        )
        .limit(1);

      if (!transaction[0]) {
        throw new Error('Transaction not found');
      }

      return transaction[0];
    }),

  // Get wallet summary
  getSummary: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const conditions = [
        eq(transactions.userId, ctx.session.user.id),
        gte(transactions.transactionDate, new Date(input.startDate)),
        lte(transactions.transactionDate, new Date(input.endDate)),
      ];

      const summary = await ctx.db
        .select({
          totalIncome: sql<number>`COALESCE(SUM(CASE WHEN direction = 'in' THEN amount::numeric ELSE 0 END), 0)`,
          totalExpense: sql<number>`COALESCE(SUM(CASE WHEN direction = 'out' THEN amount::numeric ELSE 0 END), 0)`,
          transactionCount: sql<number>`COUNT(*)`,
        })
        .from(transactions)
        .where(and(...conditions));

      return {
        totalIncome: Number(summary[0]?.totalIncome || 0),
        totalExpense: Number(summary[0]?.totalExpense || 0),
        netAmount: Number(summary[0]?.totalIncome || 0) - Number(summary[0]?.totalExpense || 0),
        transactionCount: Number(summary[0]?.transactionCount || 0),
      };
    }),

  // Get banks
  getBanks: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db
      .select()
      .from(banks)
      .where(eq(banks.isActive, true))
      .orderBy(asc(banks.sortOrder), asc(banks.name));
  }),

  // Get payment methods
  getPaymentMethods: protectedProcedure.query(async ({ ctx }) => {
    // This would typically come from a payment_methods table
    // For now, returning a static list
    return [
      { id: 'cash', name: 'Cash', icon: 'cash' },
      { id: 'bank_transfer', name: 'Bank Transfer', icon: 'bank' },
      { id: 'credit_card', name: 'Credit Card', icon: 'credit-card' },
      { id: 'debit_card', name: 'Debit Card', icon: 'debit-card' },
      { id: 'ewallet', name: 'E-Wallet', icon: 'wallet' },
    ];
  }),

  // Get master data
  getMasterData: protectedProcedure.query(async ({ ctx }) => {
    const banksData = await ctx.db
      .select()
      .from(banks)
      .where(eq(banks.isActive, true))
      .orderBy(asc(banks.sortOrder), asc(banks.name));

    return {
      banks: banksData,
      paymentMethods: [
        { id: 'cash', name: 'Cash', icon: 'cash' },
        { id: 'bank_transfer', name: 'Bank Transfer', icon: 'bank' },
        { id: 'credit_card', name: 'Credit Card', icon: 'credit-card' },
        { id: 'debit_card', name: 'Debit Card', icon: 'debit-card' },
        { id: 'ewallet', name: 'E-Wallet', icon: 'wallet' },
      ],
    };
  }),
};