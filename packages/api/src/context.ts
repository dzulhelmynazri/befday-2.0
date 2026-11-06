import type { createAuth } from "@befday-2.0/auth";
import type { Database } from "@befday-2.0/db";

export type Auth = ReturnType<typeof createAuth>;

export interface Context {
  auth: Auth;
  db: Database;
  session: Awaited<ReturnType<Auth["api"]["getSession"]>>;
}
