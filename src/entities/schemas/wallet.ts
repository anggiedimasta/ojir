// Wallet Zod schemas for validation

import { z } from 'zod';

// Base schemas
export const WalletTypeSchema = z.enum(['debit', 'credit', 'savings', 'current', 'investment']);
export const TransactionDirectionSchema = z.enum(['in', 'out']);
export const TransactionTypeSchema = z.enum(['transfer', 'payment', 'withdrawal', 'deposit', 'qris', 'virtual-account']);
export const TransactionStatusSchema = z.enum(['pending', 'completed', 'failed', 'cancelled']);
export const CurrencySchema = z.enum(['IDR', 'USD', 'EUR', 'GBP', 'JPY', 'SGD', 'MYR', 'THB', 'PHP', 'VND']);

// Date filter schema
export const DateFilterTypeSchema = z.enum(['all', 'current-month', 'last-month', 'current-week', 'current-day', 'custom']);

// Sort schemas
export const SortByTypeSchema = z.enum(['date', 'amount', 'recipient']);
export const SortOrderTypeSchema = z.enum(['asc', 'desc']);

// Bank filter schemas
export const BankFilterTypeSchema = z.enum(['all', 'mandiri', 'bca', 'bni', 'bri', 'cimb', 'other']);
export const PaymentMethodFilterTypeSchema = z.enum(['all', 'qris', 'transfer', 'virtual-account', 'bi-fast', 'other']);

// Bank schema
export const BankSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1),
  name: z.string().min(1),
  displayName: z.string().min(1),
  iconPath: z.string().nullable(),
  isActive: z.boolean(),
  sortOrder: z.number().int().positive(),
});

// Wallet payment method schema
export const WalletPaymentMethodSchema = z.object({
  id: z.string().uuid(),
  code: z.string().min(1),
  name: z.string().min(1),
  displayName: z.string().min(1),
  description: z.string().optional(),
  iconPath: z.string().optional(),
  isActive: z.boolean(),
  sortOrder: z.number().int().positive(),
});

// Wallet schema
export const WalletSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  name: z.string().min(1).max(100),
  type: WalletTypeSchema,
  bankCode: z.string().min(1),
  accountNumber: z.string().optional(),
  balance: z.string(), // Decimal as string
  currency: CurrencySchema,
  isActive: z.boolean(),
  isDefault: z.boolean(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  icon: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Wallet with bank schema
export const WalletWithBankSchema = WalletSchema.extend({
  bank: BankSchema.nullable(),
});

// Create wallet input schema
export const CreateWalletInputSchema = z.object({
  name: z.string().min(1).max(100),
  type: WalletTypeSchema,
  bankCode: z.string().min(1),
  accountNumber: z.string().optional(),
  balance: z.number().positive().optional(),
  currency: CurrencySchema.optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  isDefault: z.boolean().optional(),
});

// Update wallet input schema
export const UpdateWalletInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  type: WalletTypeSchema.optional(),
  bankCode: z.string().min(1).optional(),
  accountNumber: z.string().optional(),
  balance: z.number().positive().optional(),
  currency: CurrencySchema.optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// Database transaction schema
export const DatabaseTransactionSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  recipient: z.string().min(1),
  location: z.string().nullable(),
  transactionDate: z.date(),
  amount: z.string(), // Decimal as string
  fee: z.string(), // Decimal as string
  totalAmount: z.string(), // Decimal as string
  currency: CurrencySchema,
  transactionRefNo: z.string().nullable(),
  qrisRefNo: z.string().nullable(),
  merchantPan: z.string().nullable(),
  customerPan: z.string().nullable(),
  acquirer: z.string().nullable(),
  terminalId: z.string().nullable(),
  sourceOfFund: z.string().nullable(),
  sourceAccount: z.string().nullable(),
  recipientBank: z.string().nullable(),
  recipientBankAccount: z.string().nullable(),
  transferPurpose: z.string().nullable(),
  bankSender: z.string().nullable(),
  emailSubject: z.string().nullable(),
  transactionType: z.string().nullable(),
  status: z.string().nullable(),
  direction: TransactionDirectionSchema,
  virtualAccountNo: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

// Transaction response schema
export const TransactionResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  walletId: z.string().uuid(),
  transactionRefNo: z.string().nullable(),
  qrisRefNo: z.string().nullable(),
  merchantPan: z.string().nullable(),
  customerPan: z.string().nullable(),
  terminalId: z.string().nullable(),
  recipient: z.string().nullable(),
  location: z.string().nullable(),
  amount: z.string(), // Decimal as string
  fee: z.string(), // Decimal as string
  totalAmount: z.string(), // Decimal as string
  currency: CurrencySchema,
  transactionDate: z.date(),
  sourceOfFund: z.string().nullable(),
  sourceAccount: z.string().nullable(),
  recipientBank: z.string().nullable(),
  recipientBankAccount: z.string().nullable(),
  transferPurpose: z.string().nullable(),
  acquirer: z.string().nullable(),
  bankSender: z.string().nullable(),
  emailSubject: z.string().nullable(),
  transactionType: z.string().nullable(),
  direction: z.string(),
  status: z.string().nullable(),
  virtualAccountNo: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
  // Wallet information
  walletName: z.string().nullable(),
  walletType: z.string().nullable(),
  walletBankCode: z.string().nullable(),
  walletBankName: z.string().nullable(),
  walletColor: z.string().nullable(),
});

