import { appRouter } from "~/server/endpoints/trpc";
import { createCallerFactory } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers are now organized in /server/endpoints/trpc/.
 */
export { appRouter };

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
