"use client";

import { Button } from "~/components/ui/button";
import { Modal, ModalFooter } from "~/components/ui/modal";

export interface ChangeType {
	type: "amount" | "fee" | "direction" | "wallet" | "category";
	oldValue: string;
	newValue: string;
	label: string;
}

interface ConfirmationDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	description: string;
	changes: ChangeType[];
	isSubmitting?: boolean;
}

export function ConfirmationDialog({
	isOpen,
	onClose,
	onConfirm,
	title,
	description,
	changes,
	isSubmitting = false,
}: ConfirmationDialogProps) {
	const getChangeIcon = (type: ChangeType["type"]) => {
		switch (type) {
			case "amount":
			case "fee":
				return (
					<svg
						className="h-5 w-5 text-yellow-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						role="img"
						aria-label="Financial Change"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
						/>
					</svg>
				);
			case "direction":
				return (
					<svg
						className="h-5 w-5 text-blue-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						role="img"
						aria-label="Direction Change"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
						/>
					</svg>
				);
			case "wallet":
				return (
					<svg
						className="h-5 w-5 text-green-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						role="img"
						aria-label="Wallet Change"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
						/>
					</svg>
				);
			case "category":
				return (
					<svg
						className="h-5 w-5 text-purple-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						role="img"
						aria-label="Category Change"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
						/>
					</svg>
				);
			default:
				return (
					<svg
						className="h-5 w-5 text-gray-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						role="img"
						aria-label="Change"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
						/>
					</svg>
				);
		}
	};

	const getChangeColor = (type: ChangeType["type"]) => {
		switch (type) {
			case "amount":
			case "fee":
				return "bg-yellow-50 border-yellow-200";
			case "direction":
				return "bg-blue-50 border-blue-200";
			case "wallet":
				return "bg-green-50 border-green-200";
			case "category":
				return "bg-purple-50 border-purple-200";
			default:
				return "bg-gray-50 border-gray-200";
		}
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			size="md"
			title={title}
			description={description}
		>
			<div className="space-y-4">
				{/* Warning Message */}
				<div className="rounded-lg bg-yellow-50 p-4">
					<div className="flex items-start gap-3">
						<svg
							className="mt-0.5 h-5 w-5 text-yellow-600"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							role="img"
							aria-label="Warning"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
							/>
						</svg>
						<div>
							<h4 className="font-medium text-sm text-yellow-800">
								Important Changes Detected
							</h4>
							<p className="mt-1 text-xs text-yellow-700">
								Please review the following changes carefully before proceeding.
							</p>
						</div>
					</div>
				</div>

				{/* Changes List */}
				<div className="space-y-2">
					{changes.map((change, index) => (
						<div
							key={index}
							className={`rounded-lg border p-3 ${getChangeColor(change.type)}`}
						>
							<div className="flex items-start gap-3">
								{getChangeIcon(change.type)}
								<div className="flex-1">
									<div className="flex justify-between text-sm">
										<span className="font-medium text-gray-700">
											{change.label}:
										</span>
										<span className="text-gray-900">
											{change.oldValue} → {change.newValue}
										</span>
									</div>
								</div>
							</div>
						</div>
					))}
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
						type="button"
						color="blue"
						onClick={onConfirm}
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
							"Confirm Changes"
						)}
					</Button>
				</div>
			</ModalFooter>
		</Modal>
	);
}
