import { type NextRequest, NextResponse } from "next/server";
import { auth } from "~/server/auth";

import { google } from "googleapis";
import { setupGmailWatch, storeUserGmailToken } from "~/server/gmail-setup";

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI ||
		"http://localhost:3000/api/gmail/auth/callback",
);

export async function GET(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { searchParams } = new URL(request.url);
		const action = searchParams.get("action");

		if (action === "authorize") {
			// Generate OAuth URL
			const authUrl = oauth2Client.generateAuthUrl({
				access_type: "offline",
				scope: [
					"https://www.googleapis.com/auth/gmail.readonly",
					"https://www.googleapis.com/auth/userinfo.email",
				],
				prompt: "consent", // Force consent to get refresh token
				state: session.user.id, // Pass user ID in state
			});

			return NextResponse.json({ authUrl });
		}

		return NextResponse.json({ error: "Invalid action" }, { status: 400 });
	} catch (error) {
		console.error("Gmail auth error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const session = await auth();

		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const { code } = body;

		if (!code) {
			return NextResponse.json(
				{ error: "Authorization code required" },
				{ status: 400 },
			);
		}

		// Exchange code for tokens
		const { tokens } = await oauth2Client.getToken(code);

		if (!tokens.access_token || !tokens.refresh_token) {
			return NextResponse.json(
				{ error: "Failed to get tokens" },
				{ status: 400 },
			);
		}

		// Store tokens
		await storeUserGmailToken(
			session.user.id,
			tokens.access_token,
			tokens.refresh_token,
			(tokens as { expires_in?: number }).expires_in || 3600,
		);

		// Setup Gmail watch
		const watchResult = await setupGmailWatch(
			session.user.id,
			tokens.access_token,
		);

		return NextResponse.json({
			success: true,
			message: "Gmail integration setup successfully",
			watchResult,
		});
	} catch (error) {
		console.error("Gmail token exchange error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
