"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
	return (
		<div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f] px-4">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden">
				<div className="-top-40 -left-40 absolute h-80 w-80 animate-pulse rounded-full bg-emerald-500/20 blur-3xl" />
				<div className="-bottom-40 -right-40 absolute h-80 w-80 animate-pulse rounded-full bg-blue-500/20 blur-3xl delay-1000" />
				<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-96 w-96 animate-pulse rounded-full bg-purple-500/20 blur-3xl delay-500" />
			</div>

			<div className="relative z-10 space-y-8 text-center">
				<div className="space-y-4">
					<div className="relative">
						<h1 className="animate-gradient bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 bg-clip-text font-bold text-9xl text-transparent">
							404
						</h1>
						<div className="-z-10 absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-2xl" />
					</div>
					<h2 className="font-semibold text-3xl text-white">Page Not Found</h2>
					<p className="mx-auto max-w-md text-gray-300">
						Oops! The page you're looking for doesn't exist or has been moved.
					</p>
				</div>

				<Link
					href="/"
					className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-105 hover:opacity-90 hover:shadow-emerald-500/20 hover:shadow-lg"
				>
					<ArrowLeft className="h-5 w-5" />
					Back to Home
				</Link>
			</div>
		</div>
	);
}
