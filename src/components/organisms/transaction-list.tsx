import { Download, RefreshCw, Wallet } from "lucide-react";
import { TransactionListSkeleton } from "~/components/ui/transaction-skeleton";
import type { TransactionResponse } from "~/entities/api/wallet";
import { Button } from "../atoms/button";
import { Card } from "../atoms/card";
import { Icon } from "../atoms/icon";
import { EmptyState } from "../molecules/empty-state";
import { PaginationControls } from "./pagination-controls";
import { TransactionItem } from "./transaction-item";

interface TransactionListProps {
	transactions: TransactionResponse[] | undefined;
	totalCount: number;
	currentPage: number;
	pageSize: number;
	onPageChange: (page: number) => void;
	onSync: () => void;
	isLoading: boolean;
	isSyncPending: boolean;
	hasWallets?: boolean;
	formatCurrency: (amount: string) => string;
	formatDate: (date: Date) => string;
}

export function TransactionList({
	transactions,
	totalCount,
	currentPage,
	pageSize,
	onPageChange,
	onSync,
	isLoading,
	isSyncPending,
	hasWallets = true,
	formatCurrency,
	formatDate,
}: TransactionListProps) {
	const totalPages = Math.ceil((totalCount || 0) / pageSize);

	return (
		<Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm">
			<div className="border-slate-200 border-b p-6">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl text-slate-900">
						Recent Transactions
					</h2>
					<Button variant="outline" className="flex items-center gap-2">
						<Icon icon={Download} size="sm" />
						Export
					</Button>
				</div>
			</div>

			{!transactions || transactions.length === 0 ? (
				<EmptyState
					icon={Wallet}
					title={hasWallets ? "No transactions found" : "Create a wallet first"}
					description={
						hasWallets
							? "Sync your emails to automatically import bank transactions and start tracking your finances"
							: "You must create at least one wallet before syncing emails"
					}
					actionLabel={hasWallets ? "Sync Now" : undefined}
					onAction={hasWallets ? onSync : undefined}
					actionIcon={hasWallets ? RefreshCw : undefined}
					isLoading={isLoading || isSyncPending}
				/>
			) : (
				<>
					<div className="divide-y divide-slate-100">
						{transactions.map((transaction) => (
							<TransactionItem
								key={transaction.id}
								transaction={transaction}
								formatCurrency={formatCurrency}
								formatDate={formatDate}
							/>
						))}
					</div>

					<PaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						totalCount={totalCount}
						pageSize={pageSize}
						onPageChange={onPageChange}
					/>
				</>
			)}
		</Card>
	);
}
