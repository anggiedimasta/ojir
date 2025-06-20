"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Session } from "next-auth";
import { UserDropdown } from "./user-dropdown";

interface NavbarProps {
  user: Session["user"];
}

export function Navbar({ user }: NavbarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="fixed top-0 right-0 left-0 z-50 flex h-20 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-sm">
      <div className="flex items-center">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="relative z-[102] flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 border border-rose-600 shadow-sm cursor-pointer transition-all duration-300"
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
        <div className="w-64" /> {/* Spacer to match sidebar width */}
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