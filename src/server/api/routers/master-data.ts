import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { banks } from "~/server/db/schema";
import { ojirPaymentMethod } from "../../../../drizzle/schema";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const masterDataRouter = createTRPCRouter({
  // Get all active banks
  getBanks: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await ctx.db
        .select({
          id: banks.id,
          code: banks.code,
          name: banks.name,
          displayName: banks.displayName,
          iconPath: banks.iconPath,
          isActive: banks.isActive,
          sortOrder: banks.sortOrder,
        })
        .from(banks)
        .where(eq(banks.isActive, true))
        .orderBy(asc(banks.sortOrder), asc(banks.name));

      return result;
    } catch (error) {
      console.error("Error fetching banks:", error);
      // Return empty array if table doesn't exist yet
      return [];
    }
  }),

  // Get all active payment methods
  getPaymentMethods: protectedProcedure.query(async ({ ctx }) => {
    try {
      const result = await ctx.db
        .select({
          code: ojirPaymentMethod.code,
          name: ojirPaymentMethod.name,
          icon: ojirPaymentMethod.icon,
          isActive: ojirPaymentMethod.isActive,
        })
        .from(ojirPaymentMethod)
        .where(eq(ojirPaymentMethod.isActive, true))
        .orderBy(asc(ojirPaymentMethod.name));

      return result;
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return [];
    }
  }),

  // Create new payment method
  createPaymentMethod: protectedProcedure
    .input(
      z.object({
        code: z.string().min(1).max(50),
        name: z.string().min(1).max(255),
        icon: z.string().optional(),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const result = await ctx.db
          .insert(ojirPaymentMethod)
          .values({
            code: input.code,
            name: input.name,
            icon: input.icon,
            isActive: input.isActive,
          })
          .returning();

        return result[0];
      } catch (error) {
        console.error("Error creating payment method:", error);
        throw new Error("Failed to create payment method");
      }
    }),
});
