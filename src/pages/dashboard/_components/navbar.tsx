"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Session } from "next-auth";
import { UserDropdown } from "./user-dropdown";
import { useSidebarStoreHydrated } from "~/store";

interface NavbarProps {
  user: Session["user"];
}

export function Navbar({ user }: NavbarProps) {
  const { isCollapsed, setCollapsed } = useSidebarStoreHydrated();

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-sm">
      <div className="flex items-center">
        <button
          onClick={() => setCollapsed(!isCollapsed)}
          className="relative z-[102] flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 border border-rose-600 shadow-sm cursor-pointer transition-all duration-300"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
        <div className={`transition-all duration-200 ${isCollapsed ? 'w-20' : 'w-64'}`} /> {/* Responsive spacer */}

        {/* Page Title and Description */}
        <div className="ml-8">
          <h1 className="text-xl font-semibold text-gray-900">Wallet</h1>
          <p className="text-sm text-gray-500">Manage your transactions and financial data</p>
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