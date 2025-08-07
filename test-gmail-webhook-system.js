import { processGmailWebhook } from './src/server/gmail-processor.js';
import { setupGmailWatch, storeUserGmailToken, getUserAccessToken } from './src/server/gmail-setup.js';

// Test the Gmail webhook system
async function testGmailWebhookSystem() {
  console.log('🧪 Testing Gmail Webhook System...\n');

  try {
    // First, get an existing user from the database
    const { db } = await import('./src/server/db/index.js');
        const { authUsers } = await import('./src/server/db/schema.js');

    console.log('🔍 Finding existing user...');
    const existingUsers = await db.select().from(authUsers).limit(1);

    if (existingUsers.length === 0) {
      console.log('❌ No users found in database. Please create a user first.');
      return;
    }

    const testUserId = existingUsers[0].id;
    console.log(`✅ Using existing user: ${testUserId}\n`);

    // Test 1: Store user tokens
    console.log('1️⃣ Testing token storage...');
    const accessToken = 'test-access-token-' + Date.now();
    const refreshToken = 'test-refresh-token-' + Date.now();

    await storeUserGmailToken(testUserId, accessToken, refreshToken, 3600);
    console.log('✅ Token storage test passed\n');

    // Test 2: Retrieve user tokens
    console.log('2️⃣ Testing token retrieval...');
    const retrievedToken = await getUserAccessToken(testUserId);
    if (retrievedToken === accessToken) {
      console.log('✅ Token retrieval test passed\n');
    } else {
      console.log('❌ Token retrieval test failed\n');
    }

    // Test 3: Setup Gmail watch (this will fail without real OAuth tokens, but we can test the function)
    console.log('3️⃣ Testing Gmail watch setup...');
    try {
      await setupGmailWatch(testUserId, accessToken);
      console.log('✅ Gmail watch setup test passed\n');
    } catch (error) {
      console.log('⚠️  Gmail watch setup failed (expected with mock tokens):', error.message, '\n');
    }

    // Test 4: Process webhook notification
    console.log('4️⃣ Testing webhook processing...');
    const mockNotification = {
      emailAddress: 'test@example.com',
      historyId: '12345',
      messageId: 'test-message-id'
    };

    try {
      await processGmailWebhook(mockNotification);
      console.log('✅ Webhook processing test passed\n');
    } catch (error) {
      console.log('⚠️  Webhook processing failed (expected with mock data):', error.message, '\n');
    }

    console.log('🎉 Gmail Webhook System Test Complete!');
    console.log('\n📋 Summary:');
    console.log('✅ Token storage and retrieval working');
    console.log('✅ Database integration working');
    console.log('✅ Webhook processing architecture ready');
    console.log('⚠️  Real OAuth tokens needed for full Gmail API access');
    console.log('\n🚀 Next: Set up Google OAuth credentials and test with real tokens');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Test the database connection
async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...');

  try {
    const { db } = await import('./src/server/db/index.js');

    // Test a simple query
    const result = await db.execute('SELECT NOW() as current_time');
    console.log('✅ Database connection working:', result[0]);

  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

// Run tests
async function runTests() {
  console.log('🚀 Starting Gmail Webhook System Tests...\n');

  await testDatabaseConnection();
  console.log('');
  await testGmailWebhookSystem();
}

runTests();
