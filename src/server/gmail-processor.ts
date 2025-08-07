import { and, eq } from "drizzle-orm";
import { google } from "googleapis";
// import { publishers } from "~/lib/pubsub-client";
import { parseTransactionEmail } from "./api/gmail";
import { db } from "./db";
import { transactions, wallets } from "./db/schema";
import { getUserAccessToken } from "./gmail-setup";

interface GmailNotification {
	emailAddress: string;
	historyId: string;
	messageId?: string;
	threadId?: string;
}

// Process Gmail webhook notification with user context
export async function processGmailWebhook(notification: GmailNotification) {
	console.log("📧 Processing Gmail webhook:", notification);

	try {
		const { emailAddress, historyId } = notification;

		// Get user by email address
		const user = await getUserByEmail(emailAddress);
		if (!user) {
			console.log(`❌ User not found for email: ${emailAddress}`);
			return;
		}

		// Get user's access token
		const accessToken = await getUserAccessToken(user.userId);
		if (!accessToken) {
			console.log(`❌ No valid access token for user: ${user.userId}`);
			return;
		}

		// Process user's emails
		await processUserEmails(user.userId, accessToken, historyId);
	} catch (error) {
		console.error("❌ Error processing Gmail webhook:", error);
		throw error;
	}
}

// Process emails for a specific user
async function processUserEmails(
	userId: string,
	accessToken: string,
	historyId: string,
) {
	try {
		console.log(`📨 Processing emails for user: ${userId}`);

		const oauth2Client = new google.auth.OAuth2();
		oauth2Client.setCredentials({ access_token: accessToken });

		const gmail = google.gmail({ version: "v1", auth: oauth2Client });

		// Get the latest emails using the history ID
		const history = await gmail.users.history.list({
			userId: "me",
			startHistoryId: historyId,
			historyTypes: ["messageAdded"],
		});

		if (!history.data.history || history.data.history.length === 0) {
			console.log("📭 No new messages found");
			return;
		}

		console.log(`📬 Found ${history.data.history.length} history records`);

		// Process each new message
		for (const historyRecord of history.data.history) {
			if (historyRecord.messagesAdded) {
				for (const messageAdded of historyRecord.messagesAdded) {
					if (messageAdded.message?.id) {
						await processSingleEmail(
							userId,
							accessToken,
							messageAdded.message.id,
						);
					}
				}
			}
		}
	} catch (error) {
		console.error(`❌ Error processing emails for user ${userId}:`, error);
		throw error;
	}
}

// Process a single email
async function processSingleEmail(
	userId: string,
	accessToken: string,
	messageId: string,
) {
	try {
		console.log(`📧 Processing email: ${messageId}`);

		const oauth2Client = new google.auth.OAuth2();
		oauth2Client.setCredentials({ access_token: accessToken });

		const gmail = google.gmail({ version: "v1", auth: oauth2Client });

		// Get the full message
		const message = await gmail.users.messages.get({
			userId: "me",
			id: messageId,
			format: "full",
		});

		const messageData = message.data;
		if (!messageData) {
			console.log("❌ No message data found");
			return;
		}

		// Extract email details
		const headers = messageData.payload?.headers || [];
		const fromHeader = headers.find((h) => h.name === "From");
		const subjectHeader = headers.find((h) => h.name === "Subject");
		const dateHeader = headers.find((h) => h.name === "Date");

		const fromEmail = fromHeader?.value || "";
		const subject = subjectHeader?.value || "";
		const receivedDate = dateHeader?.value
			? new Date(dateHeader.value)
			: new Date();

		console.log(`📋 Email details:
      From: ${fromEmail}
      Subject: ${subject}
      Date: ${receivedDate.toISOString()}
    `);

		// Check if it's a bank email
		const isBankEmail = /mandiri|bca|bni|bri|bank/i.test(fromEmail);

		if (!isBankEmail) {
			console.log("❌ Not a bank email, skipping...");
			return;
		}

		console.log("✅ Bank email detected! Processing transaction...");

		// Parse the email for transaction data
		const parsedTransaction = parseTransactionEmail(messageData as any);

		if (!parsedTransaction) {
			console.log("❌ Could not parse transaction from email");
			return;
		}

		console.log("💰 Transaction parsed:", {
			amount: parsedTransaction.amount,
			direction: parsedTransaction.direction,
			recipient: parsedTransaction.recipient,
			transactionRefNo: parsedTransaction.transactionRefNo,
		});

		// Save transaction to database
		await saveTransaction(userId, parsedTransaction, messageId);
	} catch (error) {
		console.error(`❌ Error processing email ${messageId}:`, error);
	}
}

