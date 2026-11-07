import type { createAuth } from "@befday-2.0/auth";
import type { Database } from "@befday-2.0/db";
import type { EmailClient } from "@befday-2.0/email";

export type Auth = ReturnType<typeof createAuth>;

export interface ApiEnv {
  NEXT_PUBLIC_SITE_URL: string;
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

export interface Context {
  auth: Auth;
  db: Database;
  email: EmailClient;
  env: ApiEnv;
  session: Awaited<ReturnType<Auth["api"]["getSession"]>>;
}
