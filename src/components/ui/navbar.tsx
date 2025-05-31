"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BarChart3,
  Calendar,
  CalendarDays,
  User,
  Users,
  Building2,
  BookOpen,
  FileText,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

interface MenuItem {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const menuItems: MenuSection[] = [
  {
    title: "Products",
    items: [
      {
        title: "Expense Tracking",
        description: "Smart expense tracking with AI-powered insights",
        href: "/products/expense-tracking",
        icon: <BarChart3 className="w-6 h-6 text-emerald-500" />
      },
      {
        title: "Event Management",
        description: "Manage events and expenses in one place",
        href: "/products/event-management",
        icon: <Calendar className="w-6 h-6 text-emerald-500" />
      },
      {
        title: "Calendar Integration",
        description: "Sync your expenses with your calendar",
        href: "/products/calendar",
        icon: <CalendarDays className="w-6 h-6 text-emerald-500" />
      }
    ]
  },
  {
    title: "Solutions",
    items: [
      {
        title: "For Individuals",
        description: "Personal expense management made simple",
        href: "/solutions/individuals",
        icon: <User className="w-6 h-6 text-emerald-500" />
      },
      {
        title: "For Teams",
        description: "Collaborative expense tracking for teams",
        href: "/solutions/teams",
        icon: <Users className="w-6 h-6 text-emerald-500" />
      },
      {
        title: "For Businesses",
        description: "Enterprise-grade expense management",
        href: "/solutions/businesses",
        icon: <Building2 className="w-6 h-6 text-emerald-500" />
      }
    ]
  },
  {
    title: "Resources",
    items: [
      {
        title: "Documentation",
        description: "Learn how to use Ojir effectively",
        href: "/docs",
        icon: <BookOpen className="w-6 h-6 text-emerald-500" />
      },
      {
        title: "Blog",
        description: "Latest news and updates",
        href: "/blog",
        icon: <FileText className="w-6 h-6 text-emerald-500" />
      },
      {
        title: "Support",
        description: "Get help when you need it",
        href: "/support",
        icon: <MessageSquare className="w-6 h-6 text-emerald-500" />
      }
    ]
  }
];

export function Navbar() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.svg"
                alt="Ojir Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="ml-2 text-xl font-bold text-slate-900">Ojir</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <div
                key={item.title}
                className="relative"
                onMouseEnter={() => setActiveMenu(item.title)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  className={`text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 ${
                    activeMenu === item.title ? "text-slate-900" : ""
                  }`}
                >
                  {item.title}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                    activeMenu === item.title ? "rotate-180" : ""
                  }`} />
                </button>

                <div
                  className={`absolute left-0 mt-2 w-80 origin-top-left rounded-lg bg-white/95 backdrop-blur-sm border border-slate-200 shadow-xl transition-all duration-200 ${
                    activeMenu === item.title
                      ? "opacity-100 translate-y-0 pointer-events-auto"
                      : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="absolute -top-4 left-0 w-full h-4" />

                  <div className="py-2">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-shrink-0">{subItem.icon}</div>
                        <div>
                          <div className="font-medium text-slate-900">{subItem.title}</div>
                          <div className="text-sm text-slate-500">{subItem.description}</div>
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
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/signin"
              className="rounded-full bg-gradient-to-r from-rose-500 to-rose-400 px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}