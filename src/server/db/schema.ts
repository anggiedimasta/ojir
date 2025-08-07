import { sql } from "drizzle-orm";
import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	index,
	integer,
	pgTable,
	pgTableCreator,
	primaryKey,
	text,
	timestamp,
	uuid,
	varchar,
} from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `ojir_${name}`);

// Auth tables (no prefix - NextAuth expects these exact names)
export const authUsers = pgTable("user", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: varchar("name", { length: 255 }),
	email: varchar("email", { length: 255 }).notNull(),
	emailVerified: timestamp("email_verified", {
		mode: "date",
		withTimezone: true,
	}).default(sql`CURRENT_TIMESTAMP`),
	image: varchar("image", { length: 255 }),
});

export const authAccounts = pgTable(
	"account",
	{
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => authUsers.id, { onDelete: "cascade" }),
		type: varchar("type", { length: 255 })
			.$type<AdapterAccount["type"]>()
			.notNull(),
		provider: varchar("provider", { length: 255 }).notNull(),
		providerAccountId: varchar("provider_account_id", {
			length: 255,
		}).notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: varchar("token_type", { length: 255 }),
		scope: varchar("scope", { length: 255 }),
		id_token: text("id_token"),
		session_state: varchar("session_state", { length: 255 }),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
		userIdIdx: index("auth_account_user_id_idx").on(account.userId),
	}),
);

export const authSessions = pgTable(
	"session",
	{
		sessionToken: varchar("session_token", { length: 255 })
			.notNull()
			.primaryKey(),
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => authUsers.id, { onDelete: "cascade" }),
		expires: timestamp("expires", {
			mode: "date",
			withTimezone: true,
		}).notNull(),
	},
	(session) => ({
		userIdIdx: index("auth_session_user_id_idx").on(session.userId),
	}),
);

export const authVerificationTokens = pgTable(
	"verification_token",
	{
		identifier: varchar("identifier", { length: 255 }).notNull(),
		token: varchar("token", { length: 255 }).notNull(),
		expires: timestamp("expires", {
			mode: "date",
			withTimezone: true,
		}).notNull(),
	},
	(vt) => ({
		compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
	}),
);

// App tables (with ojir_ prefix)
// Remove duplicate users table - we'll use NextAuth.js authUsers directly
// export const users = createTable("user", {...}) - REMOVED

// Update authUsers relations to include our app tables
export const calendarEvents = createTable("calendar_event", {
	id: varchar("id", { length: 255 })
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	title: varchar("title", { length: 255 }).notNull(),
	description: text("description"),
	startTime: timestamp("start_date", {
		mode: "date",
		withTimezone: true,
	}).notNull(),
	endTime: timestamp("end_date", {
		mode: "date",
		withTimezone: true,
	}).notNull(),
	userId: varchar("user_id", { length: 255 })
		.notNull()
		.references(() => authUsers.id, { onDelete: "cascade" }),
	createdAt: timestamp("created_at", {
		mode: "date",
		withTimezone: true,
	}).default(sql`CURRENT_TIMESTAMP`),
	updatedAt: timestamp("updated_at", {
		mode: "date",
		withTimezone: true,
	}),
});

export const calendarEventsRelations = relations(calendarEvents, ({ one }) => ({
	user: one(authUsers, {
		fields: [calendarEvents.userId],
		references: [authUsers.id],
	}),
}));

