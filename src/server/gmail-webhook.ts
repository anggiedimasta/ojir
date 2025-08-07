import { gmail } from 'googleapis';
import { parseEmailContent } from '../api/gmail';
import { db } from '../db';
import { transactions } from '../db/schema';
import { eq } from 'drizzle-orm';

// Gmail API setup
const auth = new gmail.auth.GoogleAuth({
  keyFile: './google-service-account.json',
  scopes: ['https://www.googleapis.com/auth/gmail.readonly'],
});

const gmailClient = gmail({ version: 'v1', auth });

interface GmailNotification {
  emailAddress: string;
  historyId: string;
}

export async function handleGmailWebhook(notification: GmailNotification) {
  console.log('📧 Gmail webhook received:', notification);

  try {
    const { emailAddress, historyId } = notification;

    // Get the latest emails using the history ID
    const history = await gmailClient.users.history.list({
      userId: emailAddress,
      startHistoryId: historyId,
      historyTypes: ['messageAdded'],
    });

    if (!history.data.history) {
      console.log('No new messages found');
      return;
    }

    // Process each new message
    for (const historyRecord of history.data.history) {
      if (historyRecord.messagesAdded) {
        for (const messageAdded of historyRecord.messagesAdded) {
          await processNewEmail(emailAddress, messageAdded.message?.id);
        }
      }
    }
  } catch (error) {
    console.error('Error processing Gmail webhook:', error);
    throw error;
  }
}

async function processNewEmail(userEmail: string, messageId?: string) {
  if (!messageId) return;

  try {
    console.log(`📨 Processing new email: ${messageId}`);

    // Get the full message
    const message = await gmailClient.users.messages.get({
      userId: userEmail,
      id: messageId,
      format: 'full',
    });

    const messageData = message.data;
    if (!messageData) return;

    // Extract email details
    const headers = messageData.payload?.headers || [];
    const fromHeader = headers.find(h => h.name === 'From');
    const subjectHeader = headers.find(h => h.name === 'Subject');
    const dateHeader = headers.find(h => h.name === 'Date');

    const fromEmail = fromHeader?.value || '';
    const subject = subjectHeader?.value || '';
    const receivedDate = dateHeader?.value ? new Date(dateHeader.value) : new Date();

    console.log(`📋 Email details:
      From: ${fromEmail}
      Subject: ${subject}
      Date: ${receivedDate.toISOString()}
    `);

    // Check if it's a bank email (Mandiri, BCA, etc.)
    const isBankEmail = /mandiri|bca|bni|bri|bank/i.test(fromEmail);

    if (!isBankEmail) {
      console.log('❌ Not a bank email, skipping...');
      return;
    }

    console.log('✅ Bank email detected! Processing transaction...');

    // Get email body
    let emailBody = '';
    if (messageData.payload?.body?.data) {
      emailBody = Buffer.from(messageData.payload.body.data, 'base64').toString();
    } else if (messageData.payload?.parts) {
      // Handle multipart messages
      for (const part of messageData.payload.parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          emailBody = Buffer.from(part.body.data, 'base64').toString();
          break;
        }
        if (part.mimeType === 'text/plain' && part.body?.data && !emailBody) {
          emailBody = Buffer.from(part.body.data, 'base64').toString();
        }
      }
    }

    if (!emailBody) {
      console.log('❌ No email body found');
      return;
    }

    // Parse the email content for transaction data
    const parsedTransaction = parseEmailContent(emailBody, fromEmail, subject, receivedDate);

    if (!parsedTransaction) {
      console.log('❌ Could not parse transaction from email');
      return;
    }

    console.log('💰 Transaction parsed:', {
      amount: parsedTransaction.amount,
      direction: parsedTransaction.direction,
      recipient: parsedTransaction.recipient,
      transactionRefNo: parsedTransaction.transactionRefNo,
    });

    // Save transaction to database
    await saveTransaction(parsedTransaction, userEmail, messageId);

  } catch (error) {
    console.error(`Error processing email ${messageId}:`, error);
  }
}

async function saveTransaction(parsedTransaction: any, userEmail: string, messageId: string) {
  try {
    // Check if transaction already exists
    const existingTransaction = await db
      .select()
      .from(transactions)
      .where(eq(transactions.emailId, messageId))
      .limit(1);

    if (existingTransaction.length > 0) {
      console.log('📋 Transaction already exists, skipping...');
      return;
    }

    // Get user's wallet (assuming userId = 1 for now, you may need to map email to userId)
    // You might want to create a proper user lookup here
    const userId = "1"; // Replace with actual user lookup logic

    // Insert new transaction
    const newTransaction = await db.insert(transactions).values({
      id: crypto.randomUUID(),
      userId: userId,
      emailId: messageId,
      transactionRefNo: parsedTransaction.transactionRefNo || '',
      amount: parsedTransaction.amount.toString(),
      fee: parsedTransaction.fee?.toString() || '0',
      totalAmount: parsedTransaction.totalAmount?.toString() || parsedTransaction.amount.toString(),
      currency: parsedTransaction.currency || 'IDR',
      direction: parsedTransaction.direction as 'debit' | 'credit',
      recipient: parsedTransaction.recipient || '',
      recipientBank: parsedTransaction.recipientBank || '',
      recipientBankAccount: parsedTransaction.recipientBankAccount || '',
      transferPurpose: parsedTransaction.transferPurpose || '',
      location: parsedTransaction.location || '',
      datetime: parsedTransaction.datetime || new Date(),
      category: 'Banking',
      description: `${parsedTransaction.direction === 'debit' ? 'Debit' : 'Credit'} - ${parsedTransaction.recipient}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).returning();

    console.log('✅ Transaction saved successfully:', newTransaction[0]?.id);

  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
}