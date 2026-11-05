import type { Database } from "@befday-2.0/db";
import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

export interface AuthConfig {
  BETTER_AUTH_URL: string;
  BETTER_AUTH_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
}

export const createAuth = (env: AuthConfig, database: Database) =>
  betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    database: prismaAdapter(database, {
      provider: "postgresql",
    }),
    plugins: [expo(), nextCookies()],
    secret: env.BETTER_AUTH_SECRET,
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
  });
