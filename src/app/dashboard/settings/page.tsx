"use client";

import {
	Bell,
	Mail,
	Settings as SettingsIcon,
	Shield,
	User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/atoms/button";
import { Card } from "~/components/atoms/card";

export default function SettingsPage() {
	const { data: session } = useSession();
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState(false);
	const [status, setStatus] = useState<string>("");

	// Check for OAuth callback results
	useEffect(() => {
		const success = searchParams.get("success");
		const error = searchParams.get("error");
		const historyId = searchParams.get("historyId");

		if (success === "true" && historyId) {
			setStatus(
				`✅ Gmail integration setup successfully! History ID: ${historyId}`,
			);
		} else if (error) {
			setStatus(`❌ OAuth error: ${error}`);
		}
	}, [searchParams]);

	const handleGmailAuth = async () => {
		if (!session?.user?.id) {
			setStatus("❌ No user session found");
			return;
		}

		setIsLoading(true);
		setStatus("🔄 Redirecting to Google OAuth...");

		try {
			// Get OAuth URL from our API
			const response = await fetch("/api/gmail/auth?action=authorize");
			const data = await response.json();

			if (data.authUrl) {
				// Redirect to Google OAuth
				window.location.href = data.authUrl;
			} else {
				throw new Error("Failed to get OAuth URL");
			}
		} catch (error) {
			console.error("Gmail auth error:", error);
			setStatus(
				`❌ Error: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen">
			<div className="container mx-auto p-6">
				<div className="mx-auto max-w-4xl">
					<div className="mb-8 flex items-center gap-3">
						<SettingsIcon className="h-8 w-8 text-rose-600" />
						<h1 className="bg-gradient-to-r from-rose-600 to-blue-600 bg-clip-text font-bold text-3xl text-transparent">
							Settings
						</h1>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Account Settings */}
						<Card className="border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
							<div className="mb-4 flex items-center gap-3">
								<User className="h-5 w-5 text-slate-600" />
								<h2 className="font-semibold text-xl">Account</h2>
							</div>
							<div className="space-y-3">
								<div>
									<div className="font-medium text-slate-700 text-sm">Name</div>
									<p className="text-slate-900">
										{session?.user?.name || "Not set"}
									</p>
								</div>
								<div>
									<div className="font-medium text-slate-700 text-sm">
										Email
									</div>
									<p className="text-slate-900">
										{session?.user?.email || "Not set"}
									</p>
								</div>
								<div>
									<div className="font-medium text-slate-700 text-sm">
										User ID
									</div>
									<p className="font-mono text-slate-500 text-sm">
										{session?.user?.id || "Not available"}
									</p>
								</div>
							</div>
						</Card>

						{/* Gmail Integration */}
						<Card className="border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
							<div className="mb-4 flex items-center gap-3">
								<Mail className="h-5 w-5 text-slate-600" />
								<h2 className="font-semibold text-xl">Gmail Integration</h2>
							</div>

							<div className="space-y-4">
								<p className="text-slate-600 text-sm">
									Connect your Gmail account to automatically import bank
									transaction emails.
								</p>

								<div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
									<h3 className="mb-2 font-semibold text-blue-900 text-sm">
										What this enables:
									</h3>
									<ul className="space-y-1 text-blue-800 text-xs">
										<li>• Automatic detection of bank transaction emails</li>
										<li>• Real-time transaction import when emails arrive</li>
										<li>
											• Support for Bank Mandiri, BCA, BNI, BRI, and other banks
										</li>
									</ul>
								</div>

								<div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
									<h3 className="mb-2 font-semibold text-sm text-yellow-900">
										Privacy & Security:
									</h3>
									<ul className="space-y-1 text-xs text-yellow-800">
										<li>• Only reads emails from bank domains</li>
										<li>• OAuth tokens are encrypted and stored securely</li>
										<li>• You can revoke access at any time</li>
									</ul>
								</div>

								<Button
									onClick={handleGmailAuth}
									disabled={isLoading || !session?.user?.id}
									className="w-full"
									size="sm"
								>
									{isLoading ? "Setting up..." : "Connect Gmail Account"}
								</Button>

								{status && (
									<div
										className={`rounded-lg p-3 text-sm ${
											status.includes("✅")
												? "border border-green-200 bg-green-50 text-green-800"
												: status.includes("❌")
													? "border border-red-200 bg-red-50 text-red-800"
													: "border border-blue-200 bg-blue-50 text-blue-800"
										}`}
									>
										{status}
									</div>
								)}
							</div>
						</Card>

						{/* Notifications */}
						<Card className="border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
							<div className="mb-4 flex items-center gap-3">
								<Bell className="h-5 w-5 text-slate-600" />
								<h2 className="font-semibold text-xl">Notifications</h2>
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div>
										<div className="font-medium text-slate-700 text-sm">
											Email Notifications
										</div>
										<p className="text-slate-500 text-xs">
											Receive notifications about new transactions
										</p>
									</div>
									<Button variant="outline" size="sm" disabled>
										Coming Soon
									</Button>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<div className="font-medium text-slate-700 text-sm">
											Push Notifications
										</div>
										<p className="text-slate-500 text-xs">
											Browser push notifications
										</p>
									</div>
									<Button variant="outline" size="sm" disabled>
										Coming Soon
									</Button>
								</div>
							</div>
						</Card>

						{/* Security */}
						<Card className="border-0 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl">
							<div className="mb-4 flex items-center gap-3">
								<Shield className="h-5 w-5 text-slate-600" />
								<h2 className="font-semibold text-xl">Security</h2>
							</div>
							<div className="space-y-3">
								<div className="flex items-center justify-between">
									<div>
										<div className="font-medium text-slate-700 text-sm">
											Two-Factor Authentication
										</div>
										<p className="text-slate-500 text-xs">
											Add an extra layer of security
										</p>
									</div>
									<Button variant="outline" size="sm" disabled>
										Coming Soon
									</Button>
								</div>
								<div className="flex items-center justify-between">
									<div>
										<div className="font-medium text-slate-700 text-sm">
											Session Management
										</div>
										<p className="text-slate-500 text-xs">
											Manage active sessions
										</p>
									</div>
									<Button variant="outline" size="sm" disabled>
										Coming Soon
									</Button>
								</div>
							</div>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
