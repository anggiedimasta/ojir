import { google } from "googleapis";
import { type NextRequest, NextResponse } from "next/server";
import { setupGmailWatch, storeUserGmailToken } from "~/server/gmail-setup";

const oauth2Client = new google.auth.OAuth2(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	process.env.GOOGLE_REDIRECT_URI ||
		"http://localhost:3000/api/gmail/auth/callback",
);

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const code = searchParams.get("code");
		const state = searchParams.get("state"); // This contains the user ID
		const error = searchParams.get("error");

		if (error) {
			console.error("OAuth error:", error);
			return NextResponse.redirect(
				`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings?error=${error}`,
			);
		}

		if (!code || !state) {
			return NextResponse.redirect(
				`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings?error=missing_code_or_state`,
			);
		}

		// Exchange code for tokens
		const { tokens } = await oauth2Client.getToken(code);

		if (!tokens.access_token || !tokens.refresh_token) {
			return NextResponse.redirect(
				`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings?error=token_exchange_failed`,
			);
		}

		// Store tokens
		await storeUserGmailToken(
			state, // user ID from state
			tokens.access_token,
			tokens.refresh_token,
			(tokens as { expires_in?: number }).expires_in || 3600,
		);

		// Setup Gmail watch
		const watchResult = await setupGmailWatch(state, tokens.access_token);

		// Redirect back to settings page with success
		return NextResponse.redirect(
			`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings?success=true&historyId=${watchResult.historyId}`,
		);
	} catch (error) {
		console.error("OAuth callback error:", error);
		return NextResponse.redirect(
			`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/settings?error=callback_error`,
		);
	}
}
