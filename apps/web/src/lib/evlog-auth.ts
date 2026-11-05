import { createAuthMiddleware } from "evlog/better-auth";
import type { BetterAuthInstance } from "evlog/better-auth";

import { useLogger as getLogger } from "@/lib/evlog";
import { auth } from "@/services";

// SAFETY: auth instance conforms to BetterAuthInstance required by evlog
const identifyUser = createAuthMiddleware(auth as BetterAuthInstance, {
  exclude: ["/api/auth/**"],
  maskEmail: true,
});

export const identifyEvlogUser = async (request: Request) => {
  await identifyUser(
    getLogger(),
    request.headers,
    new URL(request.url).pathname
  );
};
