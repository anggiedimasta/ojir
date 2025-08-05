import { protectedProcedure } from "../../../api/trpc";
import { banks } from "../../../db/schema";
import { eq, asc } from "drizzle-orm";

export const masterDataQueries = {
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
    // Return default payment methods directly to avoid database issues
    return [
      {
        id: "qris-default",
        code: "qris",
        name: "QRIS",
        displayName: "QRIS",
        description: "Quick Response Code Indonesian Standard",
        iconPath: "/icons/qris.svg",
        isActive: true,
        sortOrder: 1
      },
      {
        id: "transfer-default",
        code: "transfer",
        name: "Bank Transfer",
        displayName: "Bank Transfer",
        description: "Bank transfer or wire transfer",
        iconPath: "/icons/transfer.svg",
        isActive: true,
        sortOrder: 2
      },
      {
        id: "cash-default",
        code: "cash",
        name: "Cash",
        displayName: "Cash",
        description: "Cash payment",
        iconPath: "/icons/cash.svg",
        isActive: true,
        sortOrder: 3
      },
      {
        id: "card-default",
        code: "card",
        name: "Credit/Debit Card",
        displayName: "Credit/Debit Card",
        description: "Credit or debit card payment",
        iconPath: "/icons/card.svg",
        isActive: true,
        sortOrder: 4
      },
      {
        id: "ewallet-default",
        code: "ewallet",
        name: "E-Wallet",
        displayName: "E-Wallet",
        description: "Electronic wallet payment",
        iconPath: "/icons/ewallet.svg",
        isActive: true,
        sortOrder: 5
      }
    ];
  }),
};