// Save transaction to database with proper wallet mapping
async function saveTransaction(
	userId: string,
	parsedTransaction: any,
	messageId: string,
) {
	try {
		// Check if transaction already exists
		const existingTransaction = await db
			.select()
			.from(transactions)
			.where(
				and(
					eq(transactions.transactionRefNo, parsedTransaction.transactionRefNo),
					eq(transactions.userId, userId),
				),
			)
			.limit(1);

		if (existingTransaction.length > 0) {
			console.log("📋 Transaction already exists, skipping...");
			return;
		}

		// Find matching wallet based on bank sender
		let targetWallet = await db
			.select()
			.from(wallets)
			.where(
				and(
					eq(wallets.userId, userId),
					eq(
						wallets.bankCode,
						parsedTransaction.bankSender?.toLowerCase() || "unknown",
					),
				),
			)
			.limit(1);

		if (!targetWallet[0]) {
			// Use uncategorized wallet
			targetWallet = await db
				.select()
				.from(wallets)
				.where(
					and(eq(wallets.userId, userId), eq(wallets.name, "Uncategorized")),
				)
				.limit(1);
		}

		if (targetWallet[0]) {
			// Insert new transaction
			const newTransaction = await db
				.insert(transactions)
				.values({
					userId: userId,
					walletId: targetWallet[0].id,
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

			// Publish wallet update notification
			if (newTransaction[0]) {
				// await publishers.publishWalletUpdate({
				//   userId: userId,
				//   walletId: targetWallet[0].id,
				//   transactionId: newTransaction[0].id,
				//   amount: parsedTransaction.amount,
				//   type: parsedTransaction.direction === "debit" ? "debit" : "credit",
				//   balance: 0, // You should calculate actual balance here
				//   updatedAt: new Date().toISOString(),
				// });

				// // Publish user notification
				// await publishers.publishNotificationEvent({
				//   userId: userId,
				//   type: "transaction",
				//   title: "New Transaction",
				//   message: `${parsedTransaction.direction === "debit" ? "Debit" : "Credit"} of ${parsedTransaction.currency} ${parsedTransaction.amount.toLocaleString()}`,
				//   data: {
				//   transactionId: newTransaction[0].id,
				//   amount: parsedTransaction.amount,
				//   recipient: parsedTransaction.recipient,
				//   transactionRefNo: parsedTransaction.transactionRefNo,
				//   },
				//   priority: "medium",
				//   createdAt: new Date().toISOString(),
				// });

				console.log("✅ Transaction saved successfully:", newTransaction[0].id);
			}
		} else {
			console.log("❌ No wallet found for user, cannot save transaction");
		}
	} catch (error) {
		console.error("❌ Error saving transaction:", error);
		throw error;
	}
}

// Get user by email address (placeholder - implement based on your user schema)
async function getUserByEmail(emailAddress: string) {
	try {
		// This is a placeholder - you need to implement this based on your user schema
		// You might need to add an email field to your users table or create a mapping table

		// For now, we'll assume the email address is the userId
		// In a real implementation, you'd query your users table
		return {
			userId: emailAddress, // This should be the actual user ID from your users table
			email: emailAddress,
		};
	} catch (error) {
		console.error("❌ Error getting user by email:", error);
		return null;
	}
}