export const transactions = createTable(
	"transaction",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => authUsers.id),
		walletId: varchar("wallet_id", { length: 255 })
			.notNull()
			.references(() => wallets.id, { onDelete: "cascade" }), // Required: transactions must belong to a wallet
		recipient: varchar("recipient", { length: 255 }).notNull(),
		location: varchar("location", { length: 255 }),
		transactionDate: timestamp("transaction_date", {
			mode: "date",
			withTimezone: true,
		}).notNull(),
		amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
		fee: decimal("fee", { precision: 15, scale: 2 }).notNull().default("0.00"),
		totalAmount: decimal("total_amount", { precision: 15, scale: 2 })
			.notNull()
			.default("0.00"),
		currency: varchar("currency", { length: 10 }).notNull().default("IDR"),
		transactionRefNo: varchar("transaction_ref_no", { length: 255 }),
		qrisRefNo: varchar("qris_ref_no", { length: 255 }),
		merchantPan: varchar("merchant_pan", { length: 255 }),
		customerPan: varchar("customer_pan", { length: 255 }),
		acquirer: varchar("acquirer", { length: 255 }),
		terminalId: varchar("terminal_id", { length: 255 }),
		sourceOfFund: text("source_of_fund"),
		sourceAccount: text("source_account"),
		recipientBank: varchar("recipient_bank", { length: 255 }),
		recipientBankAccount: varchar("recipient_bank_account", { length: 255 }),
		transferPurpose: varchar("transfer_purpose", { length: 255 }),
		bankSender: varchar("bank_sender", { length: 255 }),
		emailSubject: varchar("email_subject", { length: 500 }),
		transactionType: varchar("transaction_type", { length: 100 }),
		status: varchar("status", { length: 50 }),
		direction: text("direction").notNull().default("out"),
		virtualAccountNo: varchar("virtual_account_no", { length: 255 }),
		categoryId: varchar("category_id", { length: 255 }).references(
			() => categories.id,
		),
		subcategoryId: varchar("subcategory_id", { length: 255 }).references(
			() => subcategories.id,
		),
		createdAt: timestamp("created_at", { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
	},
	(transaction) => ({
		userIdIdx: index("user_id_idx").on(transaction.userId),
		walletIdIdx: index("wallet_id_idx").on(transaction.walletId),
		transactionDateIdx: index("transaction_date_idx").on(
			transaction.transactionDate,
		),
		transactionRefIdx: index("transaction_ref_idx").on(
			transaction.transactionRefNo,
		),
		feeIdx: index("transaction_fee_idx").on(transaction.fee),
		totalAmountIdx: index("transaction_total_amount_idx").on(
			transaction.totalAmount,
		),
		recipientBankIdx: index("transaction_recipient_bank_idx").on(
			transaction.recipientBank,
		),
		transferPurposeIdx: index("transaction_transfer_purpose_idx").on(
			transaction.transferPurpose,
		),
	}),
);

// Master data tables for filtering options
export const banks = createTable(
	"bank",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		code: varchar("code", { length: 50 }).notNull().unique(), // e.g., 'mandiri', 'bca'
		name: varchar("name", { length: 255 }).notNull(), // e.g., 'Bank Mandiri', 'Bank BCA'
		displayName: varchar("display_name", { length: 255 }).notNull(), // e.g., 'Bank Mandiri', 'Bank BCA'
		iconPath: varchar("icon_path", { length: 500 }), // Path to bank icon
		isActive: boolean("is_active").notNull().default(true),
		sortOrder: integer("sort_order").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
	},
	(bank) => ({
		codeIdx: index("bank_code_idx").on(bank.code),
		isActiveIdx: index("bank_is_active_idx").on(bank.isActive),
	}),
);

// User wallets table
export const wallets = createTable(
	"wallet",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => authUsers.id, { onDelete: "cascade" }),
		name: varchar("name", { length: 255 }).notNull(), // e.g., 'Mandiri Debit', 'BCA Savings'
		type: varchar("type", { length: 50 }).notNull(), // e.g., 'debit', 'credit', 'savings'
		bankCode: varchar("bank_code", { length: 50 }).notNull(), // References banks.code
		accountNumber: varchar("account_number", { length: 255 }), // Masked account number
		balance: decimal("balance", { precision: 15, scale: 2 })
			.notNull()
			.default("0"),
		currency: varchar("currency", { length: 10 }).notNull().default("IDR"),
		isActive: boolean("is_active").notNull().default(true),
		isDefault: boolean("is_default").notNull().default(false), // Only one default per user
		color: varchar("color", { length: 20 }), // e.g., 'blue', 'green', 'red'
		icon: varchar("icon", { length: 100 }), // e.g., 'credit-card', 'wallet', 'bank'
		createdAt: timestamp("created_at", { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
	},
	(wallet) => ({
		userIdIdx: index("wallet_user_id_idx").on(wallet.userId),
		bankCodeIdx: index("wallet_bank_code_idx").on(wallet.bankCode),
		isActiveIdx: index("wallet_is_active_idx").on(wallet.isActive),
		isDefaultIdx: index("wallet_is_default_idx").on(wallet.isDefault),
	}),
);

export const paymentMethods = createTable(
	"payment_method",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		code: varchar("code", { length: 50 }).notNull().unique(), // e.g., 'qris', 'transfer'
		name: varchar("name", { length: 255 }).notNull(), // e.g., 'QRIS', 'Bank Transfer'
		displayName: varchar("display_name", { length: 255 }).notNull(), // e.g., 'QRIS', 'Bank Transfer'
		description: text("description"), // Optional description
		iconPath: varchar("icon_path", { length: 500 }), // Path to payment method icon
		isActive: boolean("is_active").notNull().default(true),
		sortOrder: integer("sort_order").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
	},
	(paymentMethod) => ({
		codeIdx: index("payment_method_code_idx").on(paymentMethod.code),
		isActiveIdx: index("payment_method_is_active_idx").on(
			paymentMethod.isActive,
		),
	}),
);

