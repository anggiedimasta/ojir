import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { eq, and } from "drizzle-orm";
import { env } from "~/env";

import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";

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
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.scope = account.scope;
      }
      return token;
    },
    async session({ session, user, token }) {
      if (user?.id) {
        const account = await db.query.accounts.findFirst({
          where: (accounts, { eq, and }) =>
            and(
              eq(accounts.userId, user.id),
              eq(accounts.provider, "google")
            )
        });

        if (account) {
          const isExpired = account.expires_at ? Date.now() >= (account.expires_at * 1000 - 5 * 60 * 1000) : true;
          const hasCalendarScope = account.scope?.includes("https://www.googleapis.com/auth/calendar");

          if ((isExpired || !hasCalendarScope) && account.refresh_token) {
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
                    "https://www.googleapis.com/auth/calendar"
                  ].join(" ")
                }),
              });

              if (response.ok) {
                const tokens = await response.json();

                await db
                  .update(accounts)
                  .set({
                    access_token: tokens.access_token,
                    refresh_token: tokens.refresh_token || account.refresh_token,
                    expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
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
                session.accessToken = account.access_token || undefined;
              }
            } catch {
              session.accessToken = account.access_token || undefined;
            }
          } else {
            session.accessToken = token?.accessToken as string || account.access_token || undefined;
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
