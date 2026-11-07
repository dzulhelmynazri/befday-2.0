import { createAuth } from "@befday-2.0/auth";
import { createPrismaClient } from "@befday-2.0/db";
import type { Database } from "@befday-2.0/db";
import { createEmail, renderWelcomeEmail } from "@befday-2.0/email";
import { createFiles } from "@befday-2.0/storage";

import { env } from "./env.server";

const db = createPrismaClient({
  DATABASE_URL: env.DATABASE_URL,
});

export const getDb = (): Database => db;

export const email = createEmail(env);

export const auth = createAuth(env, db, {
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const { html, text } = await renderWelcomeEmail({
            name: user.name.toLowerCase(),
            perksUrl: "https://www.befday.com",
          });

          await email.send({
            from: "befday <hello@befday.com>",
            html,
            subject: "welcome to befday — your birthday perks are waiting",
            text,
            to: user.email,
          });
        },
      },
    },
  },
});

export const files = createFiles(env);
