import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { and, eq } from "drizzle-orm";

import { env } from "~/env";
import { db } from "~/server/db";
import { accounts, sessions, users, verificationTokens } from "~/server/db/schema";

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
 * Custom DrizzleAdapter configuration that maps camelCase TypeScript to snake_case database
 */
const customDrizzleAdapter = DrizzleAdapter(db, {
  usersTable: users,
  accountsTable: accounts,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
});

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  debug: env.NODE_ENV === "development",
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
            "https://www.googleapis.com/auth/calendar"
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
          await db
            .update(accounts)
            .set({
              accessToken: account.access_token,
              refreshToken: account.refresh_token,
              expiresAt: account.expires_at,
              scope: account.scope,
              tokenType: account.token_type,
            })
            .where(
              and(
                eq(accounts.provider, account.provider),
                eq(accounts.providerAccountId, account.providerAccountId)
              )
            );
        } catch (error) {
          console.error("Failed to update account tokens:", error);
        }
      }
      return true;
    },
    jwt: async ({ token, account, user }) => {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.scope = account.scope;
        token.provider = account.provider;
      }
      return token;
    },
    session: async ({ session, user, token }) => {
      if (user?.id) {
        // First try to use token data from JWT callback
        if (token?.accessToken) {
          session.accessToken = token.accessToken as string;
        } else {
          // Fallback to querying database for account info
          const account = await db.query.accounts.findFirst({
            where: (accounts, { eq, and }) =>
              and(
                eq(accounts.userId, user.id),
                eq(accounts.provider, "google")
              )
          });

          if (account) {
            const isExpired = account.expiresAt ? Date.now() >= (account.expiresAt * 1000 - 5 * 60 * 1000) : true;
            const hasCalendarScope = account.scope?.includes("https://www.googleapis.com/auth/calendar");

            if ((isExpired || !hasCalendarScope) && account.refreshToken) {
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
                    refresh_token: account.refreshToken,
                    scope: [
                      "openid",
                      "email",
                      "profile",
                      "https://www.googleapis.com/auth/calendar"
                    ].join(" ")
                  }),
                });

                if (response.ok) {
                  const tokens = await response.json();

                  await db
                    .update(accounts)
                    .set({
                      accessToken: tokens.access_token,
                      refreshToken: tokens.refresh_token || account.refreshToken,
                      expiresAt: Math.floor(Date.now() / 1000 + tokens.expires_in),
                      scope: tokens.scope || account.scope
                    })
                    .where(
                      and(
                        eq(accounts.userId, user.id),
                        eq(accounts.provider, "google")
                      )
                    );

                  session.accessToken = tokens.access_token;
                } else {
                  console.error("Token refresh failed:", await response.text());
                  session.accessToken = account.accessToken || undefined;
                }
              } catch (error) {
                console.error("Token refresh error:", error);
                session.accessToken = account.accessToken || undefined;
              }
            } else {
              session.accessToken = account.accessToken || undefined;
            }
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
