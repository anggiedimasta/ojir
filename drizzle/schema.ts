import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: varchar({ length: 255 }).primaryKey().notNull(),
  name: varchar({ length: 255 }),
  email: varchar({ length: 255 }).notNull().unique(),
  emailVerified: timestamp("email_verified", {
    withTimezone: true,
    mode: "string",
  }),
  image: varchar({ length: 255 }),
});

export const ojirPaymentMethod = pgTable("ojir_payment_method", {
  code: varchar({ length: 50 }).primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  icon: varchar({ length: 255 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
});

export const ojirWallet = pgTable(
  "ojir_wallet",
  {
    id: varchar({ length: 255 })
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    type: varchar({ length: 50 }).notNull(),
    bankCode: varchar("bank_code", { length: 50 }).notNull(),
    accountNumber: varchar("account_number", { length: 255 }),
    balance: numeric({ precision: 15, scale: 2 }).default("0").notNull(),
    currency: varchar({ length: 10 }).default("IDR").notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
    color: varchar({ length: 20 }),
    icon: varchar({ length: 100 }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("wallet_bank_code_idx").using(
      "btree",
      table.bankCode.asc().nullsLast().op("text_ops"),
    ),
    index("wallet_is_active_idx").using(
      "btree",
      table.isActive.asc().nullsLast().op("bool_ops"),
    ),
    index("wallet_is_default_idx").using(
      "btree",
      table.isDefault.asc().nullsLast().op("bool_ops"),
    ),
    index("wallet_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "ojir_wallet_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.bankCode],
      foreignColumns: [ojirBank.code],
      name: "ojir_wallet_bank_code_fkey",
    }),
  ],
);

export const ojirTransaction = pgTable(
  "ojir_transaction",
  {
    id: varchar({ length: 255 })
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    walletId: varchar("wallet_id", { length: 255 }).notNull(),
    recipient: varchar({ length: 1000 }).notNull(),
    location: varchar({ length: 1000 }),
    amount: numeric({ precision: 15, scale: 2 }).notNull(),
    currency: varchar({ length: 10 }).default("IDR").notNull(),
    transactionDate: timestamp("transaction_date", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    transactionRefNo: varchar("transaction_ref_no", { length: 255 }),
    qrisRefNo: varchar("qris_ref_no", { length: 255 }),
    merchantPan: varchar("merchant_pan", { length: 255 }),
    customerPan: varchar("customer_pan", { length: 255 }),
    acquirer: varchar({ length: 255 }),
    terminalId: varchar("terminal_id", { length: 255 }),
    sourceOfFund: text("source_of_fund"),
    sourceAccount: text("source_account"),
    bankSender: varchar("bank_sender", { length: 255 }),
    emailSubject: varchar("email_subject", { length: 255 }),
    transactionType: varchar("transaction_type", { length: 255 }),
    status: varchar({ length: 50 }).default("completed").notNull(),
    direction: varchar({ length: 10 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    fee: numeric({ precision: 15, scale: 2 }).default("0.00").notNull(),
    totalAmount: numeric("total_amount", { precision: 15, scale: 2 })
      .default("0.00")
      .notNull(),
    recipientBank: varchar("recipient_bank", { length: 255 }),
    recipientBankAccount: varchar("recipient_bank_account", { length: 255 }),
    transferPurpose: varchar("transfer_purpose", { length: 1000 }),
    categoryId: varchar("category_id", { length: 255 }),
    subcategoryId: varchar("subcategory_id", { length: 255 }),
  },
  (table) => [
    index("transaction_date_idx").using(
      "btree",
      table.transactionDate.asc().nullsLast().op("timestamptz_ops"),
    ),
    index("transaction_direction_idx").using(
      "btree",
      table.direction.asc().nullsLast().op("text_ops"),
    ),
    index("transaction_fee_idx").using(
      "btree",
      table.fee.asc().nullsLast().op("numeric_ops"),
    ),
    index("transaction_recipient_bank_idx").using(
      "btree",
      table.recipientBank.asc().nullsLast().op("text_ops"),
    ),
    index("transaction_total_amount_idx").using(
      "btree",
      table.totalAmount.asc().nullsLast().op("numeric_ops"),
    ),
    index("transaction_transfer_purpose_idx").using(
      "btree",
      table.transferPurpose.asc().nullsLast().op("text_ops"),
    ),
    index("transaction_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    index("transaction_wallet_id_idx").using(
      "btree",
      table.walletId.asc().nullsLast().op("text_ops"),
    ),
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
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "ojir_transaction_user_id_fkey",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.walletId],
      foreignColumns: [ojirWallet.id],
      name: "ojir_transaction_wallet_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const ojirBank = pgTable(
  "ojir_bank",
  {
    code: varchar({ length: 50 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    logo: varchar({ length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    id: varchar({ length: 255 }).default(sql`gen_random_uuid()`),
    displayName: varchar("display_name", { length: 255 }).default("").notNull(),
    iconPath: varchar("icon_path", { length: 500 }),
    sortOrder: integer("sort_order").default(0).notNull(),
  },
  (table) => [
    index("bank_code_idx").using(
      "btree",
      table.code.asc().nullsLast().op("text_ops"),
    ),
    index("bank_is_active_idx").using(
      "btree",
      table.isActive.asc().nullsLast().op("bool_ops"),
    ),
    unique("ojir_bank_code_unique").on(table.code),
  ],
);

export const ojirCalendarEvent = pgTable(
  "ojir_calendar_event",
  {
    id: varchar({ length: 255 })
      .default(sql`gen_random_uuid()`)
      .primaryKey()
      .notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    title: varchar({ length: 255 }).notNull(),
    description: text(),
    startDate: timestamp("start_date", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    endDate: timestamp("end_date", { withTimezone: true, mode: "string" }),
    location: varchar({ length: 255 }),
    isAllDay: boolean("is_all_day").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("calendar_event_start_date_idx").using(
      "btree",
      table.startDate.asc().nullsLast().op("timestamptz_ops"),
    ),
    index("calendar_event_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "ojir_calendar_event_user_id_fkey",
    }).onDelete("cascade"),
  ],
);

export const ojirUserGmailTokens = pgTable(
  "ojir_user_gmail_tokens",
  {
    id: varchar({ length: 255 }).primaryKey().notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    accessToken: text("access_token").notNull(),
    refreshToken: text("refresh_token").notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "string",
    }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
  },
  (table) => [
    index("user_gmail_token_expires_at_idx").using(
      "btree",
      table.expiresAt.asc().nullsLast().op("timestamptz_ops"),
    ),
    index("user_gmail_token_user_id_idx").using(
      "btree",
      table.userId.asc().nullsLast().op("text_ops"),
    ),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "ojir_user_gmail_tokens_user_id_user_id_fk",
    }).onDelete("cascade"),
  ],
);

export const ojirCategory = pgTable(
  "ojir_category",
  {
    id: varchar({ length: 255 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    icon: varchar({ length: 50 }),
    color: varchar({ length: 20 }).notNull(), // Tailwind color name (e.g., "blue", "red", "green")
    userId: varchar("user_id", { length: 255 }).notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
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
  ],
);

export const ojirSubcategory = pgTable(
  "ojir_subcategory",
  {
    id: varchar({ length: 255 }).primaryKey().notNull(),
    name: varchar({ length: 255 }).notNull(),
    icon: varchar({ length: 50 }),
    color: varchar({ length: 20 }).notNull(), // Tailwind color name (e.g., "blue", "red", "green")
    colorIntensity: integer("color_intensity").notNull().default(100), // Tailwind color intensity (100, 200, 300, etc.)
    categoryId: varchar("category_id", { length: 255 }).notNull(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    isDefault: boolean("is_default").default(false).notNull(),
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
  ],
);
