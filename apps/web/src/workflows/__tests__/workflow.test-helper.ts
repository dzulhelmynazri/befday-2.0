import { createPrismaClient } from "@befday-2.0/db";
import type { Database } from "@befday-2.0/db";
import { vi } from "vitest";
import { z } from "zod";

import { env } from "@/env.server";

const EmailRequestSchema = z.object({
  subject: z.string(),
  to: z.array(z.string()),
});

export type EmailRequest = z.infer<typeof EmailRequestSchema>;

export interface StubFetchOptions {
  shouldFailEmail?: (body: EmailRequest) => boolean;
}

export const createTestDb = () =>
  createPrismaClient({
    DATABASE_URL: env.DATABASE_URL,
  });

export const resetDatabase = async (db: Database) => {
  await Promise.all([db.brand.deleteMany(), db.user.deleteMany()]);
};

export const stubWorkflowFetch = (options?: StubFetchOptions) => {
  const sentEmails: EmailRequest[] = [];
  const telegramCalls: string[] = [];
  let hasFailedEmail = false;

  const mockFetch = vi.fn<
    (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
  >((input, init) => {
    const url = input instanceof Request ? input.url : String(input);

    if (url.startsWith("https://api.telegram.org/")) {
      telegramCalls.push(url);

      return Promise.resolve(Response.json({ ok: true }));
    }

    if (url.startsWith("https://api.cloudflare.com/")) {
      const body = EmailRequestSchema.parse(
        JSON.parse(z.string().parse(init?.body))
      );

      if (!hasFailedEmail && options?.shouldFailEmail?.(body)) {
        hasFailedEmail = true;

        return Promise.resolve(
          new Response("transient failure", { status: 503 })
        );
      }

      sentEmails.push(body);

      return Promise.resolve(
        Response.json({
          result: { delivered: body.to, permanent_bounces: [], queued: [] },
          success: true,
        })
      );
    }

    return Promise.reject(new Error(`Unexpected fetch URL: ${url}`));
  });

  vi.stubGlobal("fetch", mockFetch);

  return { mockFetch, sentEmails, telegramCalls };
};
