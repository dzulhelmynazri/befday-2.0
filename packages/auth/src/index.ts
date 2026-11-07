import type { Database } from "@befday-2.0/db";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import type { BetterAuthOptions } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

export interface AuthConfig {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export interface CreateAuthOptions {
  databaseHooks?: BetterAuthOptions["databaseHooks"];
}

export const createAuth = (
  env: AuthConfig,
  database: Database,
  options: CreateAuthOptions
) =>
  betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    database: prismaAdapter(database, {
      provider: "postgresql",
    }),
    databaseHooks: options.databaseHooks,
    plugins: [expo(), nextCookies()],
    secret: env.BETTER_AUTH_SECRET,
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60,
      },
    },
    socialProviders: {
      google: {
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    trustedOrigins: [
      env.BETTER_AUTH_URL,
      "befday-2.0://",
      "exp://",
      "http://localhost:8081",
    ],
    user: {
      additionalFields: {
        birthDay: {
          required: false,
          type: "number",
        },
        birthMonth: {
          required: false,
          type: "number",
        },
        dateOfBirth: {
          required: false,
          type: "date",
        },
      },
    },
  });
