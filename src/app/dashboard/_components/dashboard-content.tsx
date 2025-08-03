"use client";

import { BarChart3, Calendar, FileText, Users } from "lucide-react";
import type { Session } from "next-auth";
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useSidebarStore } from "../../../store/sidebar-store";

// Lazy load charts
const LazyAreaChart = dynamic(() => import('@tremor/react').then(mod => mod.AreaChart), { ssr: false });
const LazyBarChart = dynamic(() => import('@tremor/react').then(mod => mod.BarChart), { ssr: false });
const LazyDonutChart = dynamic(() => import('@tremor/react').then(mod => mod.DonutChart), { ssr: false });
const LazyLineChart = dynamic(() => import('@tremor/react').then(mod => mod.LineChart), { ssr: false });

interface Stat {
  name: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
}

interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

interface QuickAction {
  name: string;
  icon: React.ReactNode;
}

interface DashboardContentProps {
  user: Session["user"];
}

const revenueData = [
  { date: "Jan 23", Revenue: 2890 },
  { date: "Feb 23", Revenue: 1890 },
  { date: "Mar 23", Revenue: 3890 },
  { date: "Apr 23", Revenue: 3490 },
  { date: "May 23", Revenue: 2490 },
  { date: "Jun 23", Revenue: 4490 },
];

const transactionData = [
  { month: "Jan", Transactions: 289 },
  { month: "Feb", Transactions: 189 },
  { month: "Mar", Transactions: 389 },
  { month: "Apr", Transactions: 349 },
  { month: "May", Transactions: 249 },
  { month: "Jun", Transactions: 449 },
];

const expenseData = [
  { name: "Food & Dining", value: 35 },
  { name: "Shopping", value: 25 },
  { name: "Transportation", value: 20 },
  { name: "Entertainment", value: 15 },
  { name: "Bills & Utilities", value: 5 },
];

const engagementData = [
  { month: "Jan", "This Month": 85, "Last Month": 75 },
  { month: "Feb", "This Month": 90, "Last Month": 80 },
  { month: "Mar", "This Month": 75, "Last Month": 65 },
  { month: "Apr", "This Month": 95, "Last Month": 85 },
  { month: "May", "This Month": 80, "Last Month": 70 },
  { month: "Jun", "This Month": 88, "Last Month": 78 },
];

export function DashboardContent({ user }: DashboardContentProps) {
  const { isCollapsed } = useSidebarStore();
  const [hasMounted, setHasMounted] = useState(false);
  const [isChartsVisible, setIsChartsVisible] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // Delay loading charts until after initial render
    const timer = setTimeout(() => {
      setIsChartsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!hasMounted) return null;

  const stats: Stat[] = [
    {
      name: "Total Projects",
      value: "12",
      icon: <FileText className="h-6 w-6 text-blue-500" />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      name: "Team Members",
      value: "24",
      icon: <Users className="h-6 w-6 text-purple-500" />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    },
    {
      name: "Upcoming Events",
      value: "8",
      icon: <Calendar className="h-6 w-6 text-rose-500" />,
      bgColor: "bg-rose-50",
      textColor: "text-rose-600"
    },
    {
      name: "Analytics",
      value: "92%",
      icon: <BarChart3 className="h-6 w-6 text-emerald-500" />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600"
    },
  ];

  const recentActivity: Activity[] = [
    {
      id: "1",
      title: "New Project Created",
      description: "Project 'Website Redesign' was created",
      time: "2 hours ago",
      icon: <FileText className="h-5 w-5 text-slate-600" />,
    },
    {
      id: "2",
      title: "Team Meeting",
      description: "Scheduled for tomorrow at 10:00 AM",
      time: "4 hours ago",
      icon: <Calendar className="h-5 w-5 text-slate-600" />,
    },
    {
      id: "3",
      title: "New Team Member",
      description: "John Doe joined the team",
      time: "1 day ago",
      icon: <Users className="h-5 w-5 text-slate-600" />,
    },
  ];

  const quickActions: QuickAction[] = [
    {
      name: "New Project",
      icon: <FileText className="h-5 w-5 text-slate-600" />,
    },
    {
      name: "Schedule Meeting",
      icon: <Calendar className="h-5 w-5 text-slate-600" />,
    },
    {
      name: "Add Member",
      icon: <Users className="h-5 w-5 text-slate-600" />,
    },
    {
      name: "View Reports",
      icon: <BarChart3 className="h-5 w-5 text-slate-600" />,
    },
  ];

  return (
    <div className={`transition-all duration-200 ease-out transform-gpu ${isCollapsed ? 'pl-20' : 'pl-72'}`}>
      <div className="mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-6" style={{ contain: 'layout', willChange: 'transform' }}>
        {/* Welcome Card */}
        <div className="col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Welcome back, {user.name}!</h2>
                <p className="mt-2 text-slate-600">
                  Here's what's happening with your projects today.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm"
              >
                <div className="flex items-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bgColor}`}>
                    {stat.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-600">{stat.name}</p>
                    <p className={`text-2xl font-semibold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>

          {/* Charts - Only render when visible */}
          {isChartsVisible && (
            <>
        {/* Revenue Chart */}
        <div className="col-span-1">
                <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">Revenue Overview</h3>
                  <LazyAreaChart
              className="mt-4 h-72"
              data={revenueData}
              index="date"
              categories={["Revenue"]}
              colors={["blue"]}
              valueFormatter={(number: number) => `$${number.toLocaleString()}`}
            />
          </div>
        </div>

        {/* Monthly Transactions */}
        <div className="col-span-1">
                <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">Monthly Transactions</h3>
                  <LazyBarChart
              className="mt-4 h-72"
              data={transactionData}
              index="month"
              categories={["Transactions"]}
              colors={["purple"]}
            />
          </div>
        </div>

        {/* Expense Categories */}
        <div className="col-span-1">
                <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">Expense Categories</h3>
                  <LazyDonutChart
              className="mt-4 h-72"
              data={expenseData}
              category="value"
              index="name"
              colors={["blue", "purple", "rose", "emerald", "amber"]}
              valueFormatter={(number: number) => `${number}%`}
            />
          </div>
        </div>

        {/* User Engagement */}
        <div className="col-span-1">
                <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">User Engagement Metrics</h3>
                  <LazyLineChart
              className="mt-4 h-72"
              data={engagementData}
              index="month"
              categories={["This Month", "Last Month"]}
              colors={["blue", "purple"]}
              valueFormatter={(number: number) => `${number}%`}
            />
          </div>
        </div>
            </>
          )}

        {/* Recent Activity */}
        <div className="col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">Recent Activity</h3>
            <div className="mt-4 space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50">
                    {activity.icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                    <p className="text-sm text-slate-600">{activity.description}</p>
                    <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="col-span-1">
            <div className="rounded-xl border border-slate-200 bg-white/80 p-6 shadow-sm">
            <h3 className="text-lg font-medium text-slate-900">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <button
                  key={action.name}
                  className="flex items-center justify-center rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
                >
                  {action.icon}
                  <span className="ml-2">{action.name}</span>
                </button>
              ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}