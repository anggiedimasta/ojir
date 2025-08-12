"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { DashboardPageLayout } from "~/components/templates";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { CategoryPill } from "~/components/ui/category-pill";
import { CategorySelector } from "~/components/wallet/category-selector";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// Helper function to get Tailwind color classes
const getTailwindColorClasses = (color: string, colorIntensity: number) => {
  const normalizedColor = color.toLowerCase();
  const intensity = Math.max(50, Math.min(950, colorIntensity));

  return {
    background: `bg-${normalizedColor}-${intensity}`,
    text: `text-${normalizedColor}-${Math.min(intensity + 400, 900)}`,
    border: `border-${normalizedColor}-${Math.min(intensity + 100, 900)}`,
  };
};

import { getIconComponent } from "~/components/ui/dynamic-icon-helper";

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

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoriesData.map((category) => (
              <Card
                key={category.id}
                className={cn(
                  "border-2 transition-all hover:shadow-md",
                  getTailwindColorClasses(category.color, 500).border,
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {(() => {
                        const IconComponent = getIconComponent(
                          category.icon || "Tag",
                        );
                        return <IconComponent className="h-8 w-8" />;
                      })()}
                      <CardTitle className="font-semibold text-lg">
                        {category.name}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-row flex-wrap gap-2">
                    {category.subcategories
                      .sort((a, b) => (a.position || 0) - (b.position || 0))
                      .map((subcategory) => (
                        <CategoryPill
                          key={subcategory.id}
                          name={subcategory.name}
                          color={subcategory.color}
                          colorIntensity={subcategory.colorIntensity || 100}
                        />
                      ))}
                  </div>
                </CardContent>
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
