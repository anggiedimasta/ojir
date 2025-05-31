"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { ChevronDown, LogOut } from "lucide-react";
import Image from "next/image";

interface UserDropdownProps {
  name: string;
  email: string;
  image?: string | null;
}

export function UserDropdown({ name, email, image }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
      >
        {image ? (
          <Image
            src={image}
            alt={name}
            width={24}
            height={24}
            className="rounded-full"
          />
        ) : (
          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-xs">
            {name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="text-sm">{name}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-slate-200 shadow-sm">
          <div className="p-2">
            <div className="mb-2 px-3 py-2">
              <p className="text-xs font-medium text-slate-900">{name}</p>
              <p className="text-xs text-slate-500">{email}</p>
            </div>
            <div className="h-px bg-slate-200" />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="mt-2 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}