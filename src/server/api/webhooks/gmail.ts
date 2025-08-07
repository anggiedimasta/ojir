import { NextRequest, NextResponse } from 'next/server';
import { handleGmailWebhook } from '../../gmail-webhook';

interface GmailPushNotification {
  emailAddress: string;
  historyId: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Gmail webhook endpoint hit');

    // Parse the request body
    const body = await request.text();
    console.log('📨 Raw webhook body:', body);

    // Gmail sends the notification as base64 encoded JSON in the 'message' field
    let notification: GmailPushNotification;

    try {
      const data = JSON.parse(body);

      if (data.message?.data) {
        // Decode base64 message data
        const decodedData = Buffer.from(data.message.data, 'base64').toString();
        notification = JSON.parse(decodedData);
      } else {
        // Direct notification format
        notification = data;
      }
    } catch (parseError) {
      console.error('❌ Failed to parse webhook body:', parseError);
      return NextResponse.json({ error: 'Invalid webhook format' }, { status: 400 });
    }

    console.log('📧 Parsed notification:', notification);

    // Validate required fields
    if (!notification.emailAddress || !notification.historyId) {
      console.error('❌ Missing required fields in notification');
      return NextResponse.json({ error: 'Missing emailAddress or historyId' }, { status: 400 });
    }

    // Process the Gmail notification
    await handleGmailWebhook(notification);

    console.log('✅ Gmail webhook processed successfully');
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Error processing Gmail webhook:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Handle GET requests (for webhook verification)
export async function GET(request: NextRequest) {
  console.log('🔍 Gmail webhook verification request');

  // Extract challenge parameter if present (for webhook verification)
  const url = new URL(request.url);
  const challenge = url.searchParams.get('hub.challenge');

  if (challenge) {
    console.log('✅ Webhook verification challenge received');
    return new NextResponse(challenge, { status: 200 });
  }

  return NextResponse.json({
    status: 'Gmail webhook endpoint is active',
    timestamp: new Date().toISOString()
  });
}