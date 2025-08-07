"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "~/components/atoms/input";
import { Label } from "~/components/atoms/label";
import { DateInput } from "~/components/molecules/date-input";
import { SelectInput } from "~/components/molecules/select-input";
import { Button } from "~/components/ui/button";
import {
	Modal,
	ModalCloseButton,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
} from "~/components/ui/modal";
import { useToast } from "~/components/ui/use-toast";
import type { TransactionResponse } from "~/entities/api/wallet";
import { api } from "~/trpc/react";

// Form validation schema
const transactionEditSchema = z.object({
	recipient: z.string().min(1, "Recipient is required"),
	location: z.string().optional(),
	amount: z
		.string()
		.min(1, "Amount is required")
		.refine((val) => /^\d+(\.\d{1,2})?$/.test(val), "Invalid amount format"),
	fee: z
		.string()
		.optional()
		.refine(
			(val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
			"Invalid fee format",
		),
	totalAmount: z
		.string()
		.optional()
		.refine(
			(val) => !val || /^\d+(\.\d{1,2})?$/.test(val),
			"Invalid total amount format",
		),
	currency: z.string().min(1, "Currency is required"),
	transactionDate: z.date(),
	direction: z.enum(["in", "out"]),
	walletId: z.string().min(1, "Wallet is required"),
	recipientBank: z.string().optional(),
	recipientBankAccount: z.string().optional(),
	transferPurpose: z.string().optional(),
});

type TransactionEditFormData = z.infer<typeof transactionEditSchema>;

interface TransactionEditFormProps {
	transaction: TransactionResponse | null;
	isOpen: boolean;
	onClose: () => void;
	onSuccess?: () => void;
}

export function TransactionEditForm({
	transaction,
	isOpen,
	onClose,
	onSuccess,
}: TransactionEditFormProps) {
	const { toast } = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [dateValue, setDateValue] = useState("");

	// Get user wallets for the wallet selector
	const { data: wallets = [] } = api.wallet.getWallets.useQuery();

	// Update transaction mutation
	const updateTransactionMutation = api.wallet.updateTransaction.useMutation({
		onSuccess: () => {
			toast({
				title: "Transaction Updated",
				description: "Transaction has been updated successfully.",
			});
			onSuccess?.();
			onClose();
		},
		onError: (error) => {
			toast({
				title: "Failed to Update Transaction",
				description: error.message,
				variant: "destructive",
			});
		},
	});

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { errors },
	} = useForm<TransactionEditFormData>({
		resolver: zodResolver(transactionEditSchema),
		defaultValues: {
			recipient: "",
			location: "",
			amount: "",
			fee: "",
			totalAmount: "",
			currency: "IDR",
			transactionDate: new Date(),
			direction: "out",
			walletId: "",
			recipientBank: "",
			recipientBankAccount: "",
			transferPurpose: "",
		},
	});

	// Reset form when transaction changes
	useEffect(() => {
		if (transaction) {
			reset({
				recipient: transaction.recipient || "",
				location: transaction.location || "",
				amount: transaction.amount,
				fee: transaction.fee || "",
				totalAmount: transaction.totalAmount || "",
				currency: transaction.currency,
				transactionDate: new Date(transaction.transactionDate),
				direction: transaction.direction as "in" | "out",
				walletId: transaction.walletId,
				recipientBank: transaction.recipientBank || "",
				recipientBankAccount: transaction.recipientBankAccount || "",
				transferPurpose: transaction.transferPurpose || "",
			});
			if (transaction?.transactionDate) {
				const dateString =
					new Date(transaction.transactionDate).toISOString().split("T")[0] ||
					"";
				setDateValue(dateString);
			}
		}
	}, [transaction, reset]);

	const onSubmit = async (data: TransactionEditFormData) => {
		if (!transaction) return;

		setIsSubmitting(true);
		try {
			await updateTransactionMutation.mutateAsync({
				id: transaction.id,
				...data,
				amount: Number.parseFloat(data.amount),
				fee: data.fee ? Number.parseFloat(data.fee) : undefined,
				totalAmount: data.totalAmount
					? Number.parseFloat(data.totalAmount)
					: undefined,
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	const walletOptions = wallets.map((wallet) => ({
		value: wallet.id,
		label: wallet.name,
	}));

	const directionOptions = [
		{ value: "in", label: "Income" },
		{ value: "out", label: "Expense" },
	];

	const currencyOptions = [
		{ value: "IDR", label: "IDR (Indonesian Rupiah)" },
		{ value: "USD", label: "USD (US Dollar)" },
		{ value: "EUR", label: "EUR (Euro)" },
	];

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="xl"
			title="Edit Transaction"
			description="Update your transaction details"
		>
			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Transaction Overview Section */}
				<div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
								<svg
									className="h-4 w-4 text-blue-600"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Income"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
									/>
								</svg>
							</div>
							<div>
								<h3 className="font-semibold text-gray-900 text-sm">
									Transaction Details
								</h3>
								<p className="text-gray-600 text-xs">
									Update the basic information for this transaction
								</p>
							</div>
						</div>

						{/* Type Selection - Icon Only */}
						<div className="flex gap-1">
							<button
								type="button"
								onClick={() => setValue("direction", "in")}
								className={`rounded-lg border-2 p-2 transition-all duration-200 ${
									watch("direction") === "in"
										? "border-green-500 bg-green-50 text-green-700"
										: "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
								}`}
								title="Income"
							>
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Expense"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M7 11l5-5m0 0l5 5m-5-5v12"
									/>
								</svg>
							</button>
							<button
								type="button"
								onClick={() => setValue("direction", "out")}
								className={`rounded-lg border-2 p-2 transition-all duration-200 ${
									watch("direction") === "out"
										? "border-red-500 bg-red-50 text-red-700"
										: "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
								}`}
								title="Expense"
							>
								<svg
									className="h-4 w-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									role="img"
									aria-label="Expense"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M17 13l-5 5m0 0l-5-5m5 5V6"
									/>
								</svg>
							</button>
						</div>
					</div>

					<div className="space-y-4">
						{/* Recipient */}
						<div>
							<Label
								htmlFor="recipient"
								className="font-medium text-gray-700 text-sm"
							>
								Recipient *
							</Label>
							<Input
								id="recipient"
								{...register("recipient")}
								placeholder="Who received or sent this transaction?"
								className={`mt-1.5 ${errors.recipient ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
							/>
							{errors.recipient && (
								<p className="mt-1.5 flex items-center gap-1 text-red-500 text-sm">
									<svg
										className="h-4 w-4"
										fill="currentColor"
										viewBox="0 0 20 20"
										role="img"
										aria-label="Error"
									>
										<path
											fillRule="evenodd"
											d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
											clipRule="evenodd"
										/>
									</svg>
									{errors.recipient.message}
								</p>
							)}
						</div>

						{/* Amount and Date */}
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							<div>
								<Label
									htmlFor="amount"
									className="font-medium text-gray-700 text-sm"
								>
									Amount *
								</Label>
								<div className="relative mt-1.5">
									<Input
										id="amount"
										{...register("amount")}
										placeholder="0.00"
										className={`pr-12 ${errors.amount ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
									/>
									<div className="-translate-y-1/2 absolute top-1/2 right-3 transform font-medium text-gray-400 text-sm">
										{watch("currency") || "IDR"}
									</div>
								</div>
								{errors.amount && (
									<p className="mt-1.5 flex items-center gap-1 text-red-500 text-sm">
										<svg
											className="h-4 w-4"
											fill="currentColor"
											viewBox="0 0 20 20"
											role="img"
											aria-label="Error"
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
										{errors.amount.message}
									</p>
								)}
							</div>

							<div>
								<Label
									htmlFor="transactionDate"
									className="font-medium text-gray-700 text-sm"
								>
									Date *
								</Label>
								<div className="mt-1.5">
									<DateInput
										value={dateValue}
										onChange={(dateString) => {
											setDateValue(dateString);
											setValue("transactionDate", new Date(dateString));
										}}
										placeholder="Select date"
									/>
								</div>
							</div>
						</div>

						{/* Fee and Total Amount */}
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							<div>
								<Label
									htmlFor="fee"
									className="font-medium text-gray-700 text-sm"
								>
									Fee
								</Label>
								<div className="relative mt-1.5">
									<Input
										id="fee"
										{...register("fee")}
										placeholder="0.00"
										className={`pr-12 ${errors.fee ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
									/>
									<div className="-translate-y-1/2 absolute top-1/2 right-3 transform font-medium text-gray-400 text-sm">
										{watch("currency") || "IDR"}
									</div>
								</div>
								{errors.fee && (
									<p className="mt-1.5 flex items-center gap-1 text-red-500 text-sm">
										<svg
											className="h-4 w-4"
											fill="currentColor"
											viewBox="0 0 20 20"
											role="img"
											aria-label="Error"
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
										{errors.fee.message}
									</p>
								)}
							</div>

							<div>
								<Label
									htmlFor="totalAmount"
									className="font-medium text-gray-700 text-sm"
								>
									Total Amount
								</Label>
								<div className="relative mt-1.5">
									<Input
										id="totalAmount"
										{...register("totalAmount")}
										placeholder="0.00"
										className={`pr-12 ${errors.totalAmount ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
									/>
									<div className="-translate-y-1/2 absolute top-1/2 right-3 transform font-medium text-gray-400 text-sm">
										{watch("currency") || "IDR"}
									</div>
								</div>
								{errors.totalAmount && (
									<p className="mt-1.5 flex items-center gap-1 text-red-500 text-sm">
										<svg
											className="h-4 w-4"
											fill="currentColor"
											viewBox="0 0 20 20"
											role="img"
											aria-label="Error"
										>
											<path
												fillRule="evenodd"
												d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
												clipRule="evenodd"
											/>
										</svg>
										{errors.totalAmount.message}
									</p>
								)}
							</div>
						</div>
					</div>
				</div>

				{/* Additional Details Section */}
				<div className="rounded-xl border border-slate-100 bg-gradient-to-r from-slate-50 to-gray-50 p-5">
					<div className="mb-4 flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100">
							<svg
								className="h-4 w-4 text-slate-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								role="img"
								aria-label="Additional Details"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
								/>
							</svg>
						</div>
						<div>
							<h3 className="font-semibold text-gray-900 text-sm">
								Additional Details
							</h3>
							<p className="text-gray-600 text-xs">
								Add more context to your transaction
							</p>
						</div>
					</div>

					<div className="space-y-4">
						{/* Location and Wallet */}
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							<div>
								<Label
									htmlFor="location"
									className="font-medium text-gray-700 text-sm"
								>
									Location
								</Label>
								<div className="mt-1.5">
									<Input
										id="location"
										{...register("location")}
										placeholder="Where did this happen?"
										className="focus:ring-blue-500"
									/>
								</div>
							</div>

							<div>
								<Label
									htmlFor="walletId"
									className="font-medium text-gray-700 text-sm"
								>
									Wallet *
								</Label>
								<div className="mt-1.5">
									<SelectInput
										value={watch("walletId")}
										onChange={(value) => setValue("walletId", value)}
										options={walletOptions}
										placeholder="Select wallet"
									/>
								</div>
							</div>
						</div>

						{/* Recipient Bank and Account */}
						<div className="grid grid-cols-1 gap-3 md:grid-cols-2">
							<div>
								<Label
									htmlFor="recipientBank"
									className="font-medium text-gray-700 text-sm"
								>
									Recipient Bank
								</Label>
								<div className="mt-1.5">
									<Input
										id="recipientBank"
										{...register("recipientBank")}
										placeholder="e.g., BCA, Mandiri, BNI"
										className="focus:ring-blue-500"
									/>
								</div>
							</div>

							<div>
								<Label
									htmlFor="recipientBankAccount"
									className="font-medium text-gray-700 text-sm"
								>
									Recipient Account
								</Label>
								<div className="mt-1.5">
									<Input
										id="recipientBankAccount"
										{...register("recipientBankAccount")}
										placeholder="Account number"
										className="focus:ring-blue-500"
									/>
								</div>
							</div>
						</div>

						{/* Transfer Purpose */}
						<div>
							<Label
								htmlFor="transferPurpose"
								className="font-medium text-gray-700 text-sm"
							>
								Transfer Purpose
							</Label>
							<div className="mt-1.5">
								<Input
									id="transferPurpose"
									{...register("transferPurpose")}
									placeholder="e.g., Wealth Transfer, Payment, etc."
									className="focus:ring-blue-500"
								/>
							</div>
						</div>
					</div>
				</div>

				<ModalFooter>
					<div className="flex w-full gap-3">
						<Button
							type="button"
							color="gray"
							onClick={onClose}
							disabled={isSubmitting}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							color="blue"
							disabled={isSubmitting}
							className="flex-1"
						>
							{isSubmitting ? (
								<div className="flex items-center gap-2">
									<svg
										className="h-4 w-4 animate-spin"
										fill="none"
										viewBox="0 0 24 24"
										role="img"
										aria-label="Loading"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										/>
									</svg>
									Updating...
								</div>
							) : (
								<div className="flex items-center gap-2">
									<svg
										className="h-4 w-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										role="img"
										aria-label="Update transaction"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M5 13l4 4L19 7"
										/>
									</svg>
									Update Transaction
								</div>
							)}
						</Button>
					</div>
				</ModalFooter>
			</form>
		</Modal>
	);
}
