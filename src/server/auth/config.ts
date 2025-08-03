import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { and, eq } from "drizzle-orm";

import { env } from "~/env";
import { db } from "~/server/db";
import { authUsers, authAccounts, authSessions, authVerificationTokens } from "~/server/db/schema";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface Account {
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
  }
}

/**
 * Custom DrizzleAdapter configuration
 */
const customDrizzleAdapter = DrizzleAdapter(db, {
  usersTable: authUsers,
  accountsTable: authAccounts,
  sessionsTable: authSessions,
  verificationTokensTable: authVerificationTokens,
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  debug: false,
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/gmail.readonly"
          ].join(" ")
        }
      }
    }),
  ],
  adapter: customDrizzleAdapter,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && account.access_token) {
        // Manually update the account to ensure fresh tokens are saved
        try {
          const result = await db
            .update(authAccounts)
            .set({
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              scope: account.scope,
              token_type: account.token_type,
            })
            .where(
              and(
                eq(authAccounts.provider, account.provider),
                eq(authAccounts.providerAccountId, account.providerAccountId)
              )
            );
        } catch (error) {
          console.error("Failed to update account tokens:", error);
        }
      }
      return true;
    },
    session: async ({ session, user }) => {
      if (user?.id) {
        // Get account info from database
        const account = await db.query.authAccounts.findFirst({
          where: (authAccounts, { eq, and }) =>
            and(
              eq(authAccounts.userId, user.id),
              eq(authAccounts.provider, "google")
            )
        });

        if (account) {
          const isExpired = account.expires_at ? Date.now() >= (account.expires_at * 1000 - 5 * 60 * 1000) : true;
          const hasCalendarScope = account.scope?.includes("https://www.googleapis.com/auth/calendar");
          const hasGmailScope = account.scope?.includes("https://www.googleapis.com/auth/gmail.readonly");
          const hasAllRequiredScopes = hasCalendarScope && hasGmailScope;

          if (isExpired && account.refresh_token) {
            try {

              const response = await fetch("https://oauth2.googleapis.com/token", {
                method: "POST",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                  client_id: env.AUTH_GOOGLE_ID,
                  client_secret: env.AUTH_GOOGLE_SECRET,
                  grant_type: "refresh_token",
                  refresh_token: account.refresh_token,
                  scope: [
                    "openid",
                    "email",
                    "profile",
                    "https://www.googleapis.com/auth/calendar",
                    "https://www.googleapis.com/auth/gmail.readonly"
                  ].join(" ")
                }),
              });

              if (response.ok) {
                const tokens = await response.json();

                await db
                  .update(authAccounts)
                  .set({
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token || account.refresh_token,
                    expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
                    scope: tokens.scope || account.scope
                  })
                  .where(
                    and(
                      eq(authAccounts.userId, user.id),
                      eq(authAccounts.provider, "google")
                    )
                  );

                session.accessToken = tokens.access_token;
              } else {
                console.error("Token refresh failed:", await response.text());
                session.accessToken = account.access_token || undefined;

              }
            } catch (error) {
              console.error("Token refresh error:", error);
              session.accessToken = account.access_token || undefined;

            }
          } else if (account.access_token) {
            session.accessToken = account.access_token;

          } else {

          }
        }
      }



      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
    redirect: ({ url, baseUrl }) => {
      if (url.startsWith("/api/auth/signout")) {
        return baseUrl;
      }
      if (url.startsWith("/api/auth/signin")) {
        return `${baseUrl}/dashboard`;
      }
      return url;
    },
  },
  pages: {
    signIn: "/signin",
  },
} satisfies NextAuthConfig;
