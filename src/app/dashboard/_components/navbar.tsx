"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Session } from "next-auth";
import { useSidebarStoreHydrated } from "~/store";
import { UserDropdown } from "./user-dropdown";

interface NavbarProps {
	user: Session["user"];
}

export function Navbar({ user }: NavbarProps) {
	const { isCollapsed, setCollapsed } = useSidebarStoreHydrated();

	return (
		<div className="fixed top-0 right-0 left-0 z-50 flex h-20 items-center justify-between border-slate-200 border-b bg-white/80 px-4 backdrop-blur-sm">
			<div className="flex items-center">
				<button
					onClick={() => setCollapsed(!isCollapsed)}
					className="relative z-[102] flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-rose-600 bg-rose-500 text-white shadow-sm transition-all duration-300 hover:bg-rose-600"
				>
					{isCollapsed ? (
						<ChevronRight className="h-5 w-5" />
					) : (
						<ChevronLeft className="h-5 w-5" />
					)}
				</button>
				<div
					className={`transition-all duration-200 ${isCollapsed ? "w-20" : "w-64"}`}
				/>{" "}
				{/* Responsive spacer */}
				{/* Page Title and Description */}
				<div className="ml-8">
					<h1 className="font-semibold text-gray-900 text-xl">Wallet</h1>
					<p className="text-gray-500 text-sm">
						Manage your transactions and financial data
					</p>
				</div>
			</div>
			<div className="flex items-center justify-end">
				<UserDropdown
					name={user.name ?? ""}
					email={user.email ?? ""}
					image={user.image}
				/>
			</div>
		</div>
	);
}