// User Gmail OAuth tokens table
export const userGmailTokens = createTable(
	"user_gmail_tokens",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => authUsers.id, { onDelete: "cascade" }),
		accessToken: text("access_token").notNull(),
		refreshToken: text("refresh_token").notNull(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
	},
	(userGmailToken) => ({
		userIdIdx: index("user_gmail_token_user_id_idx").on(userGmailToken.userId),
		expiresAtIdx: index("user_gmail_token_expires_at_idx").on(
			userGmailToken.expiresAt,
		),
	}),
);

// Relations - All relations defined after table definitions
export const authUsersRelations = relations(authUsers, ({ many }) => ({
	accounts: many(authAccounts),
	sessions: many(authSessions),
	calendarEvents: many(calendarEvents),
	transactions: many(transactions),
	wallets: many(wallets),
	gmailTokens: many(userGmailTokens),
}));

export const authAccountsRelations = relations(authAccounts, ({ one }) => ({
	user: one(authUsers, {
		fields: [authAccounts.userId],
		references: [authUsers.id],
	}),
}));

export const authSessionsRelations = relations(authSessions, ({ one }) => ({
	user: one(authUsers, {
		fields: [authSessions.userId],
		references: [authUsers.id],
	}),
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
	user: one(authUsers, {
		fields: [transactions.userId],
		references: [authUsers.id],
	}),
	wallet: one(wallets, {
		fields: [transactions.walletId],
		references: [wallets.id],
	}),
	category: one(categories, {
		fields: [transactions.categoryId],
		references: [categories.id],
	}),
	subcategory: one(subcategories, {
		fields: [transactions.subcategoryId],
		references: [subcategories.id],
	}),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
	user: one(authUsers, {
		fields: [wallets.userId],
		references: [authUsers.id],
	}),
	bank: one(banks, {
		fields: [wallets.bankCode],
		references: [banks.code],
	}),
	transactions: many(transactions),
}));

export const banksRelations = relations(banks, ({ many }) => ({
	wallets: many(wallets),
}));

export const userGmailTokensRelations = relations(
	userGmailTokens,
	({ one }) => ({
		user: one(authUsers, {
			fields: [userGmailTokens.userId],
			references: [authUsers.id],
		}),
	}),
);

// Category tables
export const categories = createTable(
	"category",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: varchar("name", { length: 255 }).notNull(),
		icon: varchar("icon", { length: 50 }),
		color: varchar("color", { length: 7 }).notNull(), // hex color
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => authUsers.id, { onDelete: "cascade" }),
		isDefault: boolean("is_default").default(false).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
	},
	(category) => ({
		userIdIdx: index("category_user_id_idx").on(category.userId),
	}),
);

export const subcategories = createTable(
	"subcategory",
	{
		id: varchar("id", { length: 255 })
			.notNull()
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		name: varchar("name", { length: 255 }).notNull(),
		icon: varchar("icon", { length: 50 }),
		color: varchar("color", { length: 7 }).notNull(), // hex color
		categoryId: varchar("category_id", { length: 255 })
			.notNull()
			.references(() => categories.id, { onDelete: "cascade" }),
		userId: varchar("user_id", { length: 255 })
			.notNull()
			.references(() => authUsers.id, { onDelete: "cascade" }),
		isDefault: boolean("is_default").default(false).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
	},
	(subcategory) => ({
		categoryIdIdx: index("subcategory_category_id_idx").on(
			subcategory.categoryId,
		),
		userIdIdx: index("subcategory_user_id_idx").on(subcategory.userId),
	}),
);

// Category relations
export const categoriesRelations = relations(categories, ({ one, many }) => ({
	user: one(authUsers, {
		fields: [categories.userId],
		references: [authUsers.id],
	}),
	subcategories: many(subcategories),
	transactions: many(transactions),
}));

export const subcategoriesRelations = relations(
	subcategories,
	({ one, many }) => ({
		user: one(authUsers, {
			fields: [subcategories.userId],
			references: [authUsers.id],
		}),
		category: one(categories, {
			fields: [subcategories.categoryId],
			references: [categories.id],
		}),
		transactions: many(transactions),
	}),
);
