import { createAuth } from "@befday-2.0/auth";
import { createPrismaClient } from "@befday-2.0/db";
import { createEmail } from "@befday-2.0/email";
import { createFiles } from "@befday-2.0/storage";
import { start } from "workflow/api";

import { log } from "@/lib/evlog";
import { userOnboardingWorkflow } from "@/workflows/user-onboarding";

import { env } from "./env.server";

const db = createPrismaClient({
  DATABASE_URL: env.DATABASE_URL,
});

export const getDb = () => db;

export const email = createEmail(env);

export const auth = createAuth(env, db, {
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await start(userOnboardingWorkflow, [
              { email: user.email, id: user.id, name: user.name },
            ]);
          } catch (error) {
            log.error({
              error,
              event: "auth.user_onboarding_start_failed",
              userId: user.id,
            });
          }
        },
      },
    },
  },
});

export const files = createFiles(env);
