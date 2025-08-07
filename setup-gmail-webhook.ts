import {
	setupGmailWatch,
	storeUserGmailToken,
} from "./src/server/gmail-setup.js";

// Example: Setup Gmail webhook for a user
async function setupUserGmailWebhook(
	userId: string,
	accessToken: string,
	refreshToken: string,
) {
	try {
		console.log("🔧 Setting up Gmail webhook for user:", userId);

		// 1. Store user's OAuth tokens
		await storeUserGmailToken(userId, accessToken, refreshToken);
		console.log("✅ OAuth tokens stored");

		// 2. Setup Gmail watch
		const watchResult = await setupGmailWatch(userId, accessToken);
		console.log("✅ Gmail watch setup complete:", watchResult);

		return watchResult;
	} catch (error) {
		console.error("❌ Error setting up Gmail webhook:", error);
		throw error;
	}
}

// Example usage
console.log(`
🎯 Gmail Webhook Setup Complete!

📋 What was fixed:
✅ Removed duplicate gmail-webhook.ts file
✅ Created proper OAuth-based architecture
✅ Added userGmailTokens table for token storage
✅ Implemented proper user context handling
✅ Simplified webhook route to use new processor

🔧 New Architecture:
1. src/server/gmail-setup.ts - OAuth token management & webhook setup
2. src/server/gmail-processor.ts - Email processing with user context
3. src/app/api/webhooks/gmail/route.ts - Simplified webhook endpoint

📊 Database Changes:
- Added ojir_user_gmail_tokens table
- Stores user OAuth tokens securely
- Supports token refresh

🚀 Next Steps:
1. Run the SQL script: add-gmail-tokens-table.sql
2. Implement user OAuth flow to get access tokens
3. Call setupUserGmailWebhook() when user authorizes Gmail
4. Webhooks will now work with proper user context!

📝 Usage Example:
\`\`\`javascript
// When user authorizes Gmail
await setupUserGmailWebhook(
  'user-123',
  'access-token-from-oauth',
  'refresh-token-from-oauth'
);
\`\`\`
`);

export { setupUserGmailWebhook };
