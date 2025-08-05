import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { protectedProcedure } from "../../../api/trpc";
import { calendarEvents } from "../../../db/schema";
import { TRPCError } from "@trpc/server";

export const calendarMutations = {
  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      startTime: z.date(),
      endTime: z.date(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(calendarEvents).values({
        title: input.title,
        description: input.description,
        startTime: input.startTime,
        endTime: input.endTime,
        userId: ctx.session.user.id,
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      startTime: z.date().optional(),
      endTime: z.date().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db
        .update(calendarEvents)
        .set(updateData)
        .where(
          and(
            eq(calendarEvents.id, id),
            eq(calendarEvents.userId, ctx.session.user.id)
          )
        );
    }),

  delete: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(calendarEvents)
        .where(
          and(
            eq(calendarEvents.id, input.id),
            eq(calendarEvents.userId, ctx.session.user.id)
          )
        );
    }),

  // Simplified share functionality - just copies the dashboard URL
  shareEvent: protectedProcedure
    .input(z.object({
      eventId: z.string(),
      isGoogleEvent: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.isGoogleEvent) {
          // For Google events, just return the dashboard URL
          return {
            success: true,
            publicUrl: `/dashboard/calendar/event/${encodeURIComponent(input.eventId)}`,
            message: "Event URL ready to share"
          };
        } else {
          // For local events, verify it exists and belongs to the user
          const localEvent = await ctx.db.query.calendarEvents.findFirst({
            where: and(
              eq(calendarEvents.id, input.eventId),
              eq(calendarEvents.userId, ctx.session.user.id)
            ),
          });

          if (!localEvent) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Event not found"
            });
          }

          return {
            success: true,
            publicUrl: `/dashboard/calendar/event/${encodeURIComponent(input.eventId)}`,
            message: "Event URL ready to share"
          };
        }
      } catch (error) {
        console.error("Error sharing event:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to share event"
        });
      }
    }),
}; 