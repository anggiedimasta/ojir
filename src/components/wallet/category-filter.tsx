"use client";

import {
  Activity,
  AlertTriangle,
  Baby,
  Backpack,
  BarChart3,
  Beer,
  Bike,
  BookOpen,
  Brain,
  Briefcase,
  Building,
  Bus,
  Car,
  ChefHat,
  ChevronDown,
  ChevronUp,
  Clock,
  Cloud,
  Coffee,
  CreditCard,
  Dice1,
  DollarSign,
  Droplets,
  Dumbbell,
  FerrisWheel,
  FileText,
  Film,
  Fuel,
  Gamepad2,
  Gem,
  Gift,
  Glasses,
  Globe,
  GraduationCap,
  Hamburger,
  Hammer,
  Headphones,
  Heart,
  HelpCircle,
  Home,
  Image,
  Landmark,
  Leaf,
  Lightbulb,
  Lock,
  Megaphone,
  Monitor,
  Music,
  Newspaper,
  Package,
  Palette,
  Paperclip,
  ParkingCircle,
  PartyPopper,
  PawPrint,
  Pill,
  Plane,
  RotateCcw,
  Scale,
  Scissors,
  Shield,
  Shirt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sofa,
  Sparkles,
  Sprout,
  Stethoscope,
  Tag,
  TestTube,
  TrendingUp,
  Trophy,
  Truck,
  User,
  UserCheck,
  Users,
  Utensils,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { api } from "~/trpc/react";

// Helper function to get Lucide icon component by name
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    Activity,
    AlertTriangle,
    Baby,
    Backpack,
    BarChart3,
    Beer,
    Bike,
    BookOpen,
    Brain,
    Briefcase,
    Building,
    Bus,
    Car,
    ChefHat,
    Clock,
    Cloud,
    Coffee,
    CreditCard,
    Dice1,
    DollarSign,
    Droplets,
    Dumbbell,
    FerrisWheel,
    FileText,
    Film,
    Fuel,
    Gamepad2,
    Gem,
    Gift,
    Glasses,
    Globe,
    GraduationCap,
    Hamburger,
    Hammer,
    Headphones,
    Heart,
    HelpCircle,
    Home,
    Image,
    Landmark,
    Leaf,
    Lightbulb,
    Lock,
    Megaphone,
    Monitor,
    Music,
    Newspaper,
    Package,
    Palette,
    Paperclip,
    ParkingCircle,
    PartyPopper,
    PawPrint,
    Pill,
    Plane,
    RotateCcw,
    Scale,
    Scissors,
    Shield,
    Shirt,
    ShoppingBag,
    ShoppingCart,
    Smartphone,
    Sofa,
    Sparkles,
    Sprout,
    Stethoscope,
    TestTube,
    TrendingUp,
    Trophy,
    Truck,
    User,
    UserCheck,
    Users,
    Utensils,
    Wrench,
    Zap,
  };

  const IconComponent = iconMap[iconName];
  return IconComponent || Tag;
};

interface CategoryFilterProps {
  selectedCategoryId?: string | null;
  selectedSubcategoryId?: string | null;
  onCategoryChange: (categoryId: string | null) => void;
  onSubcategoryChange: (subcategoryId: string | null) => void;
  className?: string;
}

export function CategoryFilter({
  selectedCategoryId,
  selectedSubcategoryId,
  onCategoryChange,
  onSubcategoryChange,
  className = "",
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    selectedCategoryId || null,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: categoriesData, isLoading } =
    api.category.getCategoriesWithSubcategories.useQuery();

  useEffect(() => {
    setSelectedCategory(selectedCategoryId || null);
  }, [selectedCategoryId]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategoryChange(categoryId);
    onSubcategoryChange(null); // Reset subcategory when category changes
    // Keep dropdown open to show subcategories
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    onSubcategoryChange(subcategoryId);
    // Also set the category when subcategory is selected
    if (selectedCategory) {
      onCategoryChange(selectedCategory);
    }
    // Close dropdown when subcategory is selected
    setIsOpen(false);
  };

  const selectedCategoryData = categoriesData?.find(
    (cat) => cat.id === selectedCategory,
  );

  const selectedSubcategoryData = selectedCategoryData?.subcategories.find(
    (sub) => sub.id === selectedSubcategoryId,
  );

  // Get display text for the button
  const getDisplayText = () => {
    if (selectedSubcategoryData) {
      return selectedSubcategoryData.name;
    }
    if (selectedCategoryData) {
      return selectedCategoryData.name;
    }
    return "Select category";
  };

  // Get display icon for the button
  const getDisplayIcon = () => {
    if (selectedSubcategoryData?.icon) {
      return getIconComponent(selectedSubcategoryData.icon);
    }
    if (selectedCategoryData?.icon) {
      return getIconComponent(selectedCategoryData.icon);
    }
    return Tag;
  };

  if (isLoading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="h-8 w-full animate-pulse rounded-md bg-gray-100" />
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      <div className="relative w-full">
        <Button
          type="button"
          color="ghost"
          className="h-10 w-full justify-between border border-gray-300 bg-white text-sm"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Select category"
        >
          <div className="flex min-w-0 items-center gap-2">
            {(() => {
              const IconComponent = getDisplayIcon();
              return <IconComponent className="h-4 w-4" />;
            })()}
            <span className="truncate">{getDisplayText()}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 flex-shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 flex-shrink-0" />
          )}
        </Button>

        {isOpen && (
          <Card className="absolute z-50 mt-1 max-h-48 w-full overflow-y-auto">
            <div className="space-y-0.5 p-1">
              {categoriesData?.map((category) => (
                <div key={category.id} className="space-y-0.5">
                  <button
                    type="button"
                    className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100 ${
                      selectedCategory === category.id ? "bg-gray-50" : ""
                    }`}
                    onClick={() => handleCategorySelect(category.id)}
                  >
                    {(() => {
                      const IconComponent = getIconComponent(
                        category.icon || "HelpCircle",
                      );
                      return <IconComponent className="h-4 w-4" />;
                    })()}
                    <span className="flex-1">{category.name}</span>
                  </button>

                  {selectedCategory === category.id &&
                    category.subcategories.length > 0 && (
                      <div className="ml-4 space-y-0.5">
                        {category.subcategories.map((subcategory) => (
                          <button
                            key={subcategory.id}
                            type="button"
                            className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100 ${
                              selectedSubcategoryId === subcategory.id
                                ? "bg-gray-50"
                                : ""
                            }`}
                            onClick={() =>
                              handleSubcategorySelect(subcategory.id)
                            }
                          >
                            {(() => {
                              const IconComponent = getIconComponent(
                                subcategory.icon || "Tag",
                              );
                              return <IconComponent className="h-3 w-3" />;
                            })()}
                            <span className="flex-1">{subcategory.name}</span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
