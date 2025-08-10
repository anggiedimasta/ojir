"use client";

import { Banknote, CreditCard, HelpCircle, QrCode, Tag } from "lucide-react";
import { useEffect, useState } from "react";

interface DynamicIconProps {
  iconName?: string;
  className?: string;
  size?: number;
  fallbackIcon?: React.ComponentType<{ className?: string; size?: number }>;
}

// Icon mapping for common payment method icons
const iconMap: Record<
  string,
  React.ComponentType<{ className?: string; size?: number }>
> = {
  qrcode: QrCode,
  qris: QrCode,
  banknote: Banknote,
  transfer: Banknote,
  "credit-card": CreditCard,
  "virtual-account": CreditCard,
  "bi-fast": Banknote,
  help: HelpCircle,
};

// Dynamic icon component that loads icons based on icon names
export function DynamicIcon({
  iconName,
  className = "",
  size,
  fallbackIcon = Tag,
}: DynamicIconProps) {
  const [IconComponent, setIconComponent] =
    useState<React.ComponentType<{ className?: string; size?: number }>>(
      fallbackIcon,
    );

  useEffect(() => {
    if (!iconName) {
      setIconComponent(fallbackIcon);
      return;
    }

    // Check if we have a direct mapping
    if (iconMap[iconName]) {
      setIconComponent(iconMap[iconName]);
      return;
    }

    // Convert kebab-case to PascalCase (e.g., "credit-card" -> "CreditCard")
    const pascalCaseName = iconName
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");

    // Try to find in iconMap with PascalCase
    if (iconMap[pascalCaseName]) {
      setIconComponent(iconMap[pascalCaseName]);
      return;
    }

    // Fallback to Tag icon if no mapping found
    console.warn(
      `Icon "${iconName}" not found in mapping, using fallback icon`,
    );
    setIconComponent(fallbackIcon);
  }, [iconName, fallbackIcon]);

  return <IconComponent className={className} size={size} />;
}
