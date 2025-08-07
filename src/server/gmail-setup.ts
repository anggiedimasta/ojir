import { eq } from "drizzle-orm";
import { google } from "googleapis";
import { db } from "./db";
import { userGmailTokens } from "./db/schema";

// Gmail webhook setup using user OAuth tokens
export async function setupGmailWatch(userId: string, accessToken: string) {
	try {
		console.log(`🔧 Setting up Gmail watch for user: ${userId}`);

		const oauth2Client = new google.auth.OAuth2();
		oauth2Client.setCredentials({ access_token: accessToken });

		const gmail = google.gmail({ version: "v1", auth: oauth2Client });

		const watchRequest = {
			userId: "me",
			requestBody: {
				labelIds: ["INBOX"],
				topicName: `projects/${process.env.GOOGLE_CLOUD_PROJECT}/topics/gmail-notifications`,
				labelFilterAction: "include",
			},
		};

		console.log("⏱️  Setting up Gmail watch...");
		const response = await gmail.users.watch(watchRequest);

		console.log("✅ Gmail watch setup successfully!");
		console.log("📋 Watch details:", {
			historyId: response.data.historyId,
			expiration: response.data.expiration
				? new Date(Number.parseInt(response.data.expiration))
				: "No expiration",
		});

		return response.data;
	} catch (error) {
		console.error("❌ Error setting up Gmail watch:", error);
		throw error;
	}
}

// Stop Gmail watch
export async function stopGmailWatch(userId: string, accessToken: string) {
	try {
		console.log(`🛑 Stopping Gmail watch for user: ${userId}`);

		const oauth2Client = new google.auth.OAuth2();
		oauth2Client.setCredentials({ access_token: accessToken });

		const gmail = google.gmail({ version: "v1", auth: oauth2Client });

		await gmail.users.stop({ userId: "me" });

		console.log("✅ Gmail watch stopped successfully!");
		return { success: true };
	} catch (error) {
		console.error("❌ Error stopping Gmail watch:", error);
		throw error;
	}
}

// Store user's Gmail OAuth tokens
export async function storeUserGmailToken(
	userId: string,
	accessToken: string,
	refreshToken: string,
	expiresIn = 3600,
) {
	try {
		const expiresAt = new Date(Date.now() + expiresIn * 1000);

		// Check if token already exists
		const existingToken = await db
			.select()
			.from(userGmailTokens)
			.where(eq(userGmailTokens.userId, userId))
			.limit(1);

		if (existingToken.length > 0) {
			// Update existing token
			await db
				.update(userGmailTokens)
				.set({
					accessToken,
					refreshToken,
					expiresAt,
					updatedAt: new Date(),
				})
				.where(eq(userGmailTokens.userId, userId));
		} else {
			// Insert new token
			await db.insert(userGmailTokens).values({
				userId,
				accessToken,
				refreshToken,
				expiresAt,
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}

		console.log(`✅ Gmail tokens stored for user: ${userId}`);
	} catch (error) {
		console.error("❌ Error storing Gmail tokens:", error);
		throw error;
	}
}

// Get user's access token (with refresh if needed)
export async function getUserAccessToken(
	userId: string,
): Promise<string | null> {
	try {
		const token = await db
			.select()
			.from(userGmailTokens)
			.where(eq(userGmailTokens.userId, userId))
			.limit(1);

		if (!token[0]) {
			console.log(`❌ No Gmail token found for user: ${userId}`);
			return null;
		}

		// Check if token is expired
		if (token[0].expiresAt < new Date()) {
			console.log(`🔄 Token expired for user: ${userId}, refreshing...`);
			return await refreshUserToken(userId, token[0].refreshToken);
		}

		return token[0].accessToken;
	} catch (error) {
		console.error("❌ Error getting user access token:", error);
		return null;
	}
}

// Refresh user's access token
async function refreshUserToken(
	userId: string,
	refreshToken: string,
): Promise<string | null> {
	try {
		const oauth2Client = new google.auth.OAuth2(
			process.env.GOOGLE_CLIENT_ID,
			process.env.GOOGLE_CLIENT_SECRET,
			process.env.GOOGLE_REDIRECT_URI,
		);

		oauth2Client.setCredentials({ refresh_token: refreshToken });

		const { credentials } = await oauth2Client.refreshAccessToken();

		if (credentials.access_token) {
			// Store the new tokens
			await storeUserGmailToken(
				userId,
				credentials.access_token,
				refreshToken,
				(credentials as any).expires_in || 3600,
			);

			return credentials.access_token;
		}

		return null;
	} catch (error) {
		console.error("❌ Error refreshing token:", error);
		return null;
	}
}

// Get user by email address
export async function getUserByEmail(emailAddress: string) {
	try {
		// This is a placeholder - implement based on your user schema
		// You might need to add an email field to your users table
		const user = await db
			.select()
			.from(userGmailTokens)
			.where(eq(userGmailTokens.userId, emailAddress)) // Assuming userId is email for now
			.limit(1);

		return user[0] || null;
	} catch (error) {
		console.error("❌ Error getting user by email:", error);
		return null;
	}
}
