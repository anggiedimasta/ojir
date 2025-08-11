"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface BalanceData {
  date: string;
  balance: number;
  change: number;
}

interface WalletBalanceChartProps {
  data: BalanceData[];
  title?: string;
  subtitle?: string;
  className?: string;
}

// Function to get Tailwind color values
const getTailwindColor = (color: string, intensity: number): string => {
  const normalizedColor = color.toLowerCase();
  const normalizedIntensity = Math.max(50, Math.min(950, intensity));

  // Find the closest available intensity from the standard set
  const availableIntensities = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
  ];
  let closestIntensity = 500;

  for (const level of availableIntensities) {
    if (
      Math.abs(level - normalizedIntensity) <
      Math.abs(closestIntensity - normalizedIntensity)
    ) {
      closestIntensity = level;
    }
  }

  // Use CSS custom property that Tailwind provides
  return `var(--color-${normalizedColor}-${closestIntensity})`;
};

export function WalletBalanceChart({
  data,
  title = "Wallet Balance Over Time",
  subtitle = "Balance and change over time",
  className = "",
}: WalletBalanceChartProps) {
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
        <div className="rounded-lg border border-slate-200 bg-white shadow-lg">
          <p className="mb-2 font-semibold text-slate-900">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div
                key={`tooltip-${entry.name}-${index}`}
                className="flex items-center justify-between"
              >
                <span className="text-slate-600 text-sm">{entry.name}:</span>
                <span
                  className="font-medium text-sm"
                  style={{ color: entry.color }}
                >
                  {formatCurrency(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  // Get Tailwind colors for the chart
  const balanceColor = getTailwindColor("blue", 500);
  const changeColor = getTailwindColor("emerald", 500);

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="font-semibold text-lg text-slate-900">
          {title}
        </CardTitle>
        {subtitle && (
          <p className="font-normal text-slate-600 text-sm">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="p-2">
        <div className="h-72 w-full overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 40, left: 60, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                stroke="#64748b"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
                tickMargin={10}
              />
              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="balance"
                stackId="1"
                stroke={balanceColor}
                fill={balanceColor}
                fillOpacity={0.6}
                name="Balance"
              />
              <Area
                type="monotone"
                dataKey="change"
                stackId="2"
                stroke={changeColor}
                fill={changeColor}
                fillOpacity={0.4}
                name="Change"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
