"use client";

import { ArrowLeft } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect } from "react";

import { Button } from "~/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "~/components/ui/card";

export default function SignIn() {
	const { data: session, status } = useSession();

	useEffect(() => {
		if (session) {
			redirect("/dashboard");
		}
	}, [session]);

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	return (
		<div className="relative min-h-screen overflow-hidden bg-white text-slate-900">
			{/* Background Elements */}
			<div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
				{/* Gradient Orbs */}
				<div className="-left-32 absolute top-1/4 h-[28rem] w-[28rem] animate-float rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 opacity-20 blur-3xl" />
				<div className="absolute top-1/3 right-1/4 h-[32rem] w-[32rem] animate-float rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 opacity-20 blur-3xl delay-1000" />
				<div className="absolute right-1/4 bottom-1/4 h-[24rem] w-[24rem] animate-float rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-20 blur-3xl delay-2000" />
				<div className="absolute top-1/2 right-0 h-[36rem] w-[36rem] animate-float rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 opacity-20 blur-3xl delay-3000" />
				<div className="absolute bottom-1/3 left-1/3 h-[20rem] w-[20rem] animate-float rounded-full bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 opacity-20 blur-3xl delay-1500" />
				<div className="absolute top-2/3 right-1/4 h-[30rem] w-[30rem] animate-float rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 opacity-20 blur-3xl delay-2500" />
				<div className="absolute top-1/4 left-1/3 h-[40rem] w-[40rem] animate-float rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-20 blur-3xl delay-500" />
				<div className="absolute bottom-1/4 left-1/4 h-[35rem] w-[35rem] animate-float rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 opacity-20 blur-3xl delay-1750" />
				<div className="absolute top-3/4 left-1/2 h-[25rem] w-[25rem] animate-float rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 opacity-20 blur-3xl delay-2250" />
				<div className="absolute right-1/3 bottom-1/2 h-[45rem] w-[45rem] animate-float rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 opacity-20 blur-3xl delay-750" />
				<div className="absolute top-1/3 left-0 h-[38rem] w-[38rem] animate-float rounded-full bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 opacity-20 blur-3xl delay-1250" />
				<div className="absolute right-0 bottom-0 h-[42rem] w-[42rem] animate-float rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 opacity-20 blur-3xl delay-2750" />
			</div>

			<div className="flex min-h-screen">
				{/* Left Content */}
				<div className="relative z-0 hidden w-[calc(100%-600px)] items-center justify-center px-12 lg:flex">
					<div className="max-w-lg">
						<Link
							href="/"
							className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 text-sm transition-all hover:border-slate-300 hover:text-slate-900"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Home
						</Link>
						<h1 className="font-bold text-8xl tracking-tight sm:text-9xl">
							<div>Welcome</div>
							<div className="mt-2">back to</div>
							<div className="mt-2">
								<span className="flex items-center gap-4">
									<Image
										src="/logo.svg"
										alt="Ojir Logo"
										width={96}
										height={96}
										className="h-24 w-24"
									/>
									<span className="text-slate-900">Ojir</span>
								</span>
							</div>
						</h1>
						<p className="mt-6 text-2xl text-slate-600">
							Sign in to access your expense tracking dashboard and manage your
							finances with ease.
						</p>
						<div className="mt-12 flex items-center gap-6 text-slate-500 text-sm">
							<Link
								href="/terms"
								className="transition-colors hover:text-slate-900"
							>
								Terms
							</Link>
							<Link
								href="/privacy"
								className="transition-colors hover:text-slate-900"
							>
								Privacy
							</Link>
							<Link
								href="/contact"
								className="transition-colors hover:text-slate-900"
							>
								Contact
							</Link>
						</div>
					</div>
				</div>

				{/* Right Content - Sign In Card */}
				<div className="relative z-10 flex flex-1 items-center justify-center bg-white px-4 sm:px-6 lg:w-[600px] lg:px-8">
					<Card className="mx-auto w-full max-w-[400px] border-0 bg-white shadow-none">
						<div className="flex min-h-[calc(100vh-8rem)] flex-col justify-center bg-white">
							<CardHeader className="bg-white">
								<CardTitle className="font-bold text-2xl">
									Sign in to your account
								</CardTitle>
								<CardDescription>
									Choose your preferred sign in method
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4 bg-white">
								<Button
									color="gray"
									className="h-12 w-full cursor-pointer border-slate-200 bg-white font-medium text-base text-slate-900 transition-opacity hover:bg-slate-50 hover:opacity-90"
									onClick={() =>
										signIn("google", { callbackUrl: "/dashboard" })
									}
								>
									<svg
										className="mr-2 h-5 w-5"
										viewBox="0 0 24 24"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
											fill="#4285F4"
										/>
										<path
											d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
											fill="#34A853"
										/>
										<path
											d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
											fill="#FBBC05"
										/>
										<path
											d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
											fill="#EA4335"
										/>
									</svg>
									Continue with Google
								</Button>
							</CardContent>
							<CardFooter className="flex flex-col items-center space-y-4 bg-white">
								<div className="relative w-full">
									<div className="absolute inset-0 flex items-center">
										<div className="w-full border-slate-200 border-t" />
									</div>
									<div className="relative flex justify-center text-sm">
										<span className="bg-white px-2 text-slate-500">
											Coming soon
										</span>
									</div>
								</div>
								<div className="w-full space-y-4">
									<Button
										color="gray"
										className="h-12 w-full cursor-not-allowed border-[#1877F2] bg-[#1877F2] font-medium text-base text-white opacity-50 hover:bg-[#1877F2]/90"
										disabled
									>
										<svg
											className="mr-2 h-5 w-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
												fill="white"
											/>
										</svg>
										Continue with Facebook
									</Button>
									<Button
										color="gray"
										className="h-12 w-full cursor-not-allowed border-black bg-black font-medium text-base text-white opacity-50 hover:bg-black/90"
										disabled
									>
										<svg
											className="mr-2 h-5 w-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
												fill="white"
											/>
										</svg>
										Continue with X
									</Button>
									<Button
										color="gray"
										className="h-12 w-full cursor-not-allowed font-medium text-base opacity-50"
										disabled
									>
										<svg
											className="mr-2 h-5 w-5"
											viewBox="0 0 24 24"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
											<path
												d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"
												stroke="currentColor"
												strokeWidth="1.5"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
										Continue with Email
									</Button>
								</div>
								<p className="text-center text-slate-500 text-sm">
									By continuing, you agree to our{" "}
									<Link
										href="/terms"
										className="text-rose-500 hover:text-rose-600"
									>
										Terms of Service
									</Link>{" "}
									and{" "}
									<Link
										href="/privacy"
										className="text-rose-500 hover:text-rose-600"
									>
										Privacy Policy
									</Link>
									.
								</p>
							</CardFooter>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
