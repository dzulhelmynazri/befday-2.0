import { createAuthMiddleware } from "evlog/better-auth";

import { auth } from "@/auth";
import { useLogger as getLogger } from "@/lib/evlog";

const identifyUser = createAuthMiddleware(auth, {
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
