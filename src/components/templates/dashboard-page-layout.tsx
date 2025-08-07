"use client";

import { useSidebarStoreHydrated } from "~/store";

interface DashboardPageLayoutProps {
	children: React.ReactNode;
}

export function DashboardPageLayout({ children }: DashboardPageLayoutProps) {
	const { isCollapsed, hasHydrated } = useSidebarStoreHydrated();

	// Don't render until hydration is complete
	if (!hasHydrated) {
		return (
			<div className="transform-gpu pl-72 transition-all duration-200 ease-out">
				<div className="flex min-h-screen items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2" />
				</div>
			</div>
		);
	}

	return (
		<div
			className={`transform-gpu transition-all duration-200 ease-out ${isCollapsed ? "pl-20" : "pl-72"}`}
		>
			<div className="min-h-screen">
				<div className="px-4 pt-2 pb-4 sm:px-6 sm:pt-3 sm:pb-6 lg:px-8 lg:pt-4 lg:pb-8">
					{children}
				</div>
			</div>
		</div>
	);
}
