"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface MonthlyComparisonData {
  month: string;
  current: number;
  previous: number;
}

interface MonthlyComparisonChartProps {
  data: MonthlyComparisonData[];
  title?: string;
  className?: string;
}

export function MonthlyComparisonChart({
  data,
  title = "Monthly Comparison",
  className = "",
}: MonthlyComparisonChartProps) {
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
        <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <p className="font-medium text-slate-900 text-sm">{label}</p>
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
      <CardHeader className="pb-2">
        <CardTitle className="font-medium text-slate-700 text-sm">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                tickFormatter={(value) => formatCurrency(value)}
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="current"
                fill="#3b82f6"
                radius={[2, 2, 0, 0]}
                name="Current Month"
              />
              <Bar
                dataKey="previous"
                fill="#94a3b8"
                radius={[2, 2, 0, 0]}
                name="Previous Month"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
