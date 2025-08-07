import { sql } from "drizzle-orm";
import {
	boolean,
	foreignKey,
	index,
	integer,
	numeric,
	pgTable,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const ojirTransaction = pgTable(
	"ojir_transaction",
	{
		id: varchar({ length: 255 }).primaryKey().notNull(),
		userId: varchar("user_id", { length: 255 }).notNull(),
		transactionRefNo: varchar("transaction_ref_no", { length: 255 }),
		qrisRefNo: varchar("qris_ref_no", { length: 255 }),
		merchantPan: varchar("merchant_pan", { length: 255 }),
		customerPan: varchar("customer_pan", { length: 255 }),
		terminalId: varchar("terminal_id", { length: 255 }),
		recipient: varchar({ length: 255 }).notNull(),
		location: varchar({ length: 255 }),
		amount: numeric({ precision: 15, scale: 2 }).notNull(),
		currency: varchar({ length: 10 }).default("IDR").notNull(),
		transactionDate: timestamp("transaction_date", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		sourceOfFund: varchar("source_of_fund", { length: 255 }),
		sourceAccount: varchar("source_account", { length: 255 }),
		acquirer: varchar({ length: 255 }),
		bankSender: varchar("bank_sender", { length: 255 }),
		emailSubject: varchar("email_subject", { length: 500 }),
		transactionType: varchar("transaction_type", { length: 100 }),
		status: varchar({ length: 50 }),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
		direction: text().default("out").notNull(),
		virtualAccountNo: varchar("virtual_account_no", { length: 255 }),
		categoryId: varchar("category_id", { length: 255 }),
		subcategoryId: varchar("subcategory_id", { length: 255 }),
	},
	(table) => [
		index("transaction_date_idx").using(
			"btree",
			table.transactionDate.asc().nullsLast().op("timestamptz_ops"),
		),
		index("transaction_ref_idx").using(
			"btree",
			table.transactionRefNo.asc().nullsLast().op("text_ops"),
		),
		index("user_id_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [ojirUser.id],
			name: "ojir_transaction_user_id_user_id_fk",
		}),
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [ojirCategory.id],
			name: "ojir_transaction_category_id_ojir_category_id_fk",
		}),
		foreignKey({
			columns: [table.subcategoryId],
			foreignColumns: [ojirSubcategory.id],
			name: "ojir_transaction_subcategory_id_ojir_subcategory_id_fk",
		}),
	],
);

export const ojirUser = pgTable("user", {
	id: varchar({ length: 255 }).primaryKey().notNull(),
	name: varchar({ length: 255 }),
	email: varchar({ length: 255 }).notNull(),
	emailVerified: timestamp("email_verified", {
		withTimezone: true,
		mode: "string",
	}).default(sql`CURRENT_TIMESTAMP`),
	image: varchar({ length: 255 }),
});

export const ojirCalendarEvent = pgTable(
	"ojir_calendar_event",
	{
		id: varchar({ length: 255 }).primaryKey().notNull(),
		title: varchar({ length: 255 }).notNull(),
		description: text(),
		startTime: timestamp("start_time", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		endTime: timestamp("end_time", {
			withTimezone: true,
			mode: "string",
		}).notNull(),
		userId: varchar("user_id", { length: 255 }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
	},
	(table) => [
		index("calendar_event_user_id_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [ojirUser.id],
			name: "ojir_calendar_event_user_id_ojir_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const ojirSession = pgTable(
	"ojir_session",
	{
		sessionToken: varchar("session_token", { length: 255 })
			.primaryKey()
			.notNull(),
		userId: varchar("user_id", { length: 255 }).notNull(),
		expires: timestamp({ withTimezone: true, mode: "string" }).notNull(),
	},
	(table) => [
		index("session_user_id_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [ojirUser.id],
			name: "ojir_session_user_id_ojir_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const ojirVerificationToken = pgTable(
	"ojir_verification_token",
	{
		identifier: varchar({ length: 255 }).notNull(),
		token: varchar({ length: 255 }).notNull(),
		expires: timestamp({ withTimezone: true, mode: "string" }).notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.identifier, table.token],
			name: "ojir_verification_token_identifier_token_pk",
		}),
	],
);

export const ojirAccount = pgTable(
	"account",
	{
		userId: varchar("user_id", { length: 255 }).notNull(),
		type: varchar({ length: 255 }).notNull(),
		provider: varchar({ length: 255 }).notNull(),
		providerAccountId: varchar("provider_account_id", {
			length: 255,
		}).notNull(),
		refreshToken: text("refresh_token"),
		accessToken: text("access_token"),
		expiresAt: integer("expires_at"),
		tokenType: varchar("token_type", { length: 255 }),
		scope: varchar({ length: 255 }),
		idToken: text("id_token"),
		sessionState: varchar("session_state", { length: 255 }),
	},
	(table) => [
		index("account_user_id_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [ojirUser.id],
			name: "ojir_account_user_id_ojir_user_id_fk",
		}).onDelete("cascade"),
		primaryKey({
			columns: [table.provider, table.providerAccountId],
			name: "ojir_account_provider_provider_account_id_pk",
		}),
	],
);

// Category tables
export const ojirCategory = pgTable(
	"ojir_category",
	{
		id: varchar({ length: 255 }).primaryKey().notNull(),
		name: varchar({ length: 255 }).notNull(),
		icon: varchar({ length: 50 }),
		color: varchar({ length: 7 }).notNull(), // hex color
		userId: varchar("user_id", { length: 255 }).notNull(),
		isDefault: boolean().default(false).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
	},
	(table) => [
		index("category_user_id_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [ojirUser.id],
			name: "ojir_category_user_id_ojir_user_id_fk",
		}).onDelete("cascade"),
	],
);

export const ojirSubcategory = pgTable(
	"ojir_subcategory",
	{
		id: varchar({ length: 255 }).primaryKey().notNull(),
		name: varchar({ length: 255 }).notNull(),
		icon: varchar({ length: 50 }),
		color: varchar({ length: 7 }).notNull(), // hex color
		categoryId: varchar("category_id", { length: 255 }).notNull(),
		userId: varchar("user_id", { length: 255 }).notNull(),
		isDefault: boolean().default(false).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
	},
	(table) => [
		index("subcategory_category_id_idx").using(
			"btree",
			table.categoryId.asc().nullsLast().op("text_ops"),
		),
		index("subcategory_user_id_idx").using(
			"btree",
			table.userId.asc().nullsLast().op("text_ops"),
		),
		foreignKey({
			columns: [table.categoryId],
			foreignColumns: [ojirCategory.id],
			name: "ojir_subcategory_category_id_ojir_category_id_fk",
		}).onDelete("cascade"),
		foreignKey({
			columns: [table.userId],
			foreignColumns: [ojirUser.id],
			name: "ojir_subcategory_user_id_ojir_user_id_fk",
		}).onDelete("cascade"),
	],
);
