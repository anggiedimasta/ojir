"use client";

import { CreditCard, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import {
  CategoryDistributionChart,
  IncomeVsExpensesChart,
  SpendingTrendChart,
  WalletBalanceChart,
} from "~/components/charts";
import { SummaryCard } from "~/components/ui/summary-card";
import type { WalletSummaryProps } from "~/entities/api/wallet";

// Sample data - in real implementation, this would come from your API
const sampleSpendingTrendData = [
  { period: "Jan", income: 5000000, expenses: 3200000, netIncome: 1800000 },
  { period: "Feb", income: 4800000, expenses: 3500000, netIncome: 1300000 },
  { period: "Mar", income: 5200000, expenses: 3000000, netIncome: 2200000 },
  { period: "Apr", income: 4500000, expenses: 3800000, netIncome: 700000 },
  { period: "May", income: 5500000, expenses: 2900000, netIncome: 2600000 },
  { period: "Jun", income: 5800000, expenses: 3100000, netIncome: 2700000 },
];

const sampleCategoryData = [
  { name: "Food & Dining", value: 2500000, color: "#3b82f6" },
  { name: "Shopping", value: 1800000, color: "#10b981" },
  { name: "Transportation", value: 1200000, color: "#f59e0b" },
  { name: "Entertainment", value: 800000, color: "#ef4444" },
  { name: "Bills & Utilities", value: 600000, color: "#8b5cf6" },
  { name: "Healthcare", value: 400000, color: "#06b6d4" },
];

const sampleCashFlowData = [
  { period: "Q1", income: 15000000, expenses: 9700000, netIncome: 5300000 },
  { period: "Q2", income: 15800000, expenses: 9900000, netIncome: 5900000 },
];

const sampleBalanceData = [
  { date: "Jan 1", balance: 50000000, change: 0 },
  { date: "Feb 1", balance: 51800000, change: 1800000 },
  { date: "Mar 1", balance: 54000000, change: 2200000 },
  { date: "Apr 1", balance: 54700000, change: 700000 },
  { date: "May 1", balance: 57300000, change: 2600000 },
  { date: "Jun 1", balance: 60000000, change: 2700000 },
];

export function EnhancedWalletSummary({
  summary,
  formatCurrency,
}: WalletSummaryProps) {
  const netIncome = summary.totalIncome - summary.totalExpense;
  const isNetPositive = netIncome >= 0;

  // Format transaction count with proper number formatting
  const formatTransactionCount = (count: number) => {
    return new Intl.NumberFormat("id-ID").format(count);
  };

  // Custom icon components using Lucide React icons with respective colors
  const IncomeIcon = () => <TrendingUp className="h-6 w-6 text-green-600" />;
  const ExpenseIcon = () => <TrendingDown className="h-6 w-6 text-red-600" />;
  const NetIncomeIcon = () => (
    <Wallet
      className={`h-6 w-6 ${isNetPositive ? "text-green-600" : "text-red-600"}`}
    />
  );
  const TransactionIcon = () => (
    <CreditCard className="h-6 w-6 text-purple-600" />
  );

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome.toString())}
          icon={IncomeIcon}
          gradient="bg-gradient-to-br from-green-50 to-emerald-50"
          borderColor="border-green-200"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-800"
          titleColor="text-green-700"
        />

        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpense.toString())}
          icon={ExpenseIcon}
          gradient="bg-gradient-to-br from-red-50 to-rose-50"
          borderColor="border-red-200"
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-800"
          titleColor="text-red-700"
        />

        <SummaryCard
          title="Net Income"
          value={formatCurrency(netIncome.toString())}
          icon={NetIncomeIcon}
          gradient={
            isNetPositive
              ? "bg-gradient-to-br from-green-50 to-emerald-50"
              : "bg-gradient-to-br from-red-50 to-rose-50"
          }
          borderColor={isNetPositive ? "border-green-200" : "border-red-200"}
          iconBgColor={isNetPositive ? "bg-green-100" : "bg-red-100"}
          iconColor={isNetPositive ? "text-green-600" : "text-red-600"}
          valueColor={isNetPositive ? "text-green-800" : "text-red-800"}
          titleColor={isNetPositive ? "text-green-700" : "text-red-700"}
        />

        <SummaryCard
          title="Transactions"
          value={formatTransactionCount(summary.transactionCount)}
          icon={TransactionIcon}
          gradient="bg-gradient-to-br from-purple-50 to-violet-50"
          borderColor="border-purple-200"
          iconBgColor="bg-purple-100"
          iconColor="text-purple-600"
          valueColor="text-purple-800"
          titleColor="text-purple-700"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Spending Trends Chart */}
        <SpendingTrendChart
          data={sampleSpendingTrendData}
          title="Monthly Spending Trends"
          className="h-96"
        />

        {/* Category Distribution Chart */}
        <CategoryDistributionChart
          data={sampleCategoryData}
          title="Expense Categories"
          className="h-96"
        />
      </div>

      {/* Full Width Charts */}
      <div className="space-y-6">
        {/* Income vs Expenses Chart */}
        <IncomeVsExpensesChart
          data={sampleCashFlowData}
          title="Quarterly Cash Flow"
          className="h-96"
        />

        {/* Wallet Balance Chart */}
        <WalletBalanceChart
          data={sampleBalanceData}
          title="Wallet Balance Over Time"
          className="h-96"
        />
      </div>
    </div>
  );
}
