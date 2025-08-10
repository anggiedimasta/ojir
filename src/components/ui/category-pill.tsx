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
  Clock,
  Cloud,
  Coffee,
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
  };

  const IconComponent = iconMap[iconName];
  return IconComponent || Tag; // Default to Tag if icon not found
};

interface CategoryPillProps {
  categoryName?: string | null;
  categoryIcon?: string | null;
  subcategoryName?: string | null;
  subcategoryIcon?: string | null;
  className?: string;
}

export function CategoryPill({
  categoryName,
  categoryIcon,
  subcategoryName,
  subcategoryIcon,
  className = "",
}: CategoryPillProps) {
  if (!categoryName) return null;

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      {/* Category Pill */}
      <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-medium text-slate-700 text-xs">
        {categoryIcon &&
          (() => {
            const IconComponent = getIconComponent(categoryIcon);
            return <IconComponent className="h-3 w-3" />;
          })()}
        {categoryName}
      </span>

      {/* Subcategory Pill - only show if different from category */}
      {subcategoryName && subcategoryName !== categoryName && (
        <span className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-1 font-medium text-slate-600 text-xs">
          {subcategoryIcon &&
            (() => {
              const IconComponent = getIconComponent(subcategoryIcon);
              return <IconComponent className="h-3 w-3" />;
            })()}
          {subcategoryName}
        </span>
      )}
    </div>
  );
}
