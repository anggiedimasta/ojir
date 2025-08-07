import { relations } from "drizzle-orm/relations";
import {
	ojirAccount,
	ojirCalendarEvent,
	ojirSession,
	ojirTransaction,
	ojirUser,
} from "./schema";

export const ojirTransactionRelations = relations(
	ojirTransaction,
	({ one }) => ({
		user: one(ojirUser, {
			fields: [ojirTransaction.userId],
			references: [ojirUser.id],
		}),
	}),
);

export const userRelations = relations(ojirUser, ({ many }) => ({
	ojirTransactions: many(ojirTransaction),
}));

export const ojirCalendarEventRelations = relations(
	ojirCalendarEvent,
	({ one }) => ({
		ojirUser: one(ojirUser, {
			fields: [ojirCalendarEvent.userId],
			references: [ojirUser.id],
		}),
	}),
);

export const ojirUserRelations = relations(ojirUser, ({ many }) => ({
	ojirCalendarEvents: many(ojirCalendarEvent),
	ojirSessions: many(ojirSession),
	ojirAccounts: many(ojirAccount),
}));

export const ojirSessionRelations = relations(ojirSession, ({ one }) => ({
	ojirUser: one(ojirUser, {
		fields: [ojirSession.userId],
		references: [ojirUser.id],
	}),
}));

export const ojirAccountRelations = relations(ojirAccount, ({ one }) => ({
	ojirUser: one(ojirUser, {
		fields: [ojirAccount.userId],
		references: [ojirUser.id],
	}),
}));
