// Wallet interfaces

import type { BaseEntity } from './common';

// Master data interfaces
export interface Bank {
  id: string;
  code: string;
  name: string;
  displayName: string;
  iconPath: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface WalletPaymentMethod {
  id: string;
  code: string;
  name: string;
  displayName: string;
  description?: string;
  iconPath?: string;
  isActive: boolean;
  sortOrder: number;
}

// Wallet interfaces
export interface Wallet extends BaseEntity {
  userId: string;
  name: string;
  type: 'debit' | 'credit' | 'savings' | 'current' | 'investment';
  bankCode: string;
  accountNumber?: string;
  balance: string;
  currency: string;
  isActive: boolean;
  isDefault: boolean;
  color?: string;
  icon?: string;
}

export interface WalletWithBank extends Wallet {
  bank: Bank | null;
}

// Transaction interfaces
export interface DatabaseTransaction extends BaseEntity {
  userId: string;
  recipient: string;
  location: string | null;
  transactionDate: Date;
  amount: string; // Decimal as string from database
  fee: string; // Decimal as string from database
  totalAmount: string; // Decimal as string from database
  currency: string;
  transactionRefNo: string | null;
  qrisRefNo: string | null;
  merchantPan: string | null;
  customerPan: string | null;
  acquirer: string | null;
  terminalId: string | null;
  sourceOfFund: string | null;
  sourceAccount: string | null;
  recipientBank: string | null;
  recipientBankAccount: string | null;
  transferPurpose: string | null;
  bankSender: string | null;
  emailSubject: string | null;
  transactionType: string | null;
  status: string | null;
  direction: 'in' | 'out';
  virtualAccountNo: string | null;
}

export interface TransactionResponse extends BaseEntity {
  userId: string;
  walletId: string; // Required wallet reference
  transactionRefNo: string | null;
  qrisRefNo: string | null;
  merchantPan: string | null;
  customerPan: string | null;
  terminalId: string | null;
  recipient: string | null;
  location: string | null;
  amount: string; // Decimal as string to avoid precision issues
  fee: string; // Decimal as string to avoid precision issues
  totalAmount: string; // Decimal as string to avoid precision issues
  currency: string;
  transactionDate: Date;
  sourceOfFund: string | null;
  sourceAccount: string | null;
  recipientBank: string | null;
  recipientBankAccount: string | null;
  transferPurpose: string | null;
  acquirer: string | null;
  bankSender: string | null;
  emailSubject: string | null;
  transactionType: string | null;
  direction: string; // From database schema as text
  status: string | null;
  virtualAccountNo: string | null;
  // Wallet information
  walletName: string | null;
  walletType: string | null;
  walletBankCode: string | null;
  walletBankName: string | null;
  walletColor: string | null;
}

// Component prop interfaces
export interface WalletHeaderProps {
  hasWallets?: boolean;
  selectedWalletIds?: string[];
  wallets?: WalletWithBank[];
  onClearSelection?: () => void;
}

export interface WalletSummaryProps {
  summary: {
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
  formatCurrency: (amount: string) => string;
}

export interface WalletFiltersProps {
  dateFilter: 'all' | 'current-month' | 'last-month' | 'current-week' | 'current-day' | 'custom';
  onDateFilterChange: (filter: 'all' | 'current-month' | 'last-month' | 'current-week' | 'current-day' | 'custom') => void;
  customStartDate: string;
  customEndDate: string;
  onCustomStartDateChange: (date: string) => void;
  onCustomEndDateChange: (date: string) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  recipientBank: ('all' | 'mandiri' | 'bca' | 'bni' | 'bri' | 'cimb' | 'other')[];
  onRecipientBankChange: (bank: ('all' | 'mandiri' | 'bca' | 'bni' | 'bri' | 'cimb' | 'other')[]) => void;
  paymentMethod: ('all' | 'qris' | 'transfer' | 'virtual-account' | 'bi-fast' | 'other')[];
  onPaymentMethodChange: (method: ('all' | 'qris' | 'transfer' | 'virtual-account' | 'bi-fast' | 'other')[]) => void;
  sortBy: 'date' | 'amount' | 'recipient';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'date' | 'amount' | 'recipient') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalCount: number;
  dateRange: {
    startDate?: Date;
    endDate?: Date;
  };
}

export interface TransactionListProps {
  transactions: TransactionResponse[] | undefined;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
  hasWallets?: boolean;
  selectedWalletIds?: string[];
  wallets?: WalletWithBank[];
  formatCurrency: (amount: string) => string;
  formatDate: (date: Date) => string;
  onEditTransaction?: (transaction: TransactionResponse) => void;
}

export interface TransactionItemProps {
  transaction: TransactionResponse;
  formatCurrency: (amount: string) => string;
  formatDate: (date: Date) => string;
  onEdit?: (transaction: TransactionResponse) => void;
}

export interface DateFilterProps {
  dateFilter: 'all' | 'current-month' | 'last-month' | 'current-week' | 'current-day' | 'custom';
  onDateFilterChange: (filter: 'all' | 'current-month' | 'last-month' | 'current-week' | 'current-day' | 'custom') => void;
  customStartDate: string;
  customEndDate: string;
  onCustomStartDateChange: (date: string) => void;
  onCustomEndDateChange: (date: string) => void;
}

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface SortControlsProps {
  sortBy: 'date' | 'amount' | 'recipient';
  sortOrder: 'asc' | 'desc';
  onSortByChange: (sortBy: 'date' | 'amount' | 'recipient') => void;
  onSortOrderChange: (sortOrder: 'asc' | 'desc') => void;
  options?: Array<{ value: 'date' | 'amount' | 'recipient'; label: string }>;
}

export interface DateRangeDisplayProps {
  dateFilter: 'all' | 'current-month' | 'last-month' | 'current-week' | 'current-day' | 'custom';
  startDate?: Date;
  endDate?: Date;
  className?: string;
}

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  valueColor?: string;
  titleColor?: string;
}

export interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ComponentType<{ className?: string }>;
  isLoading?: boolean;
  className?: string;
}

export interface WalletListProps {
  wallets: WalletWithBank[];
  onSelectWallets: (walletIds: string[]) => void;
  selectedWalletIds: string[];
  onAddWallet: () => void;
  onEditWallet: (wallet: Wallet) => void;
  onDeleteWallet: (walletId: string) => void;
  isLoading?: boolean;
}

export interface WalletCardProps {
  wallet: WalletWithBank;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  formatCurrency: (amount: string) => string;
}

export interface WalletFormProps {
  wallet?: Wallet;
  banks: Bank[];
  onSubmit: (data: {
    name: string;
    type: 'debit' | 'credit' | 'savings' | 'current' | 'investment';
    bankCode: string;
    accountNumber?: string;
    balance?: number;
    currency?: string;
    color?: string;
    isDefault?: boolean;
  } | {
    id: string;
    name?: string;
    type?: 'debit' | 'credit' | 'savings' | 'current' | 'investment';
    bankCode?: string;
    accountNumber?: string;
    balance?: number;
    currency?: string;
    color?: string;
    isActive?: boolean;
    isDefault?: boolean;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}