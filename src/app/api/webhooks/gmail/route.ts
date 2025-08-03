import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '~/server/db';
import { transactions, wallets } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';
import { parseTransactionEmail } from '~/server/api/gmail';
import { google } from 'googleapis';

// Verify the webhook is from Google
async function verifyWebhook(request: NextRequest) {
  const headersList = await headers();
  const signature = headersList.get('x-goog-signature');
  const timestamp = headersList.get('x-goog-timestamp');

  // In production, you should verify the signature using Google's public keys
  // For now, we'll do basic validation
  if (!signature || !timestamp) {
    return false;
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Verify the webhook is from Google
    if (!(await verifyWebhook(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Handle different types of push notifications
    if (body.message?.data) {
      // Decode the base64 data
      const data = Buffer.from(body.message.data, 'base64').toString('utf-8');
      const notification = JSON.parse(data);

      if (notification.emailAddress && notification.historyId) {
        // New email received, process it
        await processNewEmail(notification.emailAddress, notification.historyId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function processNewEmail(emailAddress: string, historyId: string) {
  try {
    // Get user by email
    // Note: You'll need to implement user lookup by email
    // const user = await getUserByEmail(emailAddress);

    // For now, we'll process for all users (you should implement proper user lookup)
    const allUsers = await db.select().from(wallets).groupBy(wallets.userId);

    for (const userWallet of allUsers) {
      const userId = userWallet.userId;

      // Get user's access token (you'll need to implement this)
      // const accessToken = await getUserAccessToken(userId);

      // Fetch recent messages
      // const { messages } = await fetchGmailMessages(accessToken, { maxResults: 10 });

      // Process each new message
      // for (const message of messages) {
      //   const parsedTransaction = parseTransactionEmail(message);
      //   if (parsedTransaction) {
      //     await saveTransaction(userId, parsedTransaction);
      //   }
      // }
    }
  } catch (error) {
    console.error('Error processing new email:', error);
  }
}

async function saveTransaction(userId: string, parsedTransaction: any) {
  try {
    // Check if transaction already exists
    const existingTransaction = await db
      .select()
      .from(transactions)
      .where(
        and(
          eq(transactions.transactionRefNo, parsedTransaction.transactionRefNo),
          eq(transactions.userId, userId)
        )
      )
      .limit(1);

    if (existingTransaction.length > 0) {
      return; // Transaction already exists
    }

    // Find matching wallet
    let targetWallet = await db
      .select()
      .from(wallets)
      .where(
        and(
          eq(wallets.userId, userId),
          eq(wallets.bankCode, parsedTransaction.bankSender?.toLowerCase() || 'unknown')
        )
      )
      .limit(1);

    if (!targetWallet[0]) {
      // Use uncategorized wallet
      targetWallet = await db
        .select()
        .from(wallets)
        .where(
          and(
            eq(wallets.userId, userId),
            eq(wallets.name, 'Uncategorized')
          )
        )
        .limit(1);
    }

    if (targetWallet[0]) {
      // Insert new transaction
      await db.insert(transactions).values({
        userId: userId,
        walletId: targetWallet[0].id,
        recipient: parsedTransaction.recipient,
        location: parsedTransaction.location,
        amount: parsedTransaction.amount.toString(),
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
      });
    }
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
}