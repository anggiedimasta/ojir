import { cn } from "~/lib/utils";

// Helper function to get Tailwind color classes
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

  // Determine text color based on background intensity for proper contrast
  let textIntensity: number;
  if (closestIntensity <= 200) {
    // Light backgrounds (50, 100, 200) need dark text for contrast
    textIntensity = 900;
  } else if (closestIntensity <= 400) {
    // Medium backgrounds (300, 400) need medium-dark text
    textIntensity = 800;
  } else if (closestIntensity <= 600) {
    // Medium-dark backgrounds (500, 600) need light text
    textIntensity = 100;
  } else {
    // Dark backgrounds (700, 800, 900) need light text for contrast
    textIntensity = 50;
  }

  return {
    background: `bg-${normalizedColor}-${closestIntensity}`,
    text: `text-${normalizedColor}-${textIntensity}`,
  };
};

interface CategoryPillProps {
  name: string;
  color: string; // Tailwind color name
  colorIntensity?: number; // Tailwind color intensity (100, 200, 300, etc.)
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CategoryPill({
  name,
  color,
  colorIntensity = 100,
  className,
  size = "md",
}: CategoryPillProps) {
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };

  const colorClasses = getTailwindColorClasses(color, colorIntensity);

  return (
    <span
      className={cn(
        "inline-flex flex-row items-center rounded-full font-medium",
        colorClasses.background,
        colorClasses.text,
        sizeClasses[size],
        className,
      )}
    >
      {name}
    </span>
  );
}
