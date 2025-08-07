import { CreditCard, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import type { TransactionResponse } from "~/entities/api/wallet";
import { SummaryCard } from "../organisms/summary-card";
import { TransactionList } from "../organisms/transaction-list";
import { WalletFilters } from "../organisms/wallet-filters";
import { WalletHeader } from "../organisms/wallet-header";

interface WalletTemplateProps {
	// Header props
	onSync: () => void;
	onClear: () => void;
	isLoading: boolean;
	isSyncPending: boolean;
	isClearPending: boolean;

	// Summary props
	summary?: {
		totalIncome: number;
		totalExpense: number;
		transactionCount: number;
	};
	formatCurrency: (amount: string) => string;

	// Filters props
	dateFilter:
		| "all"
		| "current-month"
		| "last-month"
		| "current-week"
		| "current-day"
		| "custom";
	onDateFilterChange: (
		filter:
			| "all"
			| "current-month"
			| "last-month"
			| "current-week"
			| "current-day"
			| "custom",
	) => void;
	customStartDate: string;
	customEndDate: string;
	onCustomStartDateChange: (date: string) => void;
	onCustomEndDateChange: (date: string) => void;
	searchQuery: string;
	onSearchQueryChange: (query: string) => void;
	sortBy: "date" | "amount" | "recipient";
	sortOrder: "asc" | "desc";
	onSortByChange: (sortBy: "date" | "amount" | "recipient") => void;
	onSortOrderChange: (sortOrder: "asc" | "desc") => void;
	totalCount: number;
	dateRange: { startDate?: Date; endDate?: Date };

	// Transaction list props
	transactions: TransactionResponse[] | undefined;
	currentPage: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	formatDate: (date: Date) => string;
}

export function WalletTemplate({
	// Header props
	onSync,
	onClear,
	isLoading,
	isSyncPending,
	isClearPending,

	// Summary props
	summary,
	formatCurrency,

	// Filters props
	dateFilter,
	onDateFilterChange,
	customStartDate,
	customEndDate,
	onCustomStartDateChange,
	onCustomEndDateChange,
	searchQuery,
	onSearchQueryChange,
	sortBy,
	sortOrder,
	onSortByChange,
	onSortOrderChange,
	totalCount,
	dateRange,

	// Transaction list props
	transactions,
	currentPage,
	pageSize,
	onPageChange,
	formatDate,
}: WalletTemplateProps) {
	return (
		<div className="min-h-screen">
			<div className="p-4 sm:p-6 lg:p-8">
				{/* Header Section */}
				<WalletHeader
					onSync={onSync}
					onClear={onClear}
					isLoading={isLoading}
					isSyncPending={isSyncPending}
					isClearPending={isClearPending}
				/>

				{/* Summary Section */}
				{summary && (
					<div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
						<SummaryCard
							title="Total Income"
							value={formatCurrency(summary.totalIncome.toString())}
							icon={TrendingUp}
							gradient="bg-gradient-to-br from-green-50 to-emerald-50"
							borderColor="border-green-200"
							iconBgColor="bg-green-100"
							iconColor="text-green-600"
							valueColor="text-green-800"
							titleColor="text-green-700"
						/>

						<SummaryCard
							title="Total Expenses"
							value={formatCurrency(summary.totalExpense.toString())}
							icon={TrendingDown}
							gradient="bg-gradient-to-br from-red-50 to-rose-50"
							borderColor="border-red-200"
							iconBgColor="bg-red-100"
							iconColor="text-red-600"
							valueColor="text-red-800"
							titleColor="text-red-700"
						/>

						<SummaryCard
							title="Net Income"
							value={formatCurrency(
								(summary.totalIncome - summary.totalExpense).toString(),
							)}
							icon={Wallet}
							gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
							borderColor="border-blue-200"
							iconBgColor={
								summary.totalIncome - summary.totalExpense >= 0
									? "bg-green-100"
									: "bg-red-100"
							}
							iconColor={
								summary.totalIncome - summary.totalExpense >= 0
									? "text-green-600"
									: "text-red-600"
							}
							valueColor={
								summary.totalIncome - summary.totalExpense >= 0
									? "text-green-800"
									: "text-red-800"
							}
							titleColor="text-blue-700"
						/>

						<SummaryCard
							title="Transactions"
							value={summary.transactionCount}
							icon={CreditCard}
							gradient="bg-gradient-to-br from-purple-50 to-violet-50"
							borderColor="border-purple-200"
							iconBgColor="bg-purple-100"
							iconColor="text-purple-600"
							valueColor="text-purple-800"
							titleColor="text-purple-700"
						/>
					</div>
				)}

				{/* Filters Section */}
				<WalletFilters
					dateFilter={dateFilter}
					onDateFilterChange={onDateFilterChange}
					customStartDate={customStartDate}
					customEndDate={customEndDate}
					onCustomStartDateChange={onCustomStartDateChange}
					onCustomEndDateChange={onCustomEndDateChange}
					searchQuery={searchQuery}
					onSearchQueryChange={onSearchQueryChange}
					sortBy={sortBy}
					sortOrder={sortOrder}
					onSortByChange={onSortByChange}
					onSortOrderChange={onSortOrderChange}
					totalCount={totalCount}
					dateRange={dateRange}
				/>

				{/* Transaction List Section */}
				<TransactionList
					transactions={transactions}
					totalCount={totalCount}
					currentPage={currentPage}
					pageSize={pageSize}
					onPageChange={onPageChange}
					onSync={onSync}
					isLoading={isLoading}
					isSyncPending={isSyncPending}
					formatCurrency={formatCurrency}
					formatDate={formatDate}
				/>
			</div>
		</div>
	);
}
