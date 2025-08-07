import {
	type SQL,
	and,
	asc,
	desc,
	eq,
	gte,
	ilike,
	inArray,
	isNull,
	lte,
	or,
	sql,
} from "drizzle-orm";
import { z } from "zod";
import type { TransactionSummary } from "~/entities/api/wallet";
import {
	fetchGmailMessages,
	parseTransactionEmail,
	setupGmailPushNotifications,
	stopGmailPushNotifications,
} from "~/server/api/gmail";
import { banks, transactions, wallets } from "~/server/db/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

// Custom error class for auth errors that should trigger sign-out
export class AuthError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "AuthError";
	}
}

// Helper function to safely create OR conditions
const createOrCondition = (
	conditions: (SQL<unknown> | undefined)[],
): SQL<unknown> | undefined => {
	const validConditions = conditions.filter(Boolean) as SQL<unknown>[];
	return validConditions.length > 0 ? or(...validConditions) : undefined;
};

// Helper function to safely create AND conditions
const createAndCondition = (
	conditions: (SQL<unknown> | undefined)[],
): SQL<unknown> | undefined => {
	const validConditions = conditions.filter(Boolean) as SQL<unknown>[];
	return validConditions.length > 0 ? and(...validConditions) : undefined;
};

export const walletRouter = createTRPCRouter({
	// Get user wallets with bank information
	getWallets: protectedProcedure.query(async ({ ctx }) => {
		// Ensure user has an uncategorized wallet
		const uncategorizedWallet = await ctx.db
			.select()
			.from(wallets)
			.where(
				and(
					eq(wallets.userId, ctx.session.user.id),
					eq(wallets.name, "Uncategorized"),
				),
			)
			.limit(1);

		// Create uncategorized wallet if it doesn't exist
		if (!uncategorizedWallet[0]) {
			await ctx.db.insert(wallets).values({
				userId: ctx.session.user.id,
				name: "Uncategorized",
				type: "debit",
				bankCode: "unknown",
				balance: "0",
				currency: "IDR",
				color: "gray",
				icon: "wallet",
				isDefault: false,
			});
		}

		const userWallets = await ctx.db
			.select({
				id: wallets.id,
				userId: wallets.userId,
				name: wallets.name,
				type: wallets.type,
				bankCode: wallets.bankCode,
				accountNumber: wallets.accountNumber,
				balance: wallets.balance,
				currency: wallets.currency,
				isActive: wallets.isActive,
				isDefault: wallets.isDefault,
				color: wallets.color,
				icon: wallets.icon,
				createdAt: wallets.createdAt,
				updatedAt: wallets.updatedAt,
				bank: {
					id: banks.id,
					code: banks.code,
					name: banks.name,
					displayName: banks.displayName,
					iconPath: banks.iconPath,
					isActive: banks.isActive,
					sortOrder: banks.sortOrder,
				},
			})
			.from(wallets)
			.leftJoin(banks, eq(wallets.bankCode, banks.code))
			.where(eq(wallets.userId, ctx.session.user.id))
			.orderBy(asc(wallets.isDefault), asc(wallets.name));

		return userWallets;
	}),

	// Get wallet with bank details
	getWalletWithBank: protectedProcedure
		.input(z.object({ walletId: z.string() }))
		.query(async ({ ctx, input }) => {
			const wallet = await ctx.db
				.select({
					wallet: wallets,
					bank: banks,
				})
				.from(wallets)
				.leftJoin(banks, eq(wallets.bankCode, banks.code))
				.where(
					and(
						eq(wallets.id, input.walletId),
						eq(wallets.userId, ctx.session.user.id),
					),
				)
				.limit(1);

			return wallet[0] || null;
		}),

	// Create new wallet
	createWallet: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				type: z.enum(["debit", "credit", "savings", "current", "investment"]),
				bankCode: z.string().min(1),
				accountNumber: z
					.string()
					.min(4)
					.max(4)
					.regex(/^\d{4}$/, "Account number must be exactly 4 digits")
					.optional(),
				balance: z.number().default(0),
				currency: z.string().default("IDR"),
				color: z.string().optional(),
				isDefault: z.boolean().default(false),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// If this wallet is set as default, unset other default wallets
			if (input.isDefault) {
				await ctx.db
					.update(wallets)
					.set({ isDefault: false })
					.where(
						and(
							eq(wallets.userId, ctx.session.user.id),
							eq(wallets.isDefault, true),
						),
					);
			}

			// Get bank icon from database
			const getBankIcon = async (bankCode: string) => {
				const bank = await ctx.db
					.select({ iconPath: banks.iconPath })
					.from(banks)
					.where(eq(banks.code, bankCode))
					.limit(1);

				// Return the bank's icon path if available, otherwise use default
				return bank[0]?.iconPath || "wallet";
			};

			// Get the bank icon
			const bankIcon = await getBankIcon(input.bankCode);

			const newWallet = await ctx.db
				.insert(wallets)
				.values({
					userId: ctx.session.user.id,
					name: input.name,
					type: input.type,
					bankCode: input.bankCode,
					accountNumber: input.accountNumber,
					balance: input.balance.toString(),
					currency: input.currency,
					color: input.color,
					icon: bankIcon,
					isDefault: input.isDefault,
				})
				.returning();

			return newWallet[0];
		}),

	// Get or create uncategorized wallet for user
	getOrCreateUncategorizedWallet: protectedProcedure.mutation(
		async ({ ctx }) => {
			// Check if user already has an uncategorized wallet
			let uncategorizedWallet = await ctx.db
				.select()
				.from(wallets)
				.where(
					and(
						eq(wallets.userId, ctx.session.user.id),
						eq(wallets.name, "Uncategorized"),
					),
				)
				.limit(1);

			// If not found, create one
			if (!uncategorizedWallet[0]) {
				uncategorizedWallet = await ctx.db
					.insert(wallets)
					.values({
						userId: ctx.session.user.id,
						name: "Uncategorized",
						type: "debit",
						bankCode: "unknown",
						balance: "0",
						currency: "IDR",
						color: "gray",
						icon: "wallet",
						isDefault: false,
					})
					.returning();
			}

			return uncategorizedWallet[0];
		},
	),

	// Update wallet
	updateWallet: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1).optional(),
				type: z
					.enum(["debit", "credit", "savings", "current", "investment"])
					.optional(),
				bankCode: z.string().min(1).optional(),
				accountNumber: z
					.string()
					.min(4)
					.max(4)
					.regex(/^\d{4}$/, "Account number must be exactly 4 digits")
					.optional(),
				balance: z.number().optional(),
				currency: z.string().optional(),
				color: z.string().optional(),
				isActive: z.boolean().optional(),
				isDefault: z.boolean().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// If this wallet is set as default, unset other default wallets
			if (input.isDefault) {
				await ctx.db
					.update(wallets)
					.set({ isDefault: false })
					.where(
						and(
							eq(wallets.userId, ctx.session.user.id),
							eq(wallets.isDefault, true),
							sql`${wallets.id} != ${input.id}`,
						),
					);
			}

			// Get bank icon from database
			const getBankIcon = async (bankCode: string) => {
				const bank = await ctx.db
					.select({ iconPath: banks.iconPath })
					.from(banks)
					.where(eq(banks.code, bankCode))
					.limit(1);

				// Return the bank's icon path if available, otherwise use default
				return bank[0]?.iconPath || "wallet";
			};

			const updateData: any = {
				...(input.name && { name: input.name }),
				...(input.type && { type: input.type }),
				...(input.bankCode && { bankCode: input.bankCode }),
				...(input.accountNumber !== undefined && {
					accountNumber: input.accountNumber,
				}),
				...(input.balance !== undefined && {
					balance: input.balance.toString(),
				}),
				...(input.currency && { currency: input.currency }),
				...(input.color !== undefined && { color: input.color }),
				...(input.isActive !== undefined && { isActive: input.isActive }),
				...(input.isDefault !== undefined && { isDefault: input.isDefault }),
			};

			// Update icon if bank code is being changed
			if (input.bankCode) {
				const bankIcon = await getBankIcon(input.bankCode);
				updateData.icon = bankIcon;
			}

			const updatedWallet = await ctx.db
				.update(wallets)
				.set(updateData)
				.where(
					and(
						eq(wallets.id, input.id),
						eq(wallets.userId, ctx.session.user.id),
					),
				)
				.returning();

			return updatedWallet[0];
		}),

	// Delete wallet
	deleteWallet: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Get the wallet to check if it's the uncategorized wallet
			const wallet = await ctx.db
				.select()
				.from(wallets)
				.where(
					and(
						eq(wallets.id, input.id),
						eq(wallets.userId, ctx.session.user.id),
					),
				)
				.limit(1);

			if (!wallet[0]) {
				throw new Error("Wallet not found or unauthorized");
			}

			// Prevent deletion of uncategorized wallet
			if (wallet[0].name === "Uncategorized") {
				throw new Error("Cannot delete the Uncategorized wallet");
			}

			// Check if wallet has transactions
			const transactionCount = await ctx.db
				.select({ count: sql<number>`count(*)` })
				.from(transactions)
				.where(eq(transactions.walletId, input.id));

			if ((transactionCount[0]?.count ?? 0) > 0) {
				throw new Error("Cannot delete wallet with existing transactions");
			}

			const deletedWallet = await ctx.db
				.delete(wallets)
				.where(
					and(
						eq(wallets.id, input.id),
						eq(wallets.userId, ctx.session.user.id),
					),
				)
				.returning();

			return deletedWallet[0];
		}),

	// Get transactions with filters
	getTransactions: protectedProcedure
		.input(
			z.object({
				startDate: z.date().optional(),
				endDate: z.date().optional(),
				searchQuery: z.string().optional(),
				recipientBank: z
					.array(
						z.enum(["all", "mandiri", "bca", "bni", "bri", "cimb", "other"]),
					)
					.optional(),
				paymentMethod: z
					.array(
						z.enum([
							"all",
							"qris",
							"transfer",
							"virtual-account",
							"bi-fast",
							"other",
						]),
					)
					.optional(),
				walletId: z.string().optional(),
				walletIds: z.array(z.string()).optional(),
				sortBy: z.enum(["date", "amount", "recipient"]).optional(),
				sortOrder: z.enum(["asc", "desc"]).optional(),
				limit: z.number().min(1).max(100).default(10),
				offset: z.number().min(0).default(0),
			}),
		)
		.query(async ({ ctx, input }) => {
			const conditions: SQL<unknown>[] = [
				eq(transactions.userId, ctx.session.user.id),
			];

			// Date filters
			if (input.startDate) {
				conditions.push(gte(transactions.transactionDate, input.startDate));
			}
			if (input.endDate) {
				conditions.push(lte(transactions.transactionDate, input.endDate));
			}

			// Wallet filter - support single walletId or multiple walletIds
			if (input.walletIds && input.walletIds.length > 0) {
				conditions.push(inArray(transactions.walletId, input.walletIds));
			} else if (input.walletId) {
				conditions.push(eq(transactions.walletId, input.walletId));
			}

			// Search query
			if (input.searchQuery) {
				const searchTerm = `%${input.searchQuery}%`;
				const searchCondition = createOrCondition([
					ilike(transactions.recipient, searchTerm),
					ilike(transactions.location, searchTerm),
					ilike(transactions.transactionRefNo, searchTerm),
					ilike(transactions.emailSubject, searchTerm),
				]);

				if (searchCondition) {
					conditions.push(searchCondition);
				}
			}

			// Bank filter - support multiple selections
			if (
				input.recipientBank &&
				input.recipientBank.length > 0 &&
				!input.recipientBank.includes("all")
			) {
				const bankConditions: SQL<unknown>[] = [];

				for (const bank of input.recipientBank) {
					if (bank === "other") {
						const otherBankCondition = createOrCondition([
							isNull(transactions.bankSender),
							sql`${transactions.bankSender} NOT IN ('mandiri', 'bca', 'bni', 'bri', 'cimb')`,
						]);
						if (otherBankCondition) {
							bankConditions.push(otherBankCondition);
						}
					} else {
						bankConditions.push(ilike(transactions.bankSender, `%${bank}%`));
					}
				}

				if (bankConditions.length > 0) {
					conditions.push(createOrCondition(bankConditions) || sql`1=0`);
				}
			}

			// Payment method filter - support multiple selections
			if (
				input.paymentMethod &&
				input.paymentMethod.length > 0 &&
				!input.paymentMethod.includes("all")
			) {
				const methodConditions: SQL<unknown>[] = [];

				for (const method of input.paymentMethod) {
					if (method === "qris") {
						methodConditions.push(sql`${transactions.qrisRefNo} IS NOT NULL`);
					} else if (method === "transfer") {
						const transferCondition = createOrCondition([
							ilike(transactions.transactionType, "%transfer%"),
							ilike(transactions.transactionType, "%bi-fast%"),
						]);
						if (transferCondition) {
							methodConditions.push(transferCondition);
						}
					} else if (method === "virtual-account") {
						methodConditions.push(
							sql`${transactions.virtualAccountNo} IS NOT NULL`,
						);
					} else if (method === "bi-fast") {
						methodConditions.push(
							ilike(transactions.transactionType, "%bi-fast%"),
						);
					} else if (method === "other") {
						const otherCondition = createAndCondition([
							isNull(transactions.qrisRefNo),
							isNull(transactions.virtualAccountNo),
							sql`${transactions.transactionType} NOT LIKE '%transfer%'`,
							sql`${transactions.transactionType} NOT LIKE '%bi-fast%'`,
						]);
						if (otherCondition) {
							methodConditions.push(otherCondition);
						}
					}
				}

				if (methodConditions.length > 0) {
					conditions.push(createOrCondition(methodConditions) || sql`1=0`);
				}
			}

			// Sorting
			let orderBy = desc(transactions.transactionDate);
			if (input.sortBy) {
				switch (input.sortBy) {
					case "amount":
						orderBy =
							input.sortOrder === "asc"
								? asc(transactions.amount)
								: desc(transactions.amount);
						break;
					case "recipient":
						orderBy =
							input.sortOrder === "asc"
								? asc(transactions.recipient)
								: desc(transactions.recipient);
						break;
					default:
						orderBy =
							input.sortOrder === "asc"
								? asc(transactions.transactionDate)
								: desc(transactions.transactionDate);
						break;
				}
			}

			const userTransactions = await ctx.db
				.select({
					id: transactions.id,
					userId: transactions.userId,
					walletId: transactions.walletId,
					transactionRefNo: transactions.transactionRefNo,
					qrisRefNo: transactions.qrisRefNo,
					merchantPan: transactions.merchantPan,
					customerPan: transactions.customerPan,
					terminalId: transactions.terminalId,
					recipient: transactions.recipient,
					location: transactions.location,
					amount: transactions.amount,
					fee: transactions.fee,
					totalAmount: transactions.totalAmount,
					currency: transactions.currency,
					transactionDate: transactions.transactionDate,
					sourceOfFund: transactions.sourceOfFund,
					sourceAccount: transactions.sourceAccount,
					recipientBank: transactions.recipientBank,
					recipientBankAccount: transactions.recipientBankAccount,
					transferPurpose: transactions.transferPurpose,
					acquirer: transactions.acquirer,
					bankSender: transactions.bankSender,
					emailSubject: transactions.emailSubject,
					transactionType: transactions.transactionType,
					direction: transactions.direction,
					status: transactions.status,
					createdAt: transactions.createdAt,
					updatedAt: transactions.updatedAt,
					virtualAccountNo: transactions.virtualAccountNo,
					// Wallet information
					walletName: wallets.name,
					walletType: wallets.type,
					walletBankCode: wallets.bankCode,
					walletBankName: banks.name,
					walletColor: wallets.color,
				})
				.from(transactions)
				.leftJoin(wallets, eq(transactions.walletId, wallets.id))
				.leftJoin(banks, eq(wallets.bankCode, banks.code))
				.where(and(...conditions))
				.orderBy(orderBy)
				.limit(input.limit)
				.offset(input.offset);

			return userTransactions;
		}),

	// Get transaction count for pagination
	getTransactionCount: protectedProcedure
		.input(
			z.object({
				startDate: z.date().optional(),
				endDate: z.date().optional(),
				searchQuery: z.string().optional(),
				recipientBank: z
					.array(
						z.enum(["all", "mandiri", "bca", "bni", "bri", "cimb", "other"]),
					)
					.optional(),
				paymentMethod: z
					.array(
						z.enum([
							"all",
							"qris",
							"transfer",
							"virtual-account",
							"bi-fast",
							"other",
						]),
					)
					.optional(),
				walletId: z.string().optional(),
				walletIds: z.array(z.string()).optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const conditions: SQL<unknown>[] = [
				eq(transactions.userId, ctx.session.user.id),
			];

			// Date filters
			if (input.startDate) {
				conditions.push(gte(transactions.transactionDate, input.startDate));
			}
			if (input.endDate) {
				conditions.push(lte(transactions.transactionDate, input.endDate));
			}

			// Wallet filter - support single walletId or multiple walletIds
			if (input.walletIds && input.walletIds.length > 0) {
				conditions.push(inArray(transactions.walletId, input.walletIds));
			} else if (input.walletId) {
				conditions.push(eq(transactions.walletId, input.walletId));
			}

			// Search query
			if (input.searchQuery) {
				const searchTerm = `%${input.searchQuery}%`;
				const searchCondition = createOrCondition([
					ilike(transactions.recipient, searchTerm),
					ilike(transactions.location, searchTerm),
					ilike(transactions.transactionRefNo, searchTerm),
					ilike(transactions.emailSubject, searchTerm),
				]);

				if (searchCondition) {
					conditions.push(searchCondition);
				}
			}

			// Bank filter - support multiple selections
			if (
				input.recipientBank &&
				input.recipientBank.length > 0 &&
				!input.recipientBank.includes("all")
			) {
				const bankConditions: SQL<unknown>[] = [];

				for (const bank of input.recipientBank) {
					if (bank === "other") {
						const otherBankCondition = createOrCondition([
							isNull(transactions.bankSender),
							sql`${transactions.bankSender} NOT IN ('mandiri', 'bca', 'bni', 'bri', 'cimb')`,
						]);
						if (otherBankCondition) {
							bankConditions.push(otherBankCondition);
						}
					} else {
						bankConditions.push(ilike(transactions.bankSender, `%${bank}%`));
					}
				}

				if (bankConditions.length > 0) {
					conditions.push(createOrCondition(bankConditions) || sql`1=0`);
				}
			}

			// Payment method filter - support multiple selections
			if (
				input.paymentMethod &&
				input.paymentMethod.length > 0 &&
				!input.paymentMethod.includes("all")
			) {
				const methodConditions: SQL<unknown>[] = [];

				for (const method of input.paymentMethod) {
					if (method === "qris") {
						methodConditions.push(sql`${transactions.qrisRefNo} IS NOT NULL`);
					} else if (method === "transfer") {
						const transferCondition = createOrCondition([
							ilike(transactions.transactionType, "%transfer%"),
							ilike(transactions.transactionType, "%bi-fast%"),
						]);
						if (transferCondition) {
							methodConditions.push(transferCondition);
						}
					} else if (method === "virtual-account") {
						methodConditions.push(
							sql`${transactions.virtualAccountNo} IS NOT NULL`,
						);
					} else if (method === "bi-fast") {
						methodConditions.push(
							ilike(transactions.transactionType, "%bi-fast%"),
						);
					} else if (method === "other") {
						const otherCondition = createAndCondition([
							isNull(transactions.qrisRefNo),
							isNull(transactions.virtualAccountNo),
							sql`${transactions.transactionType} NOT LIKE '%transfer%'`,
							sql`${transactions.transactionType} NOT LIKE '%bi-fast%'`,
						]);
						if (otherCondition) {
							methodConditions.push(otherCondition);
						}
					}
				}

				if (methodConditions.length > 0) {
					conditions.push(createOrCondition(methodConditions) || sql`1=0`);
				}
			}

			const result = await ctx.db
				.select({ count: sql<number>`count(*)` })
				.from(transactions)
				.where(and(...conditions));

			return result[0]?.count || 0;
		}),

	// Get transaction summary/analytics
	getSummary: protectedProcedure
		.input(
			z.object({
				startDate: z.date().optional(),
				endDate: z.date().optional(),
				walletId: z.string().optional(),
				walletIds: z.array(z.string()).optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			const conditions: SQL<unknown>[] = [
				eq(transactions.userId, ctx.session.user.id),
			];

			if (input.startDate) {
				conditions.push(gte(transactions.transactionDate, input.startDate));
			}
			if (input.endDate) {
				conditions.push(lte(transactions.transactionDate, input.endDate));
			}
			if (input.walletId) {
				conditions.push(eq(transactions.walletId, input.walletId));
			} else if (input.walletIds && input.walletIds.length > 0) {
				conditions.push(inArray(transactions.walletId, input.walletIds));
			}

			// Get all transactions for analysis
			const userTransactions = await ctx.db
				.select()
				.from(transactions)
				.where(and(...conditions));

			// Calculate summary based on transaction direction
			const totalIncome = userTransactions.reduce((sum, t) => {
				if (t.direction === "in") {
					return sum + Number.parseFloat(t.amount);
				}
				return sum;
			}, 0);

			const totalExpense = userTransactions.reduce((sum, t) => {
				if (t.direction === "out") {
					return sum + Number.parseFloat(t.amount);
				}
				return sum;
			}, 0);

			const transactionCount = userTransactions.length;

			// Top merchants - separate by direction
			const merchantTotals = new Map<
				string,
				{ totalAmount: number; count: number }
			>();
			userTransactions.forEach((t) => {
				if (t.recipient) {
					const existing = merchantTotals.get(t.recipient) || {
						totalAmount: 0,
						count: 0,
					};
					// Only count expenses for top merchants (spending analysis)
					if (t.direction === "out") {
						existing.totalAmount += Number.parseFloat(t.amount);
						existing.count += 1;
						merchantTotals.set(t.recipient, existing);
					}
				}
			});

			const topMerchants = Array.from(merchantTotals.entries())
				.map(([recipient, data]) => ({
					recipient,
					totalAmount: data.totalAmount,
					count: data.count,
				}))
				.sort((a, b) => b.totalAmount - a.totalAmount)
				.slice(0, 5);

			// Monthly trend (simplified for now)
			const monthlyTrend: Array<{
				month: string;
				income: number;
				expense: number;
			}> = []; // TODO: Implement monthly aggregation

			const summary: TransactionSummary = {
				totalIncome,
				totalExpense,
				transactionCount,
				topMerchants,
				monthlyTrend,
			};

			return summary;
		}),

	// Sync transactions from Gmail
	syncTransactions: protectedProcedure
		.input(
			z.object({
				maxResults: z.number().min(1).max(100).default(50),
				pageToken: z.string().optional(),
				labelIds: z.array(z.string()).optional(),
				query: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.accessToken) {
				throw new AuthError(
					"No Gmail access token available. Please sign out and sign in again to refresh your credentials.",
				);
			}

			// Check if user has at least one non-uncategorized wallet
			const userWallets = await ctx.db
				.select()
				.from(wallets)
				.where(
					and(
						eq(wallets.userId, ctx.session.user.id),
						sql`${wallets.name} != 'Uncategorized'`,
					),
				);

			if (userWallets.length === 0) {
				throw new Error(
					"You must create at least one wallet before syncing emails. Please add a wallet first.",
				);
			}

			try {
				// Fetch emails from Gmail
				const { messages, nextPageToken } = await fetchGmailMessages(
					ctx.accessToken,
					{
						maxResults: input.maxResults,
						pageToken: input.pageToken,
						query: input.query,
					},
				);

				const newTransactions = [];
				const skippedMessages = [];

				for (const message of messages) {
					try {
						// Parse transaction from email
						const parsedTransaction = parseTransactionEmail(message);

						if (!parsedTransaction) {
							skippedMessages.push({ id: message.id, reason: "parse_failed" });
							continue;
						}

						// Check if source of fund contains any of user's wallet account numbers
						// If so, treat as outgoing transaction (money coming from wallet)
						if (parsedTransaction.sourceOfFund) {
							const userWalletAccountNumbers = await ctx.db
								.select({ accountNumber: wallets.accountNumber })
								.from(wallets)
								.where(
									and(
										eq(wallets.userId, ctx.session.user.id),
										sql`${wallets.accountNumber} IS NOT NULL`,
										sql`${wallets.accountNumber} != ''`,
									),
								);

							// Check if any wallet account number appears in the source of fund
							// Extract last 4 digits from masked format (e.g., ****2191 -> 2191)
							const extractAccountNumber = (sourceOfFund: string) => {
								const match = sourceOfFund.match(/\*{4}(\d{4})/);
								return match ? match[1] : null;
							};

							const sourceAccountNumber = extractAccountNumber(
								parsedTransaction.sourceOfFund,
							);

							const walletAccountInSource = userWalletAccountNumbers.some(
								(wallet) =>
									wallet.accountNumber &&
									sourceAccountNumber === wallet.accountNumber,
							);

							if (walletAccountInSource) {
								parsedTransaction.direction = "out";
							}
						}

						// Check if transaction already exists
						const existingTransaction = await ctx.db
							.select()
							.from(transactions)
							.where(
								and(
									eq(
										transactions.transactionRefNo,
										parsedTransaction.transactionRefNo,
									),
									eq(transactions.userId, ctx.session.user.id),
								),
							)
							.limit(1);

						// Debug specific transaction

						if (existingTransaction.length > 0) {
							// Update existing transaction with newest data from email
							const existing = existingTransaction[0];
							if (existing) {
								// Clean up sourceOfFund to prevent database constraint errors
								let cleanSourceOfFund = parsedTransaction.sourceOfFund;
								if (
									cleanSourceOfFund &&
									(cleanSourceOfFund.includes("Save this email") ||
										cleanSourceOfFund.includes("Thank you for using Livin"))
								) {
									// Extract just the part before the email footer
									const cleanMatch = cleanSourceOfFund.match(
										/^([^]*?Credit Card[^]*?Mandiri[^]*?Platinum[^]*?)\s*\*\*\*\*/i,
									);
									if (cleanMatch?.[1]) {
										cleanSourceOfFund = cleanMatch[1].trim();
									} else {
										// Fallback: just take everything before "Save this email"
										const beforeFooter =
											cleanSourceOfFund.split("Save this email")[0];
										if (beforeFooter) {
											cleanSourceOfFund = beforeFooter.trim();
										}
									}
								}

								// Ensure sourceOfFund doesn't exceed database limit (255 characters)
								if (cleanSourceOfFund && cleanSourceOfFund.length > 255) {
									// Try to extract just the essential part
									const essentialMatch = cleanSourceOfFund.match(
										/^([^]*?Credit Card[^]*?Mandiri[^]*?Platinum[^]*?)/i,
									);
									if (essentialMatch?.[1]) {
										cleanSourceOfFund = essentialMatch[1].trim();
									} else {
										// Last resort: truncate to 255 characters
										cleanSourceOfFund = cleanSourceOfFund
											.substring(0, 255)
											.trim();
									}
								}

								// Update the existing transaction with all the newest data
								await ctx.db
									.update(transactions)
									.set({
										recipient: parsedTransaction.recipient,
										location: parsedTransaction.location,
										amount: parsedTransaction.amount.toString(),
										fee: parsedTransaction.fee.toString(),
										totalAmount: parsedTransaction.totalAmount.toString(),
										currency: parsedTransaction.currency,
										transactionDate: parsedTransaction.transactionDate,
										transactionRefNo: parsedTransaction.transactionRefNo,
										qrisRefNo: parsedTransaction.qrisRefNo,
										merchantPan: parsedTransaction.merchantPan,
										customerPan: parsedTransaction.customerPan,
										acquirer: parsedTransaction.acquirer,
										terminalId: parsedTransaction.terminalId,
										sourceOfFund: cleanSourceOfFund,
										sourceAccount: parsedTransaction.sourceAccount,
										recipientBank: parsedTransaction.recipientBank,
										recipientBankAccount:
											parsedTransaction.recipientBankAccount,
										transferPurpose: parsedTransaction.transferPurpose,
										bankSender: parsedTransaction.bankSender,
										emailSubject: parsedTransaction.emailSubject,
										transactionType: parsedTransaction.transactionType,
										status: parsedTransaction.status,
										direction: parsedTransaction.direction,
										virtualAccountNo: parsedTransaction.virtualAccountNo,
									})
									.where(eq(transactions.id, existing.id));
							}

							skippedMessages.push({
								id: message.id,
								reason: "already_exists",
							});
							continue;
						}

						// Find matching wallet based on user's configured wallets
						let targetWallet: (typeof wallets.$inferSelect)[] = [];

						// First priority: Try to find wallet by exact account number match
						if (parsedTransaction.sourceAccount) {
							// Extract the last 4 digits from source account (e.g., ****2191 -> 2191)
							const accountNumber = parsedTransaction.sourceAccount
								.replace(/\*/g, "")
								.slice(-4);

							if (accountNumber.length === 4) {
								targetWallet = await ctx.db
									.select()
									.from(wallets)
									.where(
										and(
											eq(wallets.userId, ctx.session.user.id),
											eq(wallets.accountNumber, accountNumber),
										),
									)
									.limit(1);
							}
						}

						// Second priority: Try to find wallet by bank and account number (if both are available)
						if (
							!targetWallet[0] &&
							parsedTransaction.bankSender &&
							parsedTransaction.sourceAccount
						) {
							const accountNumber = parsedTransaction.sourceAccount
								.replace(/\*/g, "")
								.slice(-4);

							if (accountNumber.length === 4) {
								targetWallet = await ctx.db
									.select()
									.from(wallets)
									.where(
										and(
											eq(wallets.userId, ctx.session.user.id),
											eq(
												wallets.bankCode,
												parsedTransaction.bankSender.toLowerCase(),
											),
											eq(wallets.accountNumber, accountNumber),
										),
									)
									.limit(1);
							}
						}

						// Third priority: Try to find by bank only (if no account number match found)
						if (!targetWallet[0] && parsedTransaction.bankSender) {
							targetWallet = await ctx.db
								.select()
								.from(wallets)
								.where(
									and(
										eq(wallets.userId, ctx.session.user.id),
										eq(
											wallets.bankCode,
											parsedTransaction.bankSender.toLowerCase(),
										),
									),
								)
								.limit(1);
						}

						// If still no wallet found, use uncategorized wallet
						if (!targetWallet[0]) {
							// Get or create uncategorized wallet
							const uncategorizedWallet = await ctx.db
								.select()
								.from(wallets)
								.where(
									and(
										eq(wallets.userId, ctx.session.user.id),
										eq(wallets.name, "Uncategorized"),
									),
								)
								.limit(1);

							if (!uncategorizedWallet[0]) {
								// Create uncategorized wallet if it doesn't exist
								const newUncategorizedWallet = await ctx.db
									.insert(wallets)
									.values({
										userId: ctx.session.user.id,
										name: "Uncategorized",
										type: "debit",
										bankCode: "unknown",
										balance: "0",
										currency: "IDR",
										color: "gray",
										icon: "help-circle",
										isDefault: false,
									})
									.returning();

								targetWallet = newUncategorizedWallet;
							} else {
								targetWallet = uncategorizedWallet;
							}
						}

						// Insert new transaction
						const newTransaction = await ctx.db
							.insert(transactions)
							.values({
								userId: ctx.session.user.id,
								walletId: targetWallet[0]?.id,
								recipient: parsedTransaction.recipient,
								location: parsedTransaction.location,
								amount: parsedTransaction.amount.toString(),
								fee: parsedTransaction.fee.toString(),
								totalAmount: parsedTransaction.totalAmount.toString(),
								currency: parsedTransaction.currency,
								transactionDate: parsedTransaction.transactionDate,
								transactionRefNo: parsedTransaction.transactionRefNo,
								qrisRefNo: parsedTransaction.qrisRefNo,
								merchantPan: parsedTransaction.merchantPan,
								customerPan: parsedTransaction.customerPan,
								acquirer: parsedTransaction.acquirer,
								terminalId: parsedTransaction.terminalId,
								sourceOfFund: parsedTransaction.sourceOfFund,
								sourceAccount: parsedTransaction.sourceAccount,
								bankSender: parsedTransaction.bankSender,
								emailSubject: parsedTransaction.emailSubject,
								transactionType: parsedTransaction.transactionType,
								status: parsedTransaction.status,
								direction: parsedTransaction.direction,
								virtualAccountNo: parsedTransaction.virtualAccountNo,
							})
							.returning();

						if (newTransaction) {
							newTransactions.push(newTransaction);
						}
					} catch (error) {
						console.error(`Error processing message ${message.id}:`, error);
						skippedMessages.push({
							id: message.id,
							reason: "processing_error",
							error: error instanceof Error ? error.message : "Unknown error",
						});
					}
				}

				// After processing new transactions, remap existing transactions to correct wallets
				let remappedCount = 0;
				try {
					// Get all user's wallets with account numbers
					const userWallets = await ctx.db
						.select({
							id: wallets.id,
							name: wallets.name,
							bankCode: wallets.bankCode,
							accountNumber: wallets.accountNumber,
						})
						.from(wallets)
						.where(
							and(
								eq(wallets.userId, ctx.session.user.id),
								sql`${wallets.accountNumber} IS NOT NULL`,
								sql`${wallets.accountNumber} != ''`,
							),
						);

					// Get uncategorized wallet
					const uncategorizedWallet = await ctx.db
						.select()
						.from(wallets)
						.where(
							and(
								eq(wallets.userId, ctx.session.user.id),
								eq(wallets.name, "Uncategorized"),
							),
						)
						.limit(1);

					if (uncategorizedWallet[0]) {
						// Process each wallet
						for (const wallet of userWallets) {
							if (!wallet.accountNumber) continue;

							// Find transactions that match this wallet's account number
							const matchingTransactions = await ctx.db
								.select()
								.from(transactions)
								.where(
									and(
										eq(transactions.userId, ctx.session.user.id),
										sql`${transactions.sourceAccount} LIKE ${`%${wallet.accountNumber}%`}`,
										// Only update transactions that are currently in uncategorized or have wrong wallet
										or(
											eq(transactions.walletId, uncategorizedWallet[0].id),
											sql`${transactions.walletId} NOT IN (${userWallets.map((w) => w.id).join(",")})`,
										),
									),
								);

							// Update these transactions to point to the correct wallet
							for (const transaction of matchingTransactions) {
								await ctx.db
									.update(transactions)
									.set({ walletId: wallet.id })
									.where(eq(transactions.id, transaction.id));

								remappedCount++;
							}
						}
					}
				} catch (error) {
					console.error("Error during automatic remapping:", error);
					// Don't throw error here as the main sync was successful
				}

				return {
					newTransactions: newTransactions.length,
					skippedMessages: skippedMessages.length,
					remappedTransactions: remappedCount,
					nextPageToken,
					processed: messages.length,
					details: {
						newTransactions,
						skippedMessages,
					},
				};
			} catch (error) {
				console.error("Error syncing transactions:", error);
				throw new Error(
					`Failed to sync transactions: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		}),

	// Delete transaction
	deleteTransaction: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const result = await ctx.db
				.delete(transactions)
				.where(
					and(
						eq(transactions.id, input.id),
						eq(transactions.userId, ctx.session.user.id),
					),
				)
				.returning();

			if (result.length === 0) {
				throw new Error("Transaction not found or unauthorized");
			}

			return result[0];
		}),

	// Clear all transactions for re-syncing
	clearAllTransactions: protectedProcedure.mutation(async ({ ctx }) => {
		const result = await ctx.db
			.delete(transactions)
			.where(eq(transactions.userId, ctx.session.user.id))
			.returning();

		return {
			deletedCount: result.length,
			message: `Deleted ${result.length} transactions. You can now re-sync to get updated data.`,
		};
	}),

	// Enable automatic email sync
	enableAutoSync: protectedProcedure
		.input(
			z.object({
				topicName: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (!ctx.accessToken) {
				throw new AuthError(
					"No Gmail access token available. Please sign out and sign in again to refresh your credentials.",
				);
			}

			try {
				const topicName =
					input.topicName ||
					(process.env.GOOGLE_CLOUD_PROJECT
						? `projects/${process.env.GOOGLE_CLOUD_PROJECT}/topics/gmail-notifications`
						: "default-topic");

				const result = await setupGmailPushNotifications(
					ctx.accessToken,
					topicName,
				);

				// Store auto-sync preference in user settings (you'll need to implement this)
				// await updateUserAutoSyncPreference(ctx.session.user.id, true);

				return {
					success: true,
					message: "Automatic email sync enabled successfully",
					data: result,
				};
			} catch (error) {
				console.error("Error enabling auto sync:", error);
				throw new Error(
					`Failed to enable auto sync: ${error instanceof Error ? error.message : "Unknown error"}`,
				);
			}
		}),

	// Disable automatic email sync
	disableAutoSync: protectedProcedure.mutation(async ({ ctx }) => {
		if (!ctx.accessToken) {
			throw new AuthError(
				"No Gmail access token available. Please sign out and sign in again to refresh your credentials.",
			);
		}

		try {
			await stopGmailPushNotifications(ctx.accessToken);

			// Store auto-sync preference in user settings (you'll need to implement this)
			// await updateUserAutoSyncPreference(ctx.session.user.id, false);

			return {
				success: true,
				message: "Automatic email sync disabled successfully",
			};
		} catch (error) {
			console.error("Error disabling auto sync:", error);
			throw new Error(
				`Failed to disable auto sync: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}),

	// Remap existing transactions to correct wallets based on account number
	remapTransactionsToWallets: protectedProcedure.mutation(async ({ ctx }) => {
		try {
			// Get all user's wallets with account numbers
			const userWallets = await ctx.db
				.select({
					id: wallets.id,
					name: wallets.name,
					bankCode: wallets.bankCode,
					accountNumber: wallets.accountNumber,
				})
				.from(wallets)
				.where(
					and(
						eq(wallets.userId, ctx.session.user.id),
						sql`${wallets.accountNumber} IS NOT NULL`,
						sql`${wallets.accountNumber} != ''`,
					),
				);

			// Get uncategorized wallet
			const uncategorizedWallet = await ctx.db
				.select()
				.from(wallets)
				.where(
					and(
						eq(wallets.userId, ctx.session.user.id),
						eq(wallets.name, "Uncategorized"),
					),
				)
				.limit(1);

			if (!uncategorizedWallet[0]) {
				throw new Error("Uncategorized wallet not found");
			}

			let updatedCount = 0;
			const skippedCount = 0;

			// Process each wallet
			for (const wallet of userWallets) {
				if (!wallet.accountNumber) continue;

				// Find transactions that match this wallet's account number
				const matchingTransactions = await ctx.db
					.select()
					.from(transactions)
					.where(
						and(
							eq(transactions.userId, ctx.session.user.id),
							sql`${transactions.sourceAccount} LIKE ${`%${wallet.accountNumber}%`}`,
							// Only update transactions that are currently in uncategorized or have wrong wallet
							or(
								eq(transactions.walletId, uncategorizedWallet[0].id),
								sql`${transactions.walletId} NOT IN (${userWallets.map((w) => w.id).join(",")})`,
							),
						),
					);

				// Update these transactions to point to the correct wallet
				for (const transaction of matchingTransactions) {
					await ctx.db
						.update(transactions)
						.set({ walletId: wallet.id })
						.where(eq(transactions.id, transaction.id));

					updatedCount++;
				}
			}

			return {
				success: true,
				message: `Successfully remapped ${updatedCount} transactions to correct wallets`,
				updatedCount,
				skippedCount,
			};
		} catch (error) {
			console.error("Error remapping transactions:", error);
			throw new Error(
				`Failed to remap transactions: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}),

	// Update transaction
	updateTransaction: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				recipient: z.string().min(1),
				location: z.string().optional(),
				amount: z.number().positive(),
				fee: z.number().optional(),
				totalAmount: z.number().optional(),
				currency: z.string().min(1),
				transactionDate: z.date(),
				direction: z.enum(["in", "out"]),
				walletId: z.string().min(1),
				recipientBank: z.string().optional(),
				recipientBankAccount: z.string().optional(),
				transferPurpose: z.string().optional(),
				description: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Verify the transaction belongs to the user
			const existingTransaction = await ctx.db
				.select()
				.from(transactions)
				.where(
					and(
						eq(transactions.id, input.id),
						eq(transactions.userId, ctx.session.user.id),
					),
				)
				.limit(1);

			if (!existingTransaction[0]) {
				throw new Error(
					"Transaction not found or you don't have permission to edit it",
				);
			}

			// Verify the wallet belongs to the user
			const wallet = await ctx.db
				.select()
				.from(wallets)
				.where(
					and(
						eq(wallets.id, input.walletId),
						eq(wallets.userId, ctx.session.user.id),
					),
				)
				.limit(1);

			if (!wallet[0]) {
				throw new Error(
					"Selected wallet not found or you don't have permission to use it",
				);
			}

			// Update the transaction
			const updatedTransaction = await ctx.db
				.update(transactions)
				.set({
					recipient: input.recipient,
					location: input.location,
					amount: input.amount.toString(),
					fee: input.fee ? input.fee.toString() : "0.00",
					totalAmount: input.totalAmount
						? input.totalAmount.toString()
						: input.amount.toString(),
					currency: input.currency,
					transactionDate: input.transactionDate,
					direction: input.direction,
					walletId: input.walletId,
					recipientBank: input.recipientBank,
					recipientBankAccount: input.recipientBankAccount,
					transferPurpose: input.transferPurpose,
					// Note: We're not updating system-generated fields like transactionRefNo, qrisRefNo, etc.
					// Only user-editable fields are updated
				})
				.where(eq(transactions.id, input.id))
				.returning();

			return updatedTransaction[0];
		}),

	// Bulk update transactions wallet assignment
	bulkUpdateTransactionWallets: protectedProcedure
		.input(
			z.object({
				walletId: z.string().min(1),
				transactionIds: z.array(z.string()).min(1),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			// Verify the wallet belongs to the user
			const wallet = await ctx.db
				.select()
				.from(wallets)
				.where(
					and(
						eq(wallets.id, input.walletId),
						eq(wallets.userId, ctx.session.user.id),
					),
				)
				.limit(1);

			if (!wallet[0]) {
				throw new Error(
					"Selected wallet not found or you don't have permission to use it",
				);
			}

			// Verify all transactions belong to the user
			const existingTransactions = await ctx.db
				.select({ id: transactions.id })
				.from(transactions)
				.where(
					and(
						inArray(transactions.id, input.transactionIds),
						eq(transactions.userId, ctx.session.user.id),
					),
				);

			if (existingTransactions.length !== input.transactionIds.length) {
				throw new Error(
					"Some transactions not found or you don't have permission to edit them",
				);
			}

			// Update all transactions to the new wallet
			const updatedTransactions = await ctx.db
				.update(transactions)
				.set({
					walletId: input.walletId,
					updatedAt: new Date(),
				})
				.where(
					and(
						inArray(transactions.id, input.transactionIds),
						eq(transactions.userId, ctx.session.user.id),
					),
				)
				.returning({ id: transactions.id });

			return {
				success: true,
				updatedCount: updatedTransactions.length,
				message: `Successfully moved ${updatedTransactions.length} transactions to ${wallet[0].name}`,
			};
		}),
});
