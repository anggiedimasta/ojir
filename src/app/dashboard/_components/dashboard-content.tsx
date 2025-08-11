"use client";

import {
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import dynamic from "next/dynamic";
import {
  CategoryBreakdownChart,
  WalletBalanceChart,
} from "~/components/charts";
import { useChartData } from "~/hooks/use-chart-data";
import { useSidebarStoreHydrated } from "../../../store/sidebar-store";

// Lazy load charts for better performance
const LazyCategoryBreakdownChart = dynamic(
  () =>
    import("~/components/charts").then((mod) => ({
      default: mod.CategoryBreakdownChart,
    })),
  { ssr: false },
) as React.ComponentType<{
  data: Array<{
    name: string;
    value: number;
    color: string;
    colorIntensity?: number;
  }>;
  title?: string;
  subtitle?: string;
  className?: string;
}>;

const LazyWalletBalanceChart = dynamic(
  () =>
    import("~/components/charts").then((mod) => ({
      default: mod.WalletBalanceChart,
    })),
  { ssr: false },
) as React.ComponentType<{
  data: Array<{
    date: string;
    balance: number;
    change: number;
  }>;
  title?: string;
  subtitle?: string;
  className?: string;
}>;

interface Stat {
  title: string;
  value: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  change: string;
  changeType: "positive" | "negative";
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

export function DashboardContent() {
  const { isCollapsed } = useSidebarStoreHydrated();
  const {
    spendingTrend,
    categoryDistribution,
    walletBalanceHistory,
    walletSummary,
    isLoading,
    hasErrors,
  } = useChartData();

  // Transform real data for charts
  const categoryData = categoryDistribution.map((item) => ({
    name: item.name,
    value: item.amount,
    color: item.color,
    colorIntensity: 500, // Default to 500 intensity for main categories
  }));

  const balanceData = walletBalanceHistory.map((item, index, array) => ({
    date: item.period,
    balance: item.balance || 0,
    change:
      index > 0 ? (item.balance || 0) - (array[index - 1]?.balance || 0) : 0,
  }));

  // Calculate stats from real data
  const totalBalance = walletSummary?.totalIncome
    ? walletSummary.totalIncome - walletSummary.totalExpense
    : 0;

  const monthlyIncome =
    spendingTrend.length > 0
      ? spendingTrend[spendingTrend.length - 1]?.income || 0
      : 0;

  const monthlyExpenses =
    spendingTrend.length > 0
      ? spendingTrend[spendingTrend.length - 1]?.expenses || 0
      : 0;

  const transactionCount = walletSummary?.transactionCount || 0;

  const stats = [
    {
      title: "Total Balance",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(totalBalance),
      description: "Current total balance across all wallets",
      icon: Wallet,
      change: "+12.5%",
      changeType: "positive" as const,
    },
    {
      title: "Monthly Income",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(monthlyIncome),
      description: "Total income this month",
      icon: TrendingUp,
      change: "+8.2%",
      changeType: "positive" as const,
    },
    {
      title: "Monthly Expenses",
      value: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
      }).format(monthlyExpenses),
      description: "Total expenses this month",
      icon: TrendingDown,
      change: "-2.1%",
      changeType: "negative" as const,
    },
    {
      title: "Transactions",
      value: transactionCount.toString(),
      description: "Total transactions this month",
      icon: FileText,
      change: "+15.3%",
      changeType: "positive" as const,
    },
  ];

  const recentActivity: Activity[] = [
    {
      id: "1",
      title: "New Transaction",
      description: "Payment received from Client ABC",
      time: "2 hours ago",
      icon: <CreditCard className="h-5 w-5 text-slate-600" />,
    },
    {
      id: "2",
      title: "Expense Recorded",
      description: "Grocery shopping at Supermarket XYZ",
      time: "4 hours ago",
      icon: <TrendingDown className="h-5 w-5 text-slate-600" />,
    },
    {
      id: "3",
      title: "Income Received",
      description: "Salary payment for June 2024",
      time: "1 day ago",
      icon: <TrendingUp className="h-5 w-5 text-slate-600" />,
    },
  ];

  const quickActions: QuickAction[] = [
    {
      name: "Add Transaction",
      icon: <CreditCard className="h-5 w-5 text-slate-600" />,
    },
    {
      name: "View Reports",
      icon: <BarChart3 className="h-5 w-5 text-slate-600" />,
    },
    {
      name: "Manage Wallets",
      icon: <Wallet className="h-5 w-5 text-slate-600" />,
    },
    {
      name: "Set Budget",
      icon: <Calendar className="h-5 w-5 text-slate-600" />,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (hasErrors) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-destructive">Error loading dashboard data</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-1 space-y-6 p-4 pt-6 md:p-8 ${isCollapsed ? "ml-20" : "ml-72"} transition-all duration-200 ease-out`}
    >
      <div className="flex items-center justify-between space-y-2">
        <h2 className="font-bold text-3xl tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            {new Date().toLocaleDateString("id-ID", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-xl border-0 bg-gradient-to-br from-white via-slate-50 to-white p-6 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
          >
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100/50 via-transparent to-slate-100/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10 flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="font-medium text-slate-700 text-sm tracking-tight">
                {stat.title}
              </h3>
              <div className="rounded-lg bg-slate-100/80 p-2 backdrop-blur-sm">
                <stat.icon className="h-4 w-4 text-slate-600" />
              </div>
            </div>
            <div className="relative z-10 pt-0">
              <div className="font-bold text-2xl text-slate-900">
                {stat.value}
              </div>
              <p className="text-muted-foreground text-xs">
                {stat.description}
              </p>
              <div className="mt-2 flex items-center space-x-1">
                <span
                  className={`font-medium text-xs ${
                    stat.changeType === "positive"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-slate-500 text-xs">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
        {/* Balance History Chart */}
        <div className="col-span-3">
          <LazyWalletBalanceChart
            data={balanceData}
            title="Balance History"
            subtitle="Wallet balance over time"
            className="h-[400px]"
          />
        </div>

        {/* Category Distribution Chart */}
        <div className="col-span-3">
          <LazyCategoryBreakdownChart
            data={categoryData}
            title="Category Distribution"
            subtitle="Where your money goes"
            className="h-[400px]"
          />
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
        <div className="col-span-3">
          <div className="group relative overflow-hidden rounded-xl border-0 bg-gradient-to-br from-white via-slate-50 to-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/50 via-transparent to-pink-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
              <h3 className="font-semibold text-lg text-slate-800">
                Recent Activity
              </h3>
              <p className="text-muted-foreground text-sm">
                Latest transactions and updates
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center space-x-4 rounded-lg p-3 transition-colors hover:bg-slate-50/80"
                  >
                    <div className="rounded-full bg-gradient-to-br from-rose-100 to-pink-100 p-2 shadow-sm">
                      {activity.icon}
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="font-medium text-slate-800 text-sm leading-none">
                        {activity.title}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {activity.description}
                      </p>
                    </div>
                    <div className="text-muted-foreground text-sm">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-3">
          <div className="group relative overflow-hidden rounded-xl border-0 bg-gradient-to-br from-white via-slate-50 to-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl">
            {/* Subtle background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-transparent to-blue-50/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
              <h3 className="font-semibold text-lg text-slate-800">
                Quick Actions
              </h3>
              <p className="text-muted-foreground text-sm">
                Common tasks and shortcuts
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <div className="space-y-3">
                {quickActions.map((action) => (
                  <button
                    key={action.name}
                    type="button"
                    className="group/action flex w-full cursor-pointer items-center space-x-3 rounded-lg border-0 bg-gradient-to-r from-slate-50 to-slate-100/80 p-3 text-left transition-all duration-200 hover:scale-[1.02] hover:from-slate-100 hover:to-slate-200 hover:shadow-md"
                  >
                    <div className="rounded-lg bg-white/80 p-2 shadow-sm transition-all duration-200 group-hover/action:shadow-md">
                      {action.icon}
                    </div>
                    <span className="font-medium text-slate-700 text-sm group-hover/action:text-slate-900">
                      {action.name}
                    </span>
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
