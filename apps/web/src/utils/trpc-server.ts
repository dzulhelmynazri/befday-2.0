import { appRouter } from "@befday-2.0/api/routers/index";
import { headers } from "next/headers";
import { cache } from "react";

import { createContext } from "@/context";
import { env } from "@/env.server";
import { auth, getDb } from "@/services";

/**
 * Public in-memory tRPC caller for cached scopes ("use cache") and static generation.
 * Does not read request headers or cookies.
 */
export const getPublicApi = () =>
  appRouter.createCaller({
    auth,
    db: getDb(),
    env,
    session: null,
  });

/**
 * In-memory tRPC caller for Server Components (no HTTP roundtrip).
 * Reads request headers for authenticated session.
 * Memoized per request via React `cache`.
 */
export const getServerApi = cache(async () =>
  appRouter.createCaller(await createContext(await headers()))
);
