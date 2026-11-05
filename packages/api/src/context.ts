import type { createAuth } from "@befday-2.0/auth";
import type { Database } from "@befday-2.0/db";

export interface Context {
  auth: null;
  session: Awaited<
    ReturnType<ReturnType<typeof createAuth>["api"]["getSession"]>
  >;
  db: Database;
}
