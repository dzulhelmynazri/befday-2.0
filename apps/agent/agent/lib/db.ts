import { createPrismaClient } from "@befday-2.0/db";

export const db = createPrismaClient({
  // oxlint-disable-next-line typescript/no-non-null-assertion
  DATABASE_URL: process.env.DATABASE_URL!,
});
