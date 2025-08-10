import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import type { CalendarEventResponse } from "~/entities/api/calendar";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { db } from "~/server/db";
import { calendarEvents } from "~/server/db/schema";
import { fetchGoogleCalendarEvents } from "../google-calendar";

export const calendarRouter = createTRPCRouter({
  getByDateRange: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        includeGoogleEvents: z.boolean().default(false),
      }),
    )
    .query(async ({ ctx, input }) => {
      const session = ctx.session;

      try {
        // Get local events from database
        const localEvents = await ctx.db.query.calendarEvents.findMany({
          where: eq(calendarEvents.userId, session.user.id),
        });

        const events: CalendarEventResponse[] = [
          ...localEvents.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            isGoogleEvent: false,
          })),
        ];

        // Add Google Calendar events if requested and access token is available
        if (input.includeGoogleEvents && session.accessToken) {
          try {
            const googleEvents = await fetchGoogleCalendarEvents(
              session.accessToken,
              input.startDate,
              input.endDate,
            );

            // Transform and add Google events
            events.push(
              ...(Array.isArray(googleEvents)
                ? googleEvents.map((event) => ({
                    id: event.id,
                    title: event.summary,
                    description: event.description ?? null,
                    startTime: new Date(event.start.dateTime),
                    endTime: new Date(event.end.dateTime),
                    isGoogleEvent: true,
                    // Include all the additional Google Calendar fields
                    status: event.status,
                    location: event.location,
                    attendees: event.attendees,
                    creator: event.creator,
                    organizer: event.organizer,
                    htmlLink: event.htmlLink,
                    reminders: event.reminders,
                    visibility: event.visibility,
                  }))
                : []),
            );
          } catch (error) {
            console.error("Google Calendar API error:", error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message:
                error instanceof Error
                  ? `Failed to fetch Google Calendar events: ${error.message}`
                  : "Failed to fetch Google Calendar events",
            });
          }
        }

        return events;
      } catch (error) {
        console.error("Error in calendar.getByDateRange:", error);

        // If it's already a TRPCError, just re-throw it
        if (error instanceof TRPCError) {
          throw error;
        }

        // Otherwise, wrap it in a generic error
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch calendar events",
        });
      }
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        startTime: z.date(),
        endTime: z.date(),
      }),
    )
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
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db
        .update(calendarEvents)
        .set(updateData)
        .where(
          and(
            eq(calendarEvents.id, id),
            eq(calendarEvents.userId, ctx.session.user.id),
          ),
        );
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .delete(calendarEvents)
        .where(
          and(
            eq(calendarEvents.id, input.id),
            eq(calendarEvents.userId, ctx.session.user.id),
          ),
        );
    }),

  // Simplified share functionality - just copies the dashboard URL
  shareEvent: protectedProcedure
    .input(
      z.object({
        eventId: z.string(),
        isGoogleEvent: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        if (input.isGoogleEvent) {
          // For Google events, just return the dashboard URL
          return {
            success: true,
            publicUrl: `/dashboard/calendar/event/${encodeURIComponent(input.eventId)}`,
            message: "Event URL ready to share",
          };
        }
        // For local events, verify it exists and belongs to the user
        const localEvent = await ctx.db.query.calendarEvents.findFirst({
          where: and(
            eq(calendarEvents.id, input.eventId),
            eq(calendarEvents.userId, ctx.session.user.id),
          ),
        });

        if (!localEvent) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Event not found",
          });
        }

        return {
          success: true,
          publicUrl: `/dashboard/calendar/event/${encodeURIComponent(input.eventId)}`,
          message: "Event URL ready to share",
        };
      } catch (error) {
        console.error("Error sharing event:", error);

        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to share event",
        });
      }
    }),
});
