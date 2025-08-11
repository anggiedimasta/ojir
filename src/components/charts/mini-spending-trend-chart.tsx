"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface MiniSpendingData {
  period: string;
  amount: number;
}

interface MiniSpendingTrendChartProps {
  data: MiniSpendingData[];
  title?: string;
  className?: string;
  color?: string;
}

export function MiniSpendingTrendChart({
  data,
  title = "Spending Trend",
  className = "",
  color = "#3b82f6",
}: MiniSpendingTrendChartProps) {
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
      value: number;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <p className="font-medium text-slate-900 text-sm">{label}</p>
          <p className="text-slate-600 text-sm">
            {formatCurrency(payload[0]?.value || 0)}
          </p>
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
            <LineChart
              data={data}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="period"
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
              <Line
                type="monotone"
                dataKey="amount"
                stroke={color}
                strokeWidth={2}
                dot={{ fill: color, strokeWidth: 1, r: 2 }}
                activeDot={{ r: 3, stroke: color, strokeWidth: 1 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
