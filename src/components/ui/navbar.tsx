"use client";

import {
  BarChart3,
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  ChevronDown,
  FileText,
  MessageSquare,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useState } from "react";
import type { MenuItem, MenuSection } from "~/entities/ui";

const menuItems: MenuSection[] = [
  {
    title: "Products",
    items: [
      {
        title: "Expense Tracking",
        description: "Smart expense tracking with AI-powered insights",
        href: "/products/expense-tracking",
        icon: <BarChart3 className="h-6 w-6 text-emerald-500" />,
      },
      {
        title: "Event Management",
        description: "Manage events and expenses in one place",
        href: "/products/event-management",
        icon: <Calendar className="h-6 w-6 text-emerald-500" />,
      },
      {
        title: "Calendar Integration",
        description: "Sync your expenses with your calendar",
        href: "/products/calendar",
        icon: <CalendarDays className="h-6 w-6 text-emerald-500" />,
      },
    ],
  },
  {
    title: "Solutions",
    items: [
      {
        title: "For Individuals",
        description: "Personal expense management made simple",
        href: "/solutions/individuals",
        icon: <User className="h-6 w-6 text-emerald-500" />,
      },
      {
        title: "For Teams",
        description: "Collaborative expense tracking for teams",
        href: "/solutions/teams",
        icon: <Users className="h-6 w-6 text-emerald-500" />,
      },
      {
        title: "For Businesses",
        description: "Enterprise-grade expense management",
        href: "/solutions/businesses",
        icon: <Building2 className="h-6 w-6 text-emerald-500" />,
      },
    ],
  },
  {
    title: "Resources",
    items: [
      {
        title: "Documentation",
        description: "Learn how to use Ojir effectively",
        href: "/docs",
        icon: <BookOpen className="h-6 w-6 text-emerald-500" />,
      },
      {
        title: "Blog",
        description: "Latest news and updates",
        href: "/blog",
        icon: <FileText className="h-6 w-6 text-emerald-500" />,
      },
      {
        title: "Support",
        description: "Get help when you need it",
        href: "/support",
        icon: <MessageSquare className="h-6 w-6 text-emerald-500" />,
      },
    ],
  },
];

export function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 right-0 left-0 z-50 bg-white/40 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Ojir Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="ml-2 font-bold text-slate-900 text-xl">
                Ojir
              </span>
            </Link>
          </div>

          <div className="hidden items-center space-x-8 md:flex">
            {menuItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.title)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 font-medium text-slate-600 text-sm transition-colors hover:text-slate-900 ${
                    activeMenu === item.title ? "text-slate-900" : ""
                  }`}
                >
                  {item.title}
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${
                      activeMenu === item.title ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute left-0 mt-2 w-80 origin-top-left rounded-lg border border-slate-200 bg-white/95 shadow-xl backdrop-blur-sm transition-all duration-200 ${
                    activeMenu === item.title
                      ? "pointer-events-auto translate-y-0 opacity-100"
                      : "-translate-y-2 pointer-events-none opacity-0"
                  }`}
                >
                  <div className="-top-4 absolute left-0 h-4 w-full" />

                  <div className="py-2">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex-shrink-0">{subItem.icon}</div>
                        <div>
                          <div className="font-medium text-slate-900">
                            {subItem.title}
                          </div>
                          <div className="text-slate-500 text-sm">
                            {subItem.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link
              href="/signin"
              className="font-medium text-slate-600 text-sm transition-colors hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              href="/signin"
              className="rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-6 py-2 font-medium text-sm text-white transition-opacity hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
