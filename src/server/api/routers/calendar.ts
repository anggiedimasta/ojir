import { z } from "zod";
import { and, eq, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { calendarEvents } from "~/server/db/schema";
import { fetchGoogleCalendarEvents } from "../google-calendar";

export const calendarRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        startTime: z.date(),
        endTime: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = await ctx.db
        .insert(calendarEvents)
        .values({
          title: input.title,
          description: input.description,
          startTime: input.startTime,
          endTime: input.endTime,
          userId: ctx.session.user.id,
        })
        .returning();

      return event[0];
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        startTime: z.date().optional(),
        endTime: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      const event = await ctx.db
        .update(calendarEvents)
        .set({
          ...data,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(calendarEvents.id, id),
            eq(calendarEvents.userId, ctx.session.user.id)
          )
        )
        .returning();

      return event[0];
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(calendarEvents)
        .where(
          and(
            eq(calendarEvents.id, input.id),
            eq(calendarEvents.userId, ctx.session.user.id)
          )
        );
    }),

  getByDateRange: protectedProcedure
    .input(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        includeGoogleEvents: z.boolean().default(true),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const [localEvents, googleEvents] = await Promise.all([
          ctx.db.query.calendarEvents.findMany({
            where: and(
              eq(calendarEvents.userId, ctx.session.user.id),
              gte(calendarEvents.startTime, input.startDate),
              lte(calendarEvents.endTime, input.endDate)
            ),
            orderBy: (events, { asc }) => [asc(events.startTime)],
          }),
          input.includeGoogleEvents && ctx.session.accessToken
            ? fetchGoogleCalendarEvents(
                ctx.session.accessToken,
                input.startDate,
                input.endDate
              ).catch((error) => {
                if (error.message?.includes("Unauthorized")) {
                  throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "Your Google Calendar session has expired. Please sign in again.",
                  });
                }

                throw new TRPCError({
                  code: "INTERNAL_SERVER_ERROR",
                  message: "Failed to fetch Google Calendar events",
                  cause: error
                });
              })
            : Promise.resolve([]),
        ]);

        return [
          ...localEvents.map((event) => ({ ...event, isGoogleEvent: false })),
          ...(Array.isArray(googleEvents) ? googleEvents.map(event => ({
            id: event.id,
            title: event.summary,
            description: event.description ?? null,
            startTime: new Date(event.start.dateTime),
            endTime: new Date(event.end.dateTime),
            isGoogleEvent: true
          })) : []),
        ];
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch calendar events",
          cause: error
        });
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const events = await ctx.db.query.calendarEvents.findMany({
      where: eq(calendarEvents.userId, ctx.session.user.id),
      orderBy: (events, { asc }) => [asc(events.startTime)],
    });

    return events;
  }),
});