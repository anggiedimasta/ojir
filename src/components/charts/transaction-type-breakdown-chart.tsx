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

interface TransactionTypeData {
  type: string;
  count: number;
  amount: number;
}

interface TransactionTypeBreakdownChartProps {
  data: TransactionTypeData[];
  title?: string;
  className?: string;
}

export function TransactionTypeBreakdownChart({
  data,
  title = "Transaction Type Breakdown",
  className = "",
}: TransactionTypeBreakdownChartProps) {
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
              {entry.name === "count" ? "Count" : "Amount"}:{" "}
              {entry.name === "count"
                ? entry.value.toLocaleString()
                : formatCurrency(entry.value)}
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
                dataKey="type"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value.toLocaleString()}
                name="Count"
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                name="Amount"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="count"
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
                name="Count"
              />
              <Bar
                yAxisId="right"
                dataKey="amount"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                name="Amount"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
