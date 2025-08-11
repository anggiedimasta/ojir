"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Session } from "next-auth";
import { usePathname } from "next/navigation";
import { useSidebarStoreHydrated } from "~/store";
import { UserDropdown } from "./user-dropdown";

interface NavbarProps {
  user: Session["user"];
}

export function Navbar({ user }: NavbarProps) {
  const { isCollapsed, setCollapsed } = useSidebarStoreHydrated();
  const pathname = usePathname();

  // Get page title based on current path
  const getPageTitle = () => {
    const path = pathname.split("/").pop();
    switch (path) {
      case "dashboard":
        return "Dashboard";
      case "calendar":
        return "Calendar";
      case "wallet":
        return "Wallet";
      case "categories":
        return "Categories";
      case "profile":
        return "Profile";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  // Get page description based on current path
  const getPageDescription = () => {
    const path = pathname.split("/").pop();
    switch (path) {
      case "dashboard":
        return "Overview of your financial data and insights";
      case "calendar":
        return "Manage your events and schedule";
      case "wallet":
        return "Manage your transactions and financial data";
      case "categories":
        return "Organize your spending categories";
      case "profile":
        return "Manage your account settings";
      case "settings":
        return "Configure your application preferences";
      default:
        return "Overview of your financial data and insights";
    }
  };

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex h-20 items-center justify-between border-slate-200 border-b bg-white/80 px-4 backdrop-blur-sm">
      <div className="flex items-center">
        <button
          type="button"
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
        />
        {/* Page Title and Description */}
        <div className="ml-8">
          <h1 className="font-semibold text-gray-900 text-xl">
            {getPageTitle()}
          </h1>
          <p className="text-gray-500 text-sm">{getPageDescription()}</p>
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
