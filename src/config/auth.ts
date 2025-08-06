import { env } from "./env";

export const authConfig = {
  // OAuth Providers
  providers: {
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
  
  // Session settings
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Security settings
  security: {
    secret: env.AUTH_SECRET,
    trustHost: env.AUTH_TRUST_HOST,
  },
  
  // Redirect URLs
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signin",
    error: "/auth/error",
  },
  
  // Callbacks and events
  callbacks: {
    redirect: {
      afterSignIn: "/dashboard",
      afterSignOut: "/",
    },
  },
} as const;