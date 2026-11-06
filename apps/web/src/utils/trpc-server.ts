import { appRouter } from "@befday-2.0/api/routers/index";
import { headers } from "next/headers";
import { cache } from "react";

import { createContext } from "@/context";

/**
 * In-memory tRPC caller for Server Components (no HTTP roundtrip).
 * Memoized per request via React `cache`.
 */
export const getServerApi = cache(async () =>
  appRouter.createCaller(await createContext(await headers()))
);
