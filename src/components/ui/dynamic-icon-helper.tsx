"use client";

import { HelpCircle } from "lucide-react";

// Lazy-loaded icon map for dynamically loaded icons
const dynamicIconMap = new Map<
  string,
  React.ComponentType<{ className?: string }>
>();

// Helper function to get Lucide icon component by name
export const getIconComponent = (
  iconName: string,
  fallbackIconName = "help-circle",
) => {
  // Check if icon is already dynamically loaded
  const dynamicIcon = dynamicIconMap.get(iconName);
  if (dynamicIcon) return dynamicIcon;

  // Try to dynamically load the icon
  try {
    const iconModule = require(`lucide-react/dist/esm/icons/${iconName}`);
    const IconComponent = iconModule.default || iconModule[iconName];
    if (IconComponent) {
      dynamicIconMap.set(iconName, IconComponent);
      return IconComponent;
    }
  } catch {
    // Icon not found, continue to fallback
  }

  // Try to load fallback icon dynamically
  try {
    const fallbackModule = require(
      `lucide-react/dist/esm/icons/${fallbackIconName}`,
    );
    const FallbackIconComponent =
      fallbackModule.default || fallbackModule[fallbackIconName];
    if (FallbackIconComponent) {
      dynamicIconMap.set(fallbackIconName, FallbackIconComponent);
      return FallbackIconComponent;
    }
  } catch {
    // Fallback icon not found either
  }

  // Ultimate fallback to HelpCircle
  return HelpCircle;
};
