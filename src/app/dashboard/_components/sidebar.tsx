"use client";

import {
	Calendar,
	ChevronLeft,
	ChevronRight,
	LayoutDashboard,
	Settings,
	User,
	Wallet,
	Tags,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { useSidebarStoreHydrated } from "../../../store/sidebar-store";

interface NavigationItem {
	href: string;
	label: string;
	icon: React.ReactNode;
	adminOnly?: boolean;
}

export function Sidebar() {
	const { isCollapsed, setCollapsed, hasHydrated } = useSidebarStoreHydrated();
	const [hasMounted, setHasMounted] = useState(false);
	const { data: session } = useSession();

	useEffect(() => {
		setHasMounted(true);
	}, []);

	const pathname = usePathname();

	// Simple admin check - you can enhance this later with proper role-based system
	const isAdmin = session?.user?.email === "anggiedimasta@gmail.com"; // Replace with your admin email

	const navigationItems: NavigationItem[] = [
		{
			href: "/dashboard",
			label: "Dashboard",
			icon: <LayoutDashboard className="h-5 w-5" />,
		},
		{
			href: "/dashboard/calendar",
			label: "Calendar",
			icon: <Calendar className="h-5 w-5" />,
		},
		{
			href: "/dashboard/wallet",
			label: "Wallet",
			icon: <Wallet className="h-5 w-5" />,
		},
		{
			href: "/dashboard/categories",
			label: "Categories",
			icon: <Tags className="h-5 w-5" />,
			adminOnly: true,
		},
		{
			href: "/dashboard/profile",
			label: "Profile",
			icon: <User className="h-5 w-5" />,
		},
		{
			href: "/dashboard/settings",
			label: "Settings",
			icon: <Settings className="h-5 w-5" />,
		},
	];

	if (!hasMounted) return null;

	return (
		<>
			{/* Toggle Button */}
			<button
				type="button"
				onClick={() => setCollapsed(!isCollapsed)}
				className={`-mr-4 fixed top-6 z-[102] flex h-8 w-8 transform-gpu cursor-pointer items-center justify-center rounded-full border border-rose-600 bg-rose-500 text-white shadow-sm transition-all duration-200 ease-out hover:bg-rose-600 ${!isCollapsed ? "left-[272px]" : "left-[62px]"}`}
			>
				{isCollapsed ? (
					<ChevronRight className="h-5 w-5" />
				) : (
					<ChevronLeft className="h-5 w-5" />
				)}
			</button>

			<div
				className={`fixed top-0 left-0 z-[100] h-screen transform-gpu border-slate-200 border-r bg-white/80 backdrop-blur-sm transition-all duration-200 ease-out ${
					isCollapsed ? "w-20" : "w-72"
				}`}
			>
				{/* Sidebar Content */}
				<div className="flex h-full flex-col">
					{/* Logo/Brand */}
					<div className="flex h-20 items-center justify-center gap-2 border-slate-200 border-b bg-gradient-to-r from-rose-50 to-white">
						<Image
							src="/logo.svg"
							alt="Ojir Logo"
							width={32}
							height={32}
							className="h-8 w-8"
						/>
						{!isCollapsed && (
							<span className="bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text font-bold text-transparent text-xl">
								Ojir
							</span>
						)}
					</div>

					{/* Navigation */}
					<nav className="flex-1 p-4">
						<div className="space-y-2">
							{navigationItems
								.filter((item) => !item.adminOnly || isAdmin)
								.map((item) => (
									<Button
										key={item.href}
										color="ghost"
										className={`w-full justify-start gap-2 ${
											item.adminOnly ? "border-amber-500 border-l-2" : ""
										}`}
										active={pathname === item.href}
										asChild
									>
										<Link href={item.href}>
											{item.icon}
											{!isCollapsed && (
												<div className="flex items-center gap-2">
													<span>{item.label}</span>
													{item.adminOnly && (
														<span className="font-medium text-amber-600 text-xs">
															ADMIN
														</span>
													)}
												</div>
											)}
										</Link>
									</Button>
								))}
						</div>
					</nav>
				</div>
			</div>
		</>
	);
}