// Create transaction input schema
export const CreateTransactionInputSchema = z.object({
  recipient: z.string().min(1),
  location: z.string().optional(),
  amount: z.number().positive(),
  fee: z.number().nonnegative().optional(),
  totalAmount: z.number().positive().optional(),
  currency: CurrencySchema.optional(),
  transactionDate: z.date().optional(),
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
  direction: TransactionDirectionSchema.optional(),
  virtualAccountNo: z.string().optional(),
});

// Sync emails input schema
export const SyncEmailsInputSchema = z.object({
  maxResults: z.number().int().positive().max(100).optional(),
  pageToken: z.string().optional(),
  labelIds: z.array(z.string()).optional(),
  query: z.string().optional(),
});

// Wallet summary schema
export const WalletSummarySchema = z.object({
  walletId: z.string().uuid(),
  walletName: z.string().min(1),
  bankName: z.string().min(1),
  totalIncome: z.number().nonnegative(),
  totalExpense: z.number().nonnegative(),
  transactionCount: z.number().int().nonnegative(),
  balance: z.number(),
});

// Transaction summary schema
export const TransactionSummarySchema = z.object({
  totalIncome: z.number().nonnegative(),
  totalExpense: z.number().nonnegative(),
  transactionCount: z.number().int().nonnegative(),
  topMerchants: z.array(z.object({
    recipient: z.string().min(1),
    totalAmount: z.number().positive(),
    count: z.number().int().positive(),
  })),
  monthlyTrend: z.array(z.object({
    month: z.string().min(1),
    income: z.number().nonnegative(),
    expense: z.number().nonnegative(),
  })),
});

// Email transaction data schema
export const EmailTransactionDataSchema = z.object({
  recipient: z.string().min(1),
  location: z.string().min(1),
  transactionDate: z.date(),
  amount: z.number().positive(),
  fee: z.number().nonnegative(),
  totalAmount: z.number().positive(),
  currency: CurrencySchema,
  transactionRefNo: z.string().min(1),
  qrisRefNo: z.string().optional(),
  merchantPan: z.string().optional(),
  customerPan: z.string().optional(),
  acquirer: z.string().optional(),
  terminalId: z.string().optional(),
  sourceOfFund: z.string().min(1),
  sourceAccount: z.string().min(1),
  recipientBank: z.string().min(1),
  recipientBankAccount: z.string().min(1),
  transferPurpose: z.string().min(1),
  bankSender: z.string().min(1),
  emailSubject: z.string().min(1),
  transactionType: z.string().min(1),
  status: z.string().min(1),
  direction: TransactionDirectionSchema,
  virtualAccountNo: z.string().optional(),
  serviceProvider: z.string().optional(),
  accountNumber: z.string().optional(),
});

// Parsed transaction schema
export const ParsedTransactionSchema = z.object({
  recipient: z.string().min(1),
  location: z.string().min(1),
  transactionDate: z.date(),
  amount: z.number().positive(),
  currency: CurrencySchema,
  transactionRefNo: z.string().min(1),
  qrisRefNo: z.string().optional(),
  merchantPan: z.string().optional(),
  customerPan: z.string().optional(),
  acquirer: z.string().optional(),
  terminalId: z.string().optional(),
  sourceOfFund: z.string().min(1),
  sourceAccount: z.string().min(1),
  bankSender: z.string().min(1),
  emailSubject: z.string().min(1),
  transactionType: z.string().min(1),
  status: z.string().min(1),
  direction: TransactionDirectionSchema,
  virtualAccountNo: z.string().optional(),
});

// Gmail message schema
export const GmailMessageSchema = z.object({
  id: z.string().min(1),
  threadId: z.string().min(1),
  labelIds: z.array(z.string()),
  snippet: z.string(),
  payload: z.object({
    partId: z.string(),
    mimeType: z.string(),
    filename: z.string(),
    headers: z.array(z.object({
      name: z.string(),
      value: z.string(),
    })),
    body: z.object({
      size: z.number().int().nonnegative(),
      data: z.string().optional(),
    }),
    parts: z.array(z.object({
      partId: z.string(),
      mimeType: z.string(),
      filename: z.string(),
      body: z.object({
        size: z.number().int().nonnegative(),
        data: z.string().optional(),
      }),
      parts: z.array(z.object({
        partId: z.string(),
        mimeType: z.string(),
        filename: z.string(),
        body: z.object({
          size: z.number().int().nonnegative(),
          data: z.string().optional(),
        }),
      })).optional(),
    })).optional(),
  }),
  sizeEstimate: z.number().int().nonnegative(),
  historyId: z.string().min(1),
  internalDate: z.string().min(1),
});

// Transaction filters schema
export const TransactionFiltersSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  bankSender: z.string().optional(),
  transactionType: z.string().optional(),
  status: z.string().optional(),
  minAmount: z.number().positive().optional(),
  maxAmount: z.number().positive().optional(),
  searchQuery: z.string().optional(),
  recipientBank: BankFilterTypeSchema.optional(),
  paymentMethod: PaymentMethodFilterTypeSchema.optional(),
  walletId: z.string().uuid().optional(),
  sortBy: SortByTypeSchema.optional(),
  sortOrder: SortOrderTypeSchema.optional(),
  limit: z.number().int().positive().max(100).optional(),
  offset: z.number().int().nonnegative().optional(),
});

// Date range schema
export const DateRangeSchema = z.object({
  startDate: z.date().optional(),
  endDate: z.date().optional(),
}); 