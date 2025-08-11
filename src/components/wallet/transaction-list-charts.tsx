"use client";

import {
  CategoryBreakdownChart,
  MiniSpendingTrendChart,
  MonthlyComparisonChart,
} from "~/components/charts";

// Sample data - in real implementation, this would come from your API
const sampleSpendingTrendData = [
  { period: "Mon", amount: 150000 },
  { period: "Tue", amount: 220000 },
  { period: "Wed", amount: 180000 },
  { period: "Thu", amount: 250000 },
  { period: "Fri", amount: 300000 },
  { period: "Sat", amount: 280000 },
  { period: "Sun", amount: 200000 },
];

const sampleCategoryData = [
  { name: "Food", value: 450000, color: "#3b82f6" },
  { name: "Transport", value: 320000, color: "#10b981" },
  { name: "Shopping", value: 280000, color: "#f59e0b" },
  { name: "Bills", value: 150000, color: "#ef4444" },
];

const sampleMonthlyData = [
  { month: "Jan", current: 8500000, previous: 7800000 },
  { month: "Feb", current: 9200000, previous: 8500000 },
  { month: "Mar", current: 8800000, previous: 9200000 },
  { month: "Apr", current: 9500000, previous: 8800000 },
  { month: "May", current: 8700000, previous: 9500000 },
  { month: "Jun", current: 9800000, previous: 8700000 },
];

interface TransactionListChartsProps {
  className?: string;
}

export function TransactionListCharts({
  className = "",
}: TransactionListChartsProps) {
  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-3 ${className}`}>
      <MiniSpendingTrendChart
        data={sampleSpendingTrendData}
        title="Weekly Spending"
        color="#3b82f6"
      />

      <CategoryBreakdownChart
        data={sampleCategoryData}
        title="Top Categories"
      />

      <MonthlyComparisonChart
        data={sampleMonthlyData}
        title="Monthly Comparison"
      />
    </div>
  );
}
