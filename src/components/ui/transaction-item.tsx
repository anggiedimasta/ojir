import {
	ArrowRightLeft,
	CreditCard,
	Edit,
	QrCode,
	Smartphone,
} from "lucide-react";
import { WALLET_COLORS } from "~/components/ui/color-picker";
import type {
	TransactionItemProps,
	TransactionResponse,
} from "~/entities/api/wallet";
import { BankIcon } from "./bank-icon";
import { Button } from "./button";

export function TransactionItem({
	transaction,
	formatCurrency,
	formatDate,
	onEdit,
}: TransactionItemProps) {
	// Helper functions
	const getWalletBadgeClasses = (color: string | null | undefined) => {
		const colorConfig = WALLET_COLORS.find((c) => c.value === color);
		if (!colorConfig) {
			return "bg-slate-100 text-slate-700"; // Default for uncategorized or unknown
		}

		// Extract the base color name from the gradient and create flat semi-transparent colors
		const gradientMatch = colorConfig.gradient.match(/from-(\w+)-(\d+)/);
		if (gradientMatch) {
			const colorName = gradientMatch[1]; // e.g., 'blue'
			// Use light background and darker text for semi-transparent effect
			return `bg-${colorName}-100 text-${colorName}-700`;
		}

		return "bg-slate-100 text-slate-700"; // Fallback
	};

	const isVirtualAccount = (transaction: TransactionResponse) => {
		// First check if virtualAccountNo is present
		if (transaction.virtualAccountNo?.trim()) {
			return true;
		}
		// Fallback to checking recipient for virtual account patterns
		if (!transaction.recipient) return false;
		return /tokopedia|shopee|bukalapak|blibli|\d{10,}/i.test(
			transaction.recipient,
		);
	};

	const isInternalTransfer = (recipient: string | null) => {
		if (!recipient) return false;
		return /kartu kredit|credit card|transfer|topup|top up/i.test(recipient);
	};

	const isBIFastTransfer = (transaction: TransactionResponse) => {
		return (
			transaction.transactionType === "transfer" &&
			transaction.transactionRefNo &&
			transaction.transactionRefNo.includes("BMRI")
		);
	};

	const isQRTransfer = (transaction: TransactionResponse) => {
		return (
			transaction.transactionType === "transfer" &&
			!isBIFastTransfer(transaction)
		);
	};

	const getTransactionIcon = (transaction: TransactionResponse) => {
		if (isBIFastTransfer(transaction)) {
			return {
				icon: <ArrowRightLeft className="h-5 w-5 text-blue-600" />,
				bgColor: "bg-blue-50 border-blue-200",
			};
		}
		if (isQRTransfer(transaction)) {
			return {
				icon: <QrCode className="h-5 w-5 text-orange-600" />,
				bgColor: "bg-orange-50 border-orange-200",
			};
		}
		if (isInternalTransfer(transaction.recipient)) {
			return {
				icon: <ArrowRightLeft className="h-5 w-5 text-green-600" />,
				bgColor: "bg-green-50 border-green-200",
			};
		}
		if (transaction.qrisRefNo) {
			return {
				icon: <QrCode className="h-5 w-5 text-green-600" />,
				bgColor: "bg-green-50 border-green-200",
			};
		}
		if (isVirtualAccount(transaction)) {
			return {
				icon: <Smartphone className="h-5 w-5 text-purple-600" />,
				bgColor: "bg-purple-50 border-purple-200",
			};
		}
		return {
			icon: <CreditCard className="h-5 w-5 text-slate-600" />,
			bgColor: "bg-slate-50 border-slate-200",
		};
	};

	const iconData = getTransactionIcon(transaction);

	return (
		<div className="group p-4 transition-all duration-200 hover:bg-slate-50/50">
			{/* Row 1: Main transaction info */}
			<div className="mb-2 flex items-center justify-between">
				<div className="flex flex-1 items-center gap-3">
					<div
						className={`rounded-lg border p-2 ${iconData.bgColor} flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
					>
						{iconData.icon}
					</div>
					<div className="min-w-0 flex-1">
						<h4 className="truncate font-semibold text-base text-slate-900">
							{isInternalTransfer(transaction.recipient)
								? `${transaction.recipient?.includes("kredit") ? "Credit Card Payment" : "Internal Transfer"}`
								: transaction.recipient}
						</h4>
					</div>
				</div>
				<div className="flex items-center gap-2">
					{onEdit && (
						<Button
							color="ghost"
							size="sm"
							onClick={() => onEdit(transaction)}
							className="h-8 w-8 p-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
							title="Edit transaction"
						>
							<Edit className="h-4 w-4 text-slate-500" />
						</Button>
					)}
					<div className="text-right">
						<p
							className={`font-bold text-xl ${transaction.direction === "in" ? "text-green-600" : "text-red-600"}`}
						>
							{transaction.direction === "in" ? "+" : "-"}
							{formatCurrency(transaction.totalAmount || transaction.amount)}
						</p>
						{/* Show amount and fee if they differ from total */}
						{transaction.totalAmount &&
							Number.parseFloat(transaction.totalAmount) !==
								Number.parseFloat(transaction.amount) && (
								<p className="font-medium text-slate-600 text-xs">
									Amount: {formatCurrency(transaction.amount)}
								</p>
							)}
						{transaction.fee && Number.parseFloat(transaction.fee) > 0 && (
							<p className="text-slate-500 text-xs">
								Fee: {formatCurrency(transaction.fee)}
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Row 2: Badges and metadata */}
			<div className="mb-2 flex items-center justify-between">
				<div className="flex flex-wrap items-center gap-2">
					{isBIFastTransfer(transaction) ? (
						<span className="rounded-full bg-blue-100 px-2 py-1 font-medium text-blue-700 text-xs">
							BI Fast Transfer
						</span>
					) : isQRTransfer(transaction) ? (
						<span className="rounded-full bg-orange-100 px-2 py-1 font-medium text-orange-700 text-xs">
							QR Transfer
						</span>
					) : transaction.qrisRefNo ? (
						<span className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-700 text-xs">
							QRIS Payment
						</span>
					) : isVirtualAccount(transaction) ? (
						<span className="rounded-full bg-purple-100 px-2 py-1 font-medium text-purple-700 text-xs">
							Virtual Account
						</span>
					) : isInternalTransfer(transaction.recipient) ? (
						<span className="rounded-full bg-green-100 px-2 py-1 font-medium text-green-700 text-xs">
							Internal Transfer
						</span>
					) : null}

					{transaction.acquirer && (
						<span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700 text-xs">
							<BankIcon bankName={transaction.acquirer} className="h-3 w-3" />
							{transaction.acquirer}
						</span>
					)}

					{/* New fields: Recipient Bank and Transfer Purpose */}
					{transaction.recipientBank && (
						<span className="flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-1 font-medium text-indigo-700 text-xs">
							<BankIcon
								bankName={transaction.recipientBank}
								className="h-3 w-3"
							/>
							{transaction.recipientBank}
						</span>
					)}

					{transaction.transferPurpose && (
						<span className="rounded-full bg-teal-100 px-2 py-1 font-medium text-teal-700 text-xs">
							{transaction.transferPurpose}
						</span>
					)}

					{transaction.location && (
						<span className="text-slate-500 text-xs">
							{transaction.location}
						</span>
					)}
				</div>

				<div className="flex items-center gap-2">
					{transaction.walletName && (
						<span
							className={`flex items-center gap-1 rounded-full px-2 py-1 font-medium text-xs ${transaction.walletColor ? getWalletBadgeClasses(transaction.walletColor) : "bg-blue-100 text-blue-700"}`}
						>
							<div
								className={`flex h-3 w-3 items-center justify-center overflow-hidden rounded ${transaction.walletColor ? "bg-current/20" : "bg-blue-200"}`}
							>
								<BankIcon
									bankName={transaction.walletBankCode || "unknown"}
									className="h-full w-full"
								/>
							</div>
							{transaction.walletName === "Uncategorized"
								? "Uncategorized"
								: transaction.walletBankName && transaction.walletType
									? `${transaction.walletBankName} ${transaction.walletType.charAt(0).toUpperCase() + transaction.walletType.slice(1)}`
									: transaction.walletName}
						</span>
					)}

					{transaction.sourceAccount && (
						<span className="font-mono text-slate-400 text-xs">
							****{transaction.sourceAccount.slice(-4)}
						</span>
					)}
				</div>
			</div>

			{/* Row 3: Reference numbers and date */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4 text-slate-500 text-xs">
					<span>{formatDate(transaction.transactionDate)}</span>
					{transaction.qrisRefNo && (
						<span className="font-mono text-slate-400">
							QRIS: {transaction.qrisRefNo}
						</span>
					)}
					{transaction.transactionRefNo && (
						<span className="font-mono text-slate-400">
							{isBIFastTransfer(transaction) ? "BI Fast Ref: " : "Ref: "}
							{transaction.transactionRefNo}
						</span>
					)}
					{/* Show recipient bank account if available */}
					{transaction.recipientBankAccount && (
						<span className="font-mono text-slate-400">
							To: ****{transaction.recipientBankAccount.slice(-4)}
						</span>
					)}
				</div>

				{transaction.sourceOfFund &&
					(!transaction.walletName ||
						transaction.walletName === "Uncategorized") && (
						<span className="text-slate-500 text-xs">
							{transaction.sourceOfFund}
						</span>
					)}
			</div>
		</div>
	);
}
