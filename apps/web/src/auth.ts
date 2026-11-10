import { createAuth } from "@befday-2.0/auth";
import { start } from "workflow/api";

import { env } from "@/env.server";
import { log } from "@/lib/evlog";
import { getDb } from "@/services";
import { userOnboardingWorkflow } from "@/workflows/user-onboarding";

export const auth = createAuth(env, getDb(), {
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
