// Tailwind CSS v4 compatible color system using CSS custom properties
// This ensures colors are not purged during build and uses the existing CSS variables

export type ColorName =
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose"
  | "gray"
  | "slate"
  | "zinc"
  | "neutral"
  | "stone";

export type ColorIntensity =
  | 50
  | 100
  | 150
  | 200
  | 250
  | 300
  | 350
  | 400
  | 450
  | 500
  | 550
  | 600
  | 650
  | 700
  | 750
  | 800
  | 850
  | 900
  | 950;

// Helper function to get color value from CSS custom properties
export function getColorValue(
  colorName: string,
  intensityLevel: number,
): string {
  const normalizedColor = colorName.toLowerCase() as ColorName;
  const cssVariable = `--${normalizedColor}-${intensityLevel}`;

  // Try to get the CSS variable value
  const colorValue = getComputedStyle(
    document.documentElement,
  )?.getPropertyValue(cssVariable);

  if (colorValue?.trim()) {
    return colorValue.trim();
  }

  // Fallback: try to find the closest available intensity
  const availableIntensities: ColorIntensity[] = [
    50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750,
    800, 850, 900, 950,
  ];

  // Find the closest available intensity level
  let closestIntensity: ColorIntensity =
    availableIntensities[0] as ColorIntensity;
  for (const level of availableIntensities) {
    const testVariable = `--${normalizedColor}-${level}`;
    const testValue = getComputedStyle(
      document.documentElement,
    )?.getPropertyValue(testVariable);

    if (testValue?.trim()) {
      if (
        Math.abs(level - intensityLevel) <
        Math.abs(closestIntensity - intensityLevel)
      ) {
        closestIntensity = level;
      }
    }
  }

  // Return the closest available color or fallback to gray
  const fallbackVariable = `--${normalizedColor}-${closestIntensity}`;
  const fallbackValue = getComputedStyle(
    document.documentElement,
  )?.getPropertyValue(fallbackVariable);

  if (fallbackValue?.trim()) {
    return fallbackValue.trim();
  }

  // Ultimate fallback to gray-500
  return (
    getComputedStyle(document.documentElement)
      ?.getPropertyValue("--gray-500")
      ?.trim() || "oklch(0.71 0 0)"
  );
}

// Helper function to create OKLCH color with alpha
export function getOklchWithAlpha(
  colorName: string,
  intensityLevel: number,
  alpha: number,
): string {
  const baseColor = getColorValue(colorName, intensityLevel);

  // If it's already OKLCH, just add alpha
  if (baseColor.startsWith("oklch")) {
    return `${baseColor} / ${alpha}`;
  }

  // Fallback for any other format
  return `oklch(0.71 0 0 / ${alpha})`;
}
