// Wallet types

// Filter types
export type DateFilterType = 'all' | 'current-month' | 'last-month' | 'current-week' | 'current-day' | 'custom';
export type SortByType = 'date' | 'amount' | 'recipient';
export type SortOrderType = 'asc' | 'desc';
export type TransactionDirection = 'in' | 'out';

// Bank and payment method filter types
export type BankFilterType = 'all' | 'mandiri' | 'bca' | 'bni' | 'bri' | 'cimb' | 'other';
export type PaymentMethodFilterType = 'all' | 'qris' | 'transfer' | 'virtual-account' | 'bi-fast' | 'other';

// Multiple selection types - always use arrays
export type BankFilterValue = BankFilterType[];
export type PaymentMethodFilterValue = PaymentMethodFilterType[];

// Wallet types
export type WalletType = 'debit' | 'credit' | 'savings' | 'current' | 'investment';

// Transaction types
export type TransactionType = 'transfer' | 'payment' | 'withdrawal' | 'deposit' | 'qris' | 'virtual-account';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

// Amount types (using string to avoid precision issues)
export type Amount = string;
export type Currency = 'IDR' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'SGD' | 'MYR' | 'THB' | 'PHP' | 'VND';

// Date range type
export type WalletDateRange = {
  startDate?: Date;
  endDate?: Date;
};

// Pagination types
export type PaginationParams = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

// Filter types
export type TransactionFilters = {
  startDate?: Date;
  endDate?: Date;
  bankSender?: string;
  transactionType?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  searchQuery?: string;
  recipientBank?: BankFilterType;
  paymentMethod?: PaymentMethodFilterType;
  walletId?: string;
  sortBy?: SortByType;
  sortOrder?: SortOrderType;
  limit?: number;
  offset?: number;
};

// Input types
export type CreateWalletInput = {
  name: string;
  type: WalletType;
  bankCode: string;
  accountNumber?: string;
  balance?: number;
  currency?: string;
  color?: string;
  isDefault?: boolean;
};

export type UpdateWalletInput = {
  id: string;
  name?: string;
  type?: WalletType;
  bankCode?: string;
  accountNumber?: string;
  balance?: number;
  currency?: string;
  color?: string;
  isActive?: boolean;
  isDefault?: boolean;
};

export type CreateTransactionInput = {
  recipient: string;
  location?: string;
  amount: number;
  fee?: number;
  totalAmount?: number;
  currency?: string;
  transactionDate?: Date;
  transactionRefNo?: string;
  qrisRefNo?: string;
  merchantPan?: string;
  customerPan?: string;
  acquirer?: string;
  terminalId?: string;
  sourceOfFund?: string;
  sourceAccount?: string;
  recipientBank?: string;
  recipientBankAccount?: string;
  transferPurpose?: string;
  bankSender?: string;
  emailSubject?: string;
  transactionType?: string;
  status?: string;
  direction?: "in" | "out";
  virtualAccountNo?: string;
};

export type UpdateTransactionInput = {
  id: string;
  recipient?: string;
  location?: string;
  amount?: number;
  fee?: number;
  totalAmount?: number;
  currency?: string;
  transactionDate?: Date;
  transactionRefNo?: string;
  qrisRefNo?: string;
  merchantPan?: string;
  customerPan?: string;
  acquirer?: string;
  terminalId?: string;
  sourceOfFund?: string;
  sourceAccount?: string;
  recipientBank?: string;
  recipientBankAccount?: string;
  transferPurpose?: string;
  bankSender?: string;
  emailSubject?: string;
  transactionType?: string;
  status?: string;
  direction?: "in" | "out";
  virtualAccountNo?: string;
};

export type SyncEmailsInput = {
  maxResults?: number;
  pageToken?: string;
  labelIds?: string[];
  query?: string; // Gmail search query
};

// Response types
export type WalletSummary = {
  walletId: string;
  walletName: string;
  bankName: string;
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  balance: number;
};

export type TransactionSummary = {
  totalIncome: number;
  totalExpense: number;
  transactionCount: number;
  topMerchants: Array<{
    recipient: string;
    totalAmount: number;
    count: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expense: number;
  }>;
};

// Email and parsing types
export type EmailTransactionData = {
  recipient: string;
  location: string;
  transactionDate: Date;
  amount: number;
  fee: number;
  totalAmount: number;
  currency: string;
  transactionRefNo: string;
  qrisRefNo?: string;
  merchantPan?: string;
  customerPan?: string;
  acquirer?: string;
  terminalId?: string;
  sourceOfFund: string;
  sourceAccount: string;
  recipientBank: string;
  recipientBankAccount: string;
  transferPurpose: string;
  bankSender: string;
  emailSubject: string;
  transactionType: string;
  status: string;
  direction: "in" | "out";
  virtualAccountNo?: string;
  serviceProvider?: string;
  accountNumber?: string;
};

export type ParsedTransaction = {
  recipient: string;
  location: string;
  transactionDate: Date;
  amount: number;
  currency: string;
  transactionRefNo: string;
  qrisRefNo?: string;
  merchantPan?: string;
  customerPan?: string;
  acquirer?: string;
  terminalId?: string;
  sourceOfFund: string;
  sourceAccount: string;
  bankSender: string;
  emailSubject: string;
  transactionType: string;
  status: string;
  direction: "in" | "out"; // "in" for income, "out" for expenses
  virtualAccountNo?: string;
};

// Gmail types
export type GmailMessage = {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: {
    partId: string;
    mimeType: string;
    filename: string;
    headers: Array<{
      name: string;
      value: string;
    }>;
    body: {
      size: number;
      data?: string;
    };
    parts?: Array<{
      partId: string;
      mimeType: string;
      filename: string;
      body: {
        size: number;
        data?: string;
      };
      parts?: Array<{
        partId: string;
        mimeType: string;
        filename: string;
        body: {
          size: number;
          data?: string;
        };
      }>;
    }>;
  };
  sizeEstimate: number;
  historyId: string;
  internalDate: string;
}; 