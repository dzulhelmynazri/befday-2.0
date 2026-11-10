import { createPrismaClient } from "@befday-2.0/db";
import { createEmail } from "@befday-2.0/email";
import { createFiles } from "@befday-2.0/storage";

import { env } from "./env.server";

const db = createPrismaClient({
  DATABASE_URL: env.DATABASE_URL,
});

export const getDb = () => db;

export const email = createEmail(env);

export const files = createFiles(env);
