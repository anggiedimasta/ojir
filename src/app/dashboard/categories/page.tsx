"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { CategorySelector } from "~/components/wallet/category-selector";
import { DashboardPageLayout } from "~/components/templates";
import {
	Tag,
	Home,
	Utensils,
	Car,
	ShoppingBag,
	Heart,
	GraduationCap,
	Film,
	Briefcase,
	Users,
	DollarSign,
	Plane,
	PawPrint,
	PartyPopper,
	Wrench,
	Sprout,
	Smartphone,
	Stethoscope,
	BarChart3,
	Shield,
	FileText,
	Hammer,
	Sofa,
	Zap,
	Lock,
	ShoppingCart,
	Hamburger,
	Coffee,
	Truck,
	Package,
	Beer,
	ChefHat,
	Fuel,
	Bus,
	ParkingCircle,
	Bike,
	Shirt,
	BookOpen,
	Sparkles,
	Gem,
	Trophy,
	Gamepad2,
	Image,
	Paperclip,
	Pill,
	Glasses,
	Dumbbell,
	Activity,
	Brain,
	Leaf,
	Monitor,
	Music,
	Landmark,
	Palette,
	FerrisWheel,
	Dice1,
	UserCheck,
	Building,
	Megaphone,
	Scale,
	Baby,
	Gift,
	Droplets,
	Scissors,
	TrendingUp,
	RotateCcw,
	Clock,
	AlertTriangle,
	Lightbulb,
	Newspaper,
	Cloud,
	Headphones,
	TestTube,
	Globe,
	Backpack,
	User,
} from "lucide-react";

// Helper function to get Lucide icon component by name
const getIconComponent = (iconName: string) => {
	const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
		Tag,
		Home,
		Utensils,
		Car,
		ShoppingBag,
		Heart,
		GraduationCap,
		Film,
		Briefcase,
		Users,
		DollarSign,
		Plane,
		PawPrint,
		PartyPopper,
		Wrench,
		Sprout,
		Smartphone,
		Stethoscope,
		BarChart3,
		Shield,
		FileText,
		Hammer,
		Sofa,
		Zap,
		Lock,
		ShoppingCart,
		Hamburger,
		Coffee,
		Truck,
		Package,
		Beer,
		ChefHat,
		Fuel,
		Bus,
		ParkingCircle,
		Bike,
		Shirt,
		BookOpen,
		Sparkles,
		Gem,
		Trophy,
		Gamepad2,
		Image,
		Paperclip,
		Pill,
		Glasses,
		Dumbbell,
		Activity,
		Brain,
		Leaf,
		Monitor,
		Music,
		Landmark,
		Palette,
		FerrisWheel,
		Dice1,
		UserCheck,
		Building,
		Megaphone,
		Scale,
		Baby,
		Gift,
		Droplets,
		Scissors,
		TrendingUp,
		RotateCcw,
		Clock,
		AlertTriangle,
		Lightbulb,
		Newspaper,
		Cloud,
		Headphones,
		TestTube,
		Globe,
		Backpack,
		User,
	};

	const IconComponent = iconMap[iconName];
	return IconComponent || Tag; // Default to Tag if icon not found
};

