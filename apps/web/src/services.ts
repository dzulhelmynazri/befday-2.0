import { createAuth } from "@befday-2.0/auth";
import { createPrismaClient } from "@befday-2.0/db";
import type { Database } from "@befday-2.0/db";
import { createEmail } from "@befday-2.0/email";
import { createFiles } from "@befday-2.0/storage";

import { env } from "./env.server";

const db = createPrismaClient(env);

export const getDb = (): Database => db;
export const auth = createAuth(env, db);
export const files = createFiles(env);
export const email = createEmail(env);
