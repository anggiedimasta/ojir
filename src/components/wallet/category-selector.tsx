"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import {
	Activity,
	AlertTriangle,
	Baby,
	Backpack,
	BarChart3 as BarChart3Icon,
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
	CreditCard as CreditCardIcon,
	CreditCard,
	Dice1,
	DollarSign,
	Droplets,
	Dumbbell,
	FerrisWheel,
	FileText as FileTextIcon,
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
	Landmark as LandmarkIcon,
	Landmark,
	Leaf,
	Lightbulb as LightbulbIcon,
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
	RotateCcw as RotateCcwIcon,
	RotateCcw,
	Scale as ScaleIcon,
	Scale,
	Scissors,
	Shield,
	Shirt,
	ShoppingBag,
	ShoppingCart,
	Smartphone as SmartphoneIcon,
	Smartphone,
	Sofa,
	Sparkles,
	Sprout,
	Stethoscope as StethoscopeIcon,
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
	Wrench as WrenchIcon,
	Wrench,
	Zap,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

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
	return IconComponent || Tag; // Default to Tag if icon not found
};

interface CategorySelectorProps {
	selectedCategoryId?: string | null;
	selectedSubcategoryId?: string | null;
	onCategoryChange: (categoryId: string | null) => void;
	onSubcategoryChange: (subcategoryId: string | null) => void;
}

export function CategorySelector({
	selectedCategoryId,
	selectedSubcategoryId,
	onCategoryChange,
	onSubcategoryChange,
}: CategorySelectorProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		selectedCategoryId || null,
	);

	const { data: categoriesData, isLoading } =
		api.category.getCategoriesWithSubcategories.useQuery();

	useEffect(() => {
		setSelectedCategory(selectedCategoryId || null);
	}, [selectedCategoryId]);

	const handleCategorySelect = (categoryId: string) => {
		setSelectedCategory(categoryId);
		onCategoryChange(categoryId);
		onSubcategoryChange(null); // Reset subcategory when category changes
	};

	const handleSubcategorySelect = (subcategoryId: string) => {
		onSubcategoryChange(subcategoryId);
	};

	const selectedCategoryData = categoriesData?.find(
		(cat) => cat.id === selectedCategory,
	);

	if (isLoading) {
		return (
			<div className="space-y-2">
				<div className="font-medium text-gray-700 text-sm">Category</div>
				<div className="h-10 animate-pulse rounded-md bg-gray-100" />
			</div>
		);
	}

	return (
		<div className="space-y-2">
			<div className="font-medium text-gray-700 text-sm">Category</div>
			<div className="relative">
				<Button
					type="button"
					color="ghost"
					className="w-full justify-between border border-gray-300"
					onClick={() => setIsOpen(!isOpen)}
					aria-label="Select category"
				>
					<div className="flex items-center gap-2">
						{selectedCategoryData ? (
							<>
								{(() => {
									const IconComponent = getIconComponent(
										selectedCategoryData.icon || "Tag",
									);
									return <IconComponent className="h-5 w-5" />;
								})()}
								<span>{selectedCategoryData.name}</span>
							</>
						) : (
							<span className="text-gray-500">Select a category</span>
						)}
					</div>
					{isOpen ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</Button>

				{isOpen && (
					<Card className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto">
						<div className="space-y-1 p-2">
							{categoriesData?.map((category) => (
								<div key={category.id} className="space-y-1">
									<button
										type="button"
										className={`flex w-full items-center gap-2 rounded-md p-2 text-left hover:bg-gray-100 ${
											selectedCategory === category.id
												? "bg-blue-50 text-blue-700"
												: ""
										}`}
										onClick={() => handleCategorySelect(category.id)}
									>
										{(() => {
											const IconComponent = getIconComponent(
												category.icon || "HelpCircle",
											);
											return <IconComponent className="h-5 w-5" />;
										})()}
										<span className="flex-1">{category.name}</span>
									</button>

									{selectedCategory === category.id &&
										category.subcategories.length > 0 && (
											<div className="ml-6 space-y-1">
												{category.subcategories.map((subcategory) => (
													<button
														key={subcategory.id}
														type="button"
														className={`flex w-full items-center gap-2 rounded-md p-2 text-left text-sm hover:bg-gray-100 ${
															selectedSubcategoryId === subcategory.id
																? "bg-blue-50 text-blue-700"
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
															return <IconComponent className="h-4 w-4" />;
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

			{selectedCategoryData &&
				selectedCategoryData.subcategories.length > 0 && (
					<div className="text-gray-500 text-xs">
						{selectedSubcategoryId
							? `Selected: ${
									selectedCategoryData.subcategories.find(
										(sub) => sub.id === selectedSubcategoryId,
									)?.name
								}`
							: "Select a subcategory (optional)"}
					</div>
				)}
		</div>
	);
}
