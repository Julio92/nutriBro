import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { isAuthenticationConfigured } from "@/server/auth/auth-configuration";
import { getDatabase } from "@/server/infrastructure/database/client";
import {
  authAccounts,
  authSessions,
  authVerificationTokens,
  users,
} from "@/server/infrastructure/database/schema";
import { localAccountService } from "@/server/services/local-account-service-instance";

function createAuthConfig(): NextAuthConfig {
  if (!isAuthenticationConfigured()) {
    return {
      providers: [],
      pages: {
        signIn: "/sign-in",
      },
    };
  }

  return {
    adapter: DrizzleAdapter(getDatabase(), {
      usersTable: users,
      accountsTable: authAccounts,
      sessionsTable: authSessions,
      verificationTokensTable: authVerificationTokens,
    }),
    providers: [
      Credentials({
        name: "Correo y contraseña",
        credentials: {
          email: {
            label: "Correo electrónico",
            type: "email",
            placeholder: "tu@correo.com",
          },
          password: {
            label: "Contraseña",
            type: "password",
          },
        },
        async authorize(credentials) {
          const account = await localAccountService.authenticate({
            email: credentials?.email,
            password: credentials?.password,
          });

          if (!account) {
            return null;
          }

          return {
            id: account.id,
            name: account.displayName,
            email: account.email,
          };
        },
      }),
    ],
    pages: {
      signIn: "/sign-in",
    },
    session: {
      strategy: "jwt",
    },
    trustHost: true,
    callbacks: {
      session({ session, token }) {
        if (typeof token.sub === "string") {
          session.user.id = token.sub;
        }

        return session;
      },
    },
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth(createAuthConfig);
