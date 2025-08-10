import { asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { banks, paymentMethods } from "~/server/db/schema";
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
          code: paymentMethods.code,
          name: paymentMethods.name,
          icon: paymentMethods.icon,
          isActive: paymentMethods.isActive,
        })
        .from(paymentMethods)
        .where(eq(paymentMethods.isActive, true))
        .orderBy(asc(paymentMethods.name));

      return result;
    } catch (error) {
      console.error("Error fetching payment methods:", error);
      return [];
    }
  }),
});
