/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { TRPCError, initTRPC } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import superjson from "superjson";
import { ZodError } from "zod";

import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { authAccounts } from "~/server/db/schema";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
	const session = await auth();

	// If we have a session, check and refresh the access token if needed
	let accessToken = session?.accessToken;
	if (session?.user?.id) {
		try {
			// Get the account from database
			const account = await db.query.authAccounts.findFirst({
				where: (authAccounts, { eq, and }) =>
					and(
						eq(authAccounts.userId, session.user.id),
						eq(authAccounts.provider, "google"),
					),
			});

			if (account?.refresh_token) {
				const isExpired = account.expires_at
					? Date.now() >= account.expires_at * 1000 - 5 * 60 * 1000
					: true;

				// Refresh if expired or if no access token
				if (isExpired || !accessToken) {
					// Try to refresh the token
					const response = await fetch("https://oauth2.googleapis.com/token", {
						method: "POST",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
						},
						body: new URLSearchParams({
							client_id: process.env.AUTH_GOOGLE_ID || "",
							client_secret: process.env.AUTH_GOOGLE_SECRET || "",
							grant_type: "refresh_token",
							refresh_token: account.refresh_token,
							scope: [
								"openid",
								"email",
								"profile",
								"https://www.googleapis.com/auth/calendar",
								"https://www.googleapis.com/auth/gmail.readonly",
							].join(" "),
						}),
					});

					if (response.ok) {
						const tokens = await response.json();

						// Update the database with new tokens
						await db
							.update(authAccounts)
							.set({
								access_token: tokens.access_token,
								refresh_token: tokens.refresh_token || account.refresh_token,
								expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
								scope: tokens.scope || account.scope,
							})
							.where(
								and(
									eq(authAccounts.userId, session.user.id),
									eq(authAccounts.provider, "google"),
								),
							);

						accessToken = tokens.access_token;
					}
				} else if (account.access_token) {
					accessToken = account.access_token;
				}
			}
		} catch (error) {
			console.error("Token refresh in TRPC context failed:", error);
		}
	}

	return {
		db,
		session,
		accessToken,
		...opts,
	};
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof ZodError ? error.cause.flatten() : null,
			},
		};
	},
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
	const start = Date.now();

	if (t._config.isDev) {
		// artificial delay in dev
		const waitMs = Math.floor(Math.random() * 400) + 100;
		await new Promise((resolve) => setTimeout(resolve, waitMs));
	}

	const result = await next();

	return result;
});

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
	.use(timingMiddleware)
	.use(({ ctx, next }) => {
		if (!ctx.session?.user) {
			throw new TRPCError({ code: "UNAUTHORIZED" });
		}
		return next({
			ctx: {
				// infers the `session` as non-nullable
				session: { ...ctx.session, user: ctx.session.user },
			},
		});
	});
