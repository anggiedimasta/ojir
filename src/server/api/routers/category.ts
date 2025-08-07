import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { categories, subcategories } from "~/server/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { defaultCategories } from "~/data/categories";

// Category input schemas
const createCategorySchema = z.object({
	name: z.string().min(1, "Category name is required"),
	icon: z.string().optional(),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
});

const updateCategorySchema = createCategorySchema.partial();

const createSubcategorySchema = z.object({
	name: z.string().min(1, "Subcategory name is required"),
	icon: z.string().optional(),
	color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
	categoryId: z.string().min(1, "Category ID is required"),
});

const updateSubcategorySchema = createSubcategorySchema.partial();

export const categoryRouter = createTRPCRouter({
	// Get all categories for the current user
	getCategories: protectedProcedure.query(async ({ ctx }) => {
		const userCategories = await ctx.db
			.select()
			.from(categories)
			.where(eq(categories.userId, ctx.session.user.id));

		return userCategories;
	}),

	// Get all subcategories for the current user
	getSubcategories: protectedProcedure.query(async ({ ctx }) => {
		const userSubcategories = await ctx.db
			.select()
			.from(subcategories)
			.where(eq(subcategories.userId, ctx.session.user.id));

		return userSubcategories;
	}),

	// Get categories with their subcategories
	getCategoriesWithSubcategories: protectedProcedure.query(async ({ ctx }) => {
		const userCategories = await ctx.db
			.select()
			.from(categories)
			.where(eq(categories.userId, ctx.session.user.id));

		const userSubcategories = await ctx.db
			.select()
			.from(subcategories)
			.where(eq(subcategories.userId, ctx.session.user.id));

		// Group subcategories by category
		const categoriesWithSubcategories = userCategories.map((category) => ({
			...category,
			subcategories: userSubcategories.filter(
				(sub) => sub.categoryId === category.id,
			),
		}));

		return categoriesWithSubcategories;
	}),

	// Create a new category
	createCategory: protectedProcedure
		.input(createCategorySchema)
		.mutation(async ({ ctx, input }) => {
			const newCategory = await ctx.db
				.insert(categories)
				.values({
					...input,
					userId: ctx.session.user.id,
				})
				.returning();

			return newCategory[0];
		}),

	// Update a category
	updateCategory: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				...updateCategorySchema.shape,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			const updatedCategory = await ctx.db
				.update(categories)
				.set({
					...updateData,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(categories.id, id),
						eq(categories.userId, ctx.session.user.id),
					),
				)
				.returning();

			return updatedCategory[0];
		}),

	// Delete a category
	deleteCategory: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			// Check if category has subcategories
			const existingSubcategories = await ctx.db
				.select()
				.from(subcategories)
				.where(
					and(
						eq(subcategories.categoryId, input.id),
						eq(subcategories.userId, ctx.session.user.id),
					),
				);

			if (existingSubcategories.length > 0) {
				throw new Error("Cannot delete category with existing subcategories");
			}

			const deletedCategory = await ctx.db
				.delete(categories)
				.where(
					and(
						eq(categories.id, input.id),
						eq(categories.userId, ctx.session.user.id),
					),
				)
				.returning();

			return deletedCategory[0];
		}),

	// Create a new subcategory
	createSubcategory: protectedProcedure
		.input(createSubcategorySchema)
		.mutation(async ({ ctx, input }) => {
			// Verify that the category belongs to the user
			const category = await ctx.db
				.select()
				.from(categories)
				.where(
					and(
						eq(categories.id, input.categoryId),
						eq(categories.userId, ctx.session.user.id),
					),
				);

			if (category.length === 0) {
				throw new Error("Category not found");
			}

			const newSubcategory = await ctx.db
				.insert(subcategories)
				.values({
					...input,
					userId: ctx.session.user.id,
				})
				.returning();

			return newSubcategory[0];
		}),

	// Update a subcategory
	updateSubcategory: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				...updateSubcategorySchema.shape,
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { id, ...updateData } = input;

			const updatedSubcategory = await ctx.db
				.update(subcategories)
				.set({
					...updateData,
					updatedAt: new Date(),
				})
				.where(
					and(
						eq(subcategories.id, id),
						eq(subcategories.userId, ctx.session.user.id),
					),
				)
				.returning();

			return updatedSubcategory[0];
		}),

	// Delete a subcategory
	deleteSubcategory: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			const deletedSubcategory = await ctx.db
				.delete(subcategories)
				.where(
					and(
						eq(subcategories.id, input.id),
						eq(subcategories.userId, ctx.session.user.id),
					),
				)
				.returning();

			return deletedSubcategory[0];
		}),

	// Initialize default categories for a user
	initializeDefaultCategories: protectedProcedure.mutation(async ({ ctx }) => {
		const userId = ctx.session.user.id;

		// Import transactions table
		const { transactions } = await import("~/server/db/schema");

		try {
			// First, check if "uncategorized" category already exists
			const existingUncategorized = await ctx.db
				.select()
				.from(categories)
				.where(
					and(
						eq(categories.id, "uncategorized"),
						eq(categories.userId, userId),
					),
				);

			let uncategorized: typeof categories.$inferSelect;
			if (existingUncategorized.length === 0) {
				// Create uncategorized category if it doesn't exist
				const uncategorizedCategory = defaultCategories.find(
					(cat) => cat.id === "uncategorized",
				);
				if (!uncategorizedCategory) {
					throw new Error(
						"Uncategorized category not found in default categories",
					);
				}

				const [newUncategorized] = await ctx.db
					.insert(categories)
					.values({
						id: uncategorizedCategory.id,
						name: uncategorizedCategory.name,
						icon: uncategorizedCategory.icon,
						color: uncategorizedCategory.color,
						userId,
						isDefault: true,
					})
					.returning();

				if (!newUncategorized) {
					throw new Error("Failed to create uncategorized category");
				}
				uncategorized = newUncategorized;
			} else {
				uncategorized =
					existingUncategorized[0] as typeof categories.$inferSelect;
			}

			// Now update all transactions to use the "uncategorized" category
			await ctx.db
				.update(transactions)
				.set({
					categoryId: "uncategorized",
					subcategoryId: null,
				})
				.where(eq(transactions.userId, userId));

			// Clear existing categories and subcategories for this user (except uncategorized)
			await ctx.db
				.delete(subcategories)
				.where(eq(subcategories.userId, userId));
			await ctx.db
				.delete(categories)
				.where(
					and(
						eq(categories.userId, userId),
						ne(categories.id, "uncategorized"),
					),
				);

			// Create all default categories
			const createdCategories = [];
			for (const categoryData of defaultCategories) {
				// Skip uncategorized as it's already created
				if (categoryData.id === "uncategorized") {
					createdCategories.push(uncategorized);
					continue;
				}

				const [category] = await ctx.db
					.insert(categories)
					.values({
						id: categoryData.id,
						name: categoryData.name,
						icon: categoryData.icon,
						color: categoryData.color,
						userId,
						isDefault: true,
					})
					.returning();

				if (!category) {
					throw new Error(`Failed to create category: ${categoryData.name}`);
				}

				createdCategories.push(category);

				// Create subcategories for this category
				for (const subcategoryData of categoryData.subcategories) {
					// Check if subcategory already exists
					const existingSubcategory = await ctx.db
						.select()
						.from(subcategories)
						.where(
							and(
								eq(subcategories.id, subcategoryData.id),
								eq(subcategories.userId, userId),
							),
						);

					if (existingSubcategory.length === 0) {
						await ctx.db.insert(subcategories).values({
							id: subcategoryData.id,
							name: subcategoryData.name,
							icon: subcategoryData.icon,
							color: subcategoryData.color,
							categoryId: category.id,
							userId,
							isDefault: true,
						});
					}
				}
			}

			return createdCategories;
		} catch (error) {
			console.error("Failed to initialize categories:", error);
			throw error;
		}
	}),
});
