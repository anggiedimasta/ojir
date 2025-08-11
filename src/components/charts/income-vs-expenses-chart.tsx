"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface CashFlowData {
  period: string;
  income: number;
  expenses: number;
  netIncome: number;
}

interface IncomeVsExpensesChartProps {
  data: CashFlowData[];
  title?: string;
  className?: string;
}

export function IncomeVsExpensesChart({
  data,
  title = "Income vs Expenses",
  className = "",
}: IncomeVsExpensesChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-slate-900">{label}</p>
          {payload.map((entry, index) => (
            <p
              key={`tooltip-${entry.name}-${index}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="font-semibold text-lg text-slate-900">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="period"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                dataKey="income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expenses"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Expenses"
              />
              <Bar
                dataKey="netIncome"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Net Income"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
