"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface CategoryData {
  name: string;
  value: number;
  color: string;
}

interface CategoryDistributionChartProps {
  data: CategoryData[];
  title?: string;
  className?: string;
}

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
  "#ec4899", // pink
  "#6366f1", // indigo
];

export function CategoryDistributionChart({
  data,
  title = "Category Distribution",
  className = "",
}: CategoryDistributionChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number, total: number) => {
    const percentage = (value / total) * 100;
    return `${percentage.toFixed(1)}%`;
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: CategoryData;
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      if (!data) return null;

      return (
        <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-slate-900">{data.name}</p>
          <p className="text-slate-600 text-sm">
            Amount: {formatCurrency(data.value)}
          </p>
          <p className="text-slate-600 text-sm">
            Percentage: {formatPercentage(data.value, total)}
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({
    payload,
  }: { payload?: Array<{ value: string; color: string }> }) => {
    if (!payload) return null;

    return (
      <div className="mt-4 flex flex-wrap gap-2">
        {payload.map((entry, index) => (
          <div
            key={`legend-${entry.value}-${index}`}
            className="flex items-center gap-2"
          >
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-600 text-sm">{entry.value}</span>
          </div>
        ))}
      </div>
    );
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
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${entry.value}`}
                    fill={entry.color || COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
