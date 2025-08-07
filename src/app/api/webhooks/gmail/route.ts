import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { processGmailWebhook } from '~/server/gmail-processor';

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
        // Process the Gmail webhook notification
        await processGmailWebhook(notification);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}