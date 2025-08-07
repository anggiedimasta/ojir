import { ArrowRightLeft, CreditCard, QrCode, Smartphone } from "lucide-react";
import type { TransactionResponse } from "~/entities/api/wallet";
import { Badge } from "../atoms/badge";
import { Icon } from "../atoms/icon";
import { BankIcon, BankMandiriBadge } from "./bank-icon";

interface TransactionItemProps {
	transaction: TransactionResponse;
	formatCurrency: (amount: string) => string;
	formatDate: (date: Date) => string;
}

export function TransactionItem({
	transaction,
	formatCurrency,
	formatDate,
}: TransactionItemProps) {
	// Helper functions
	const isVirtualAccount = (recipient: string | null) => {
		if (!recipient) return false;
		return /tokopedia|shopee|bukalapak|blibli|\d{10,}/i.test(recipient);
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
				icon: (
					<Icon icon={ArrowRightLeft} size="md" className="text-blue-600" />
				),
				bgColor: "bg-blue-50 border-blue-200",
			};
		} else if (isQRTransfer(transaction)) {
			return {
				icon: <Icon icon={QrCode} size="md" className="text-orange-600" />,
				bgColor: "bg-orange-50 border-orange-200",
			};
		} else if (isInternalTransfer(transaction.recipient)) {
			return {
				icon: (
					<Icon icon={ArrowRightLeft} size="md" className="text-green-600" />
				),
				bgColor: "bg-green-50 border-green-200",
			};
		} else if (transaction.qrisRefNo) {
			return {
				icon: <Icon icon={QrCode} size="md" className="text-green-600" />,
				bgColor: "bg-green-50 border-green-200",
			};
		} else if (isVirtualAccount(transaction.recipient)) {
			return {
				icon: <Icon icon={Smartphone} size="md" className="text-purple-600" />,
				bgColor: "bg-purple-50 border-purple-200",
			};
		} else {
			return {
				icon: <Icon icon={CreditCard} size="md" className="text-slate-600" />,
				bgColor: "bg-slate-50 border-slate-200",
			};
		}
	};

	const iconData = getTransactionIcon(transaction);

	return (
		<div className="group p-6 transition-all duration-200 hover:bg-slate-50/50">
			<div className="flex items-start justify-between">
				<div className="flex flex-1 items-start space-x-4">
					<div
						className={`rounded-xl border p-3 ${iconData.bgColor} flex-shrink-0 transition-transform duration-200 group-hover:scale-110`}
					>
						{iconData.icon}
					</div>
					<div className="min-w-0 flex-1">
						<div className="mb-3 flex items-center gap-3">
							<h4 className="font-semibold text-lg text-slate-900">
								{isInternalTransfer(transaction.recipient)
									? `${transaction.recipient?.includes("kredit") ? "Credit Card Payment" : "Internal Transfer"}`
									: transaction.recipient}
							</h4>
							{isInternalTransfer(transaction.recipient) && (
								<Badge variant="success" size="sm">
									Transfer
								</Badge>
							)}
						</div>
						<div className="space-y-2 text-slate-600 text-sm">
							{isInternalTransfer(transaction.recipient) && (
								<p className="font-medium text-slate-600">
									To: {transaction.recipient}
								</p>
							)}
							{/* Bank/Method Badge */}
							<div className="flex flex-wrap items-center gap-2">
								{isBIFastTransfer(transaction) ? (
									<div className="flex items-center gap-2">
										<Badge
											variant="outline"
											size="sm"
											className="border-blue-200 bg-blue-100 text-blue-700"
										>
											BI Fast Transfer
										</Badge>
										{transaction.location && (
											<Badge
												variant="outline"
												size="sm"
												className="flex items-center gap-1 border-slate-200 bg-slate-100 text-slate-700"
											>
												<BankIcon
													bankName={transaction.location}
													className="h-3 w-3"
												/>
												{transaction.location}
											</Badge>
										)}
									</div>
								) : isQRTransfer(transaction) ? (
									<div className="flex items-center gap-2">
										<Badge
											variant="outline"
											size="sm"
											className="border-orange-200 bg-orange-100 text-orange-700"
										>
											QR Transfer
										</Badge>
										{transaction.location && (
											<Badge
												variant="outline"
												size="sm"
												className="flex items-center gap-1 border-slate-200 bg-slate-100 text-slate-700"
											>
												<BankIcon
													bankName={transaction.location}
													className="h-3 w-3"
												/>
												{transaction.location}
											</Badge>
										)}
									</div>
								) : transaction.qrisRefNo ? (
									<div className="flex items-center gap-2">
										<Badge variant="success" size="sm">
											QRIS Payment
										</Badge>
										{transaction.acquirer && (
											<Badge
												variant="outline"
												size="sm"
												className="flex items-center gap-1 border-slate-200 bg-slate-100 text-slate-700"
											>
												<BankIcon
													bankName={transaction.acquirer}
													className="h-3 w-3"
												/>
												{transaction.acquirer}
											</Badge>
										)}
									</div>
								) : isVirtualAccount(transaction.recipient) ? (
									<Badge
										variant="outline"
										size="sm"
										className="border-purple-200 bg-purple-100 text-purple-700"
									>
										Virtual Account
									</Badge>
								) : isInternalTransfer(transaction.recipient) ? (
									<Badge variant="success" size="sm">
										Internal Transfer
									</Badge>
								) : transaction.acquirer ? (
									<Badge
										variant="outline"
										size="sm"
										className="flex items-center gap-1 border-slate-200 bg-slate-100 text-slate-700"
									>
										<BankIcon
											bankName={transaction.acquirer}
											className="h-3 w-3"
										/>
										{transaction.acquirer}
									</Badge>
								) : null}
							</div>
							<p className="text-slate-500">
								{isBIFastTransfer(transaction) && transaction.location ? (
									<span className="flex items-center gap-1">
										<BankIcon
											bankName={transaction.location}
											className="h-3 w-3"
										/>
										{transaction.location}
									</span>
								) : (
									transaction.location
								)}
							</p>
							<p className="text-slate-500">
								{formatDate(transaction.transactionDate)}
							</p>
							{transaction.virtualAccountNo && (
								<p className="font-mono text-slate-400 text-xs">
									VA: {transaction.virtualAccountNo}
								</p>
							)}
							{transaction.qrisRefNo && (
								<p className="font-mono text-slate-400 text-xs">
									QRIS: {transaction.qrisRefNo}
								</p>
							)}
							{transaction.transactionRefNo && (
								<p className="font-mono text-slate-400 text-xs">
									{isBIFastTransfer(transaction) ? "BI Fast Ref: " : "Ref: "}
									{transaction.transactionRefNo}
								</p>
							)}
						</div>
					</div>
				</div>

				<div className="ml-6 flex-shrink-0 text-right">
					<p
						className={`mb-3 font-bold text-2xl ${transaction.direction === "in" ? "text-green-600" : "text-red-600"}`}
					>
						{transaction.direction === "in" ? "+" : "-"}
						{formatCurrency(transaction.amount.toString())}
					</p>
					<div className="space-y-2 text-slate-600 text-sm">
						<div className="flex items-center justify-end gap-1">
							<BankMandiriBadge />
						</div>
						<p className="text-right font-medium">
							{transaction.sourceAccount}
						</p>
						{transaction.sourceOfFund && (
							<p className="text-right text-slate-500 text-xs">
								{transaction.sourceOfFund}
							</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
