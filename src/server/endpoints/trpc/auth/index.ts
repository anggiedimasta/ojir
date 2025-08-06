// Auth tRPC router
// This could be used for additional auth-related endpoints beyond NextAuth

import { createTRPCRouter } from "~/server/api/trpc";

// Future auth procedures can be added here
export const authRouter = createTRPCRouter({
  // Example: Custom auth procedures
  // verifyEmail: publicProcedure...
  // resetPassword: publicProcedure...
  // updateProfile: protectedProcedure...
});

// This router can be included in the main router when needed