import { z } from "zod";
import { eq } from "drizzle-orm";
import { protectedProcedure } from "../../../api/trpc";
import { calendarEvents } from "../../../db/schema";
import { fetchGoogleCalendarEvents } from "../../../api/google-calendar";
import { TRPCError } from "@trpc/server";
import type { CalendarEventResponse } from "~/entities/api/calendar";

export const calendarQueries = {
  getByDateRange: protectedProcedure
    .input(z.object({
      startDate: z.date(),
      endDate: z.date(),
      includeGoogleEvents: z.boolean().default(false),
    }))
    .query(async ({ ctx, input }) => {
      const session = ctx.session;

      try {
        // Get local events from database
        const localEvents = await ctx.db.query.calendarEvents.findMany({
          where: eq(calendarEvents.userId, session.user.id),
        });

        const events: CalendarEventResponse[] = [
          ...localEvents.map(event => ({
            id: event.id,
            title: event.title,
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            isGoogleEvent: false,
          }))
        ];

        // Add Google Calendar events if requested and access token is available
        if (input.includeGoogleEvents && session.accessToken) {
          try {
            const googleEvents = await fetchGoogleCalendarEvents(
              session.accessToken,
              input.startDate,
              input.endDate
            );

            // Transform and add Google events
            events.push(
              ...(Array.isArray(googleEvents) ? googleEvents.map(event => ({
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
              })) : []),
            );
          } catch (error) {
            console.error("Google Calendar API error:", error);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: error instanceof Error
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
          message: "Failed to fetch calendar events"
        });
      }
    }),
};