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
  className?: string;
}

// Function to get Tailwind color classes for chart
const getTailwindColorClasses = (color: string, colorIntensity: number) => {
  const normalizedColor = color.toLowerCase();
  // Map intensity to the closest available Tailwind intensity
  const intensity = Math.max(50, Math.min(950, colorIntensity));

  // Find the closest available intensity from the standard set
  const availableIntensities = [
    50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
  ];
  let closestIntensity = 500; // Default fallback

  for (const level of availableIntensities) {
    if (Math.abs(level - intensity) < Math.abs(closestIntensity - intensity)) {
      closestIntensity = level;
    }
  }

  return {
    background: `bg-${normalizedColor}-${closestIntensity}`,
    text: `text-${normalizedColor}-${closestIntensity}`,
    border: `border-${normalizedColor}-${closestIntensity}`,
  };
};

// Function to get CSS custom property value for chart fill
const getChartColor = (color: string, intensity = 500): string => {
  const normalizedColor = color.toLowerCase();
  const normalizedIntensity = Math.max(50, Math.min(950, intensity));

  // Get the CSS custom property value
  const cssVar = `var(--${normalizedColor}-${normalizedIntensity})`;

  // Fallback to a default color if CSS variable is not available
  return cssVar || "#6b7280"; // slate-500 as fallback
};

export function CategoryBreakdownChart({
  data,
  title = "Category Breakdown",
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

  const formatPercentage = (value: number, total: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "percent",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value / total);
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
      const data = payload[0];
      if (!data) return null;

      const total = data.value;
      return (
        <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
          <p className="font-medium text-slate-900 text-sm">{label}</p>
          <p className="text-slate-600 text-sm">
            Amount: {formatCurrency(total)}
          </p>
          <p className="text-slate-600 text-sm">
            Percentage: {formatPercentage(total, total)}
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
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={25}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`
                }
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${entry.name}-${entry.value}`}
                    fill={getChartColor(
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
