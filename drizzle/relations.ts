import { relations } from "drizzle-orm/relations";
import {
  ojirBank,
  ojirCalendarEvent,
  ojirCategory,
  ojirSubcategory,
  ojirTransaction,
  ojirUserGmailTokens,
  ojirWallet,
  user,
} from "./schema";

export const ojirWalletRelations = relations(ojirWallet, ({ one, many }) => ({
  user: one(user, {
    fields: [ojirWallet.userId],
    references: [user.id],
  }),
  ojirBank: one(ojirBank, {
    fields: [ojirWallet.bankCode],
    references: [ojirBank.code],
  }),
  ojirTransactions: many(ojirTransaction),
}));

export const userRelations = relations(user, ({ many }) => ({
  ojirWallets: many(ojirWallet),
  ojirTransactions: many(ojirTransaction),
  ojirCalendarEvents: many(ojirCalendarEvent),
  ojirUserGmailTokens: many(ojirUserGmailTokens),
}));

export const ojirBankRelations = relations(ojirBank, ({ many }) => ({
  ojirWallets: many(ojirWallet),
}));

export const ojirTransactionRelations = relations(
  ojirTransaction,
  ({ one }) => ({
    ojirCategory: one(ojirCategory, {
      fields: [ojirTransaction.categoryId],
      references: [ojirCategory.id],
    }),
    ojirSubcategory: one(ojirSubcategory, {
      fields: [ojirTransaction.subcategoryId],
      references: [ojirSubcategory.id],
    }),
    user: one(user, {
      fields: [ojirTransaction.userId],
      references: [user.id],
    }),
    ojirWallet: one(ojirWallet, {
      fields: [ojirTransaction.walletId],
      references: [ojirWallet.id],
    }),
  }),
);

export const ojirCategoryRelations = relations(ojirCategory, ({ many }) => ({
  ojirTransactions: many(ojirTransaction),
}));

export const ojirSubcategoryRelations = relations(
  ojirSubcategory,
  ({ many }) => ({
    ojirTransactions: many(ojirTransaction),
  }),
);

export const ojirCalendarEventRelations = relations(
  ojirCalendarEvent,
  ({ one }) => ({
    user: one(user, {
      fields: [ojirCalendarEvent.userId],
      references: [user.id],
    }),
  }),
);

export const ojirUserGmailTokensRelations = relations(
  ojirUserGmailTokens,
  ({ one }) => ({
    user: one(user, {
      fields: [ojirUserGmailTokens.userId],
      references: [user.id],
    }),
  }),
);