export default function CategoriesPage() {
	const { data: session, status } = useSession();
	const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
		null,
	);
	const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
		string | null
	>(null);

	const {
		data: categoriesData,
		isLoading,
		refetch,
	} = api.category.getCategoriesWithSubcategories.useQuery();

	const initializeCategoriesMutation =
		api.category.initializeDefaultCategories.useMutation({
			onSuccess: () => {
				refetch();
			},
		});

	const updateTransactionsMutation =
		api.wallet.updateTransactionsWithDefaultCategory.useMutation({
			onSuccess: () => {
				// Optionally refetch wallet data if needed
			},
		});

	// Admin check - redirect if not admin
	if (status === "loading") {
		return (
			<DashboardPageLayout>
				<div className="flex min-h-screen items-center justify-center">
					<div className="h-8 w-8 animate-spin rounded-full border-blue-600 border-b-2" />
				</div>
			</DashboardPageLayout>
		);
	}

	// Simple admin check - you can enhance this later with proper role-based system
	const isAdmin = session?.user?.email === "anggiedimasta@gmail.com"; // Replace with your admin email

	if (!isAdmin) {
		redirect("/dashboard");
	}

	const handleInitializeCategories = () => {
		initializeCategoriesMutation.mutate();
	};

	const handleUpdateTransactions = () => {
		updateTransactionsMutation.mutate();
	};

	if (isLoading) {
		return (
			<DashboardPageLayout>
				<h1 className="mb-6 font-bold text-2xl">Categories</h1>
				<div className="space-y-4">
					<div className="h-8 animate-pulse rounded bg-gray-100" />
					<div className="h-8 animate-pulse rounded bg-gray-100" />
					<div className="h-8 animate-pulse rounded bg-gray-100" />
				</div>
			</DashboardPageLayout>
		);
	}

	return (
		<DashboardPageLayout>
			<h1 className="mb-6 font-bold text-2xl">Categories</h1>

			{!categoriesData || categoriesData.length === 0 ? (
				<Card className="p-6">
					<h2 className="mb-4 font-semibold text-lg">No Categories Found</h2>
					<p className="mb-4 text-gray-600">
						You haven't set up any categories yet. Click the button below to
						initialize default categories.
					</p>
					<Button
						onClick={handleInitializeCategories}
						disabled={initializeCategoriesMutation.isPending}
						color="blue"
					>
						{initializeCategoriesMutation.isPending
							? "Initializing..."
							: "Initialize Default Categories"}
					</Button>
				</Card>
			) : (
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<h2 className="font-semibold text-lg">
							Your Categories ({categoriesData.length})
						</h2>
						<div className="flex gap-2">
							<Button
								onClick={handleUpdateTransactions}
								disabled={updateTransactionsMutation.isPending}
								color="green"
								size="sm"
							>
								{updateTransactionsMutation.isPending
									? "Updating..."
									: "Update Existing Transactions"}
							</Button>
							<Button
								onClick={handleInitializeCategories}
								disabled={initializeCategoriesMutation.isPending}
								color="blue"
								size="sm"
							>
								{initializeCategoriesMutation.isPending
									? "Initializing..."
									: "Reinitialize Categories"}
							</Button>
						</div>
					</div>

					<div className="grid gap-4">
						{categoriesData.map((category) => (
							<Card key={category.id} className="p-4">
								<div className="mb-3 flex items-center gap-3">
									{(() => {
										const IconComponent = getIconComponent(
											category.icon || "Tag",
										);
										return <IconComponent className="h-8 w-8" />;
									})()}
									<div>
										<h3 className="font-semibold">{category.name}</h3>
										<p className="text-gray-500 text-sm">
											{category.subcategories.length} subcategories
										</p>
									</div>
								</div>

								{category.subcategories.length > 0 && (
									<div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
										{category.subcategories.map((subcategory) => (
											<div
												key={subcategory.id}
												className="flex items-center gap-2 rounded bg-gray-50 p-2 text-sm"
											>
												{(() => {
													const IconComponent = getIconComponent(
														subcategory.icon || "Tag",
													);
													return <IconComponent className="h-5 w-5" />;
												})()}
												<span className="truncate">{subcategory.name}</span>
											</div>
										))}
									</div>
								)}
							</Card>
						))}
					</div>

					{/* Test Category Selector */}
					<Card className="p-6">
						<h3 className="mb-4 font-semibold text-lg">
							Test Category Selector
						</h3>
						<CategorySelector
							selectedCategoryId={selectedCategoryId}
							selectedSubcategoryId={selectedSubcategoryId}
							onCategoryChange={setSelectedCategoryId}
							onSubcategoryChange={setSelectedSubcategoryId}
						/>
						<div className="mt-4 text-gray-600 text-sm">
							Selected Category: {selectedCategoryId || "None"}
							<br />
							Selected Subcategory: {selectedSubcategoryId || "None"}
						</div>
					</Card>
				</div>
			)}
		</DashboardPageLayout>
	);
}
