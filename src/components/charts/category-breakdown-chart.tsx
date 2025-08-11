"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface CategoryBreakdownData {
  name: string;
  value: number;
  color: string; // Tailwind color name
  colorIntensity?: number; // Tailwind color intensity (100, 200, 300, etc.)
}

interface CategoryBreakdownChartProps {
  data: CategoryBreakdownData[];
  title?: string;
  subtitle?: string;
  className?: string;
}

// Function to get chart fill color using Tailwind CSS custom properties
const getChartFillColor = (color: string, intensity = 500): string => {
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

export function CategoryBreakdownChart({
  data,
  title = "Category Breakdown",
  subtitle = "Where your money goes",
  className = "",
}: CategoryBreakdownChartProps) {
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
      payload?: { total: number };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      if (!data) return null;

      const totalValue = data.payload?.total || total;
      const percentage = totalValue > 0 ? (data.value / totalValue) * 100 : 0;

      return (
        <div className="rounded-lg border border-slate-200 bg-white shadow-lg">
          <p className="mb-2 font-semibold text-slate-900">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-sm">Amount:</span>
              <span className="font-medium text-slate-900 text-sm">
                {formatCurrency(data.value)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600 text-sm">Percentage:</span>
              <span className="font-medium text-slate-900 text-sm">
                {percentage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Calculate total for percentage calculations
  const total = data.reduce((sum, item) => sum + item.value, 0);

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
            <PieChart>
              <Pie
                data={data.map((item) => ({ ...item, total }))}
                cx="50%"
                cy="50%"
                innerRadius={30}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                }
                labelLine={false}
              >
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.name}-${entry.value}`}
                    fill={getChartFillColor(
                      entry.color,
                      entry.colorIntensity || 500,
                    )}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
