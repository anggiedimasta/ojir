// Wallet Types
export type DateFilterType =
	| "all"
	| "current-month"
	| "last-month"
	| "current-week"
	| "current-day"
	| "custom";
export type SortByType = "date" | "amount" | "recipient";
export type SortOrderType = "asc" | "desc";
export type TransactionDirection = "in" | "out";

// New filter types
export type BankFilterType =
	| "all"
	| "mandiri"
	| "bca"
	| "bni"
	| "bri"
	| "cimb"
	| "other";
export type PaymentMethodFilterType =
	| "all"
	| "qris"
	| "transfer"
	| "virtual-account"
	| "bi-fast"
	| "other";

// Multiple selection types - always use arrays
export type BankFilterValue = BankFilterType[];
export type PaymentMethodFilterValue = PaymentMethodFilterType[];

// Wallet types
export type WalletType =
	| "debit"
	| "credit"
	| "savings"
	| "current"
	| "investment";

export interface Wallet {
	id: string;
	userId: string;
	name: string;
	type: WalletType;
	bankCode: string;
	accountNumber?: string;
	balance: string;
	currency: string;
	isActive: boolean;
	isDefault: boolean;
	color?: string;
	icon?: string;
	createdAt: Date;
	updatedAt?: Date;
}

// Master data types
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

// Wallet interface
export interface Wallet {
	id: string;
	userId: string;
	name: string;
	type: WalletType;
	bankCode: string;
	accountNumber?: string;
	balance: string;
	currency: string;
	isActive: boolean;
	isDefault: boolean;
	color?: string;
	icon?: string;
	createdAt: Date;
	updatedAt?: Date;
}

export interface WalletWithBank extends Wallet {
	bank: Bank | null;
}

export interface CreateWalletInput {
	name: string;
	type: WalletType;
	bankCode: string;
	accountNumber?: string;
	balance?: number;
	currency?: string;
	color?: string;
	isDefault?: boolean;
}

export interface UpdateWalletInput {
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
}

export interface WalletSummary {
	walletId: string;
	walletName: string;
	bankName: string;
	totalIncome: number;
	totalExpense: number;
	transactionCount: number;
	balance: number;
}

// Database transaction type (from Drizzle schema)
export interface DatabaseTransaction {
	id: string;
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
	direction: TransactionDirection;
	virtualAccountNo: string | null;
	createdAt: Date;
	updatedAt: Date | null;
}

// Transaction response from database
export interface TransactionResponse {
	id: string;
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
	createdAt: Date;
	updatedAt: Date | null;
	virtualAccountNo: string | null;
	// Wallet information
	walletName: string | null;
	walletType: string | null;
	walletBankCode: string | null;
	walletBankName: string | null;
	walletColor: string | null;
}

// Gmail API email structure
export interface GmailMessage {
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
}

// Parsed transaction data from email
// Enhanced email parsing interface for internal use
export interface EmailTransactionData {
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
}

export interface ParsedTransaction {
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
	recipientBank?: string;
	recipientBankAccount?: string;
	transferPurpose?: string;
	bankSender: string;
	emailSubject: string;
	transactionType: string;
	status: string;
	direction: "in" | "out"; // "in" for income, "out" for expenses
	virtualAccountNo?: string;
}

// Transaction summary type
export interface TransactionSummary {
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
}

// Date range type
export interface DateRange {
	startDate?: Date;
	endDate?: Date;
}

// Request types
export interface TransactionFilters {
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
	walletId?: string; // Add wallet filter
	sortBy?: SortByType;
	sortOrder?: SortOrderType;
	limit?: number;
	offset?: number;
}

export interface SyncEmailsInput {
	maxResults?: number;
	pageToken?: string;
	labelIds?: string[];
	query?: string; // Gmail search query
}

export interface CreateTransactionInput {
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
}

// Component prop types
export interface WalletHeaderProps {
	hasWallets?: boolean;
	selectedWalletIds?: string[];
	wallets?: WalletWithBank[];
	onClearSelection?: () => void;
}

export interface WalletSummaryProps {
	summary: TransactionSummary;
	formatCurrency: (amount: string) => string;
}

export interface WalletFiltersProps {
	dateFilter: DateFilterType;
	onDateFilterChange: (filter: DateFilterType) => void;
	customStartDate: string;
	customEndDate: string;
	onCustomStartDateChange: (date: string) => void;
	onCustomEndDateChange: (date: string) => void;
	searchQuery: string;
	onSearchQueryChange: (query: string) => void;
	recipientBank: BankFilterValue;
	onRecipientBankChange: (bank: BankFilterValue) => void;
	paymentMethod: PaymentMethodFilterValue;
	onPaymentMethodChange: (method: PaymentMethodFilterValue) => void;
	sortBy: SortByType;
	sortOrder: SortOrderType;
	onSortByChange: (sortBy: SortByType) => void;
	onSortOrderChange: (sortOrder: SortOrderType) => void;
	pageSize: number;
	onPageSizeChange: (size: number) => void;
	totalCount: number;
	dateRange: DateRange;
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
	dateFilter: DateFilterType;
	onDateFilterChange: (filter: DateFilterType) => void;
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
	sortBy: SortByType;
	sortOrder: SortOrderType;
	onSortByChange: (sortBy: SortByType) => void;
	onSortOrderChange: (sortOrder: SortOrderType) => void;
	options?: Array<{ value: SortByType; label: string }>;
}

export interface DateRangeDisplayProps {
	dateFilter: DateFilterType;
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

// Wallet management props
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
	onSubmit: (data: CreateWalletInput | UpdateWalletInput) => void;
	onCancel: () => void;
	isLoading?: boolean;
}
