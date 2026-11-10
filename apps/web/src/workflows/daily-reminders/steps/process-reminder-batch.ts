import type { Prisma } from "@befday-2.0/db";
import { RetryableError, getStepMetadata } from "workflow";

import { log } from "@/lib/evlog";
import { email, getDb } from "@/services";
import type { DailyReminderKind } from "@/workflows/daily-reminders/campaigns";
import { CAMPAIGN_CONFIG } from "@/workflows/daily-reminders/campaigns";
import { FROM_ADDRESS, getRetryAfterMs } from "@/workflows/shared/send-email";

import type { ReminderWindow } from "./prepare-reminder-window";

const BATCH_SIZE = 50;
const EMAIL_CONCURRENCY = 5;

export const processReminderBatch = async (input: {
  readonly cursor: string | null;
  readonly kind: DailyReminderKind;
  readonly window: ReminderWindow;
}): Promise<{
  readonly nextCursor: string | null;
  readonly sentCount: number;
}> => {
  "use step";

  const db = getDb();
  const { attempt } = getStepMetadata();
  const campaign = CAMPAIGN_CONFIG[input.kind];
  const periodKey = campaign.getPeriodKey(input.window);
  const baseWhere = campaign.getWhere(input.window);

  const where: Prisma.UserWhereInput = {
    ...baseWhere,
    reminderDeliveries: {
      none: {
        kind: input.kind,
        periodKey,
      },
    },
  };

  if (input.cursor) {
    where.id = { gt: input.cursor };
  }

  const rows = await db.user.findMany({
    orderBy: { id: "asc" },
    select: { email: true, id: true, name: true },
    take: BATCH_SIZE + 1,
    where,
  });

  const hasMore = rows.length > BATCH_SIZE;
  const batch = hasMore ? rows.slice(0, BATCH_SIZE) : rows;
  const nextCursor = hasMore ? (batch.at(-1)?.id ?? null) : null;

  let sentCount = 0;

  const processOffset = async (offset: number): Promise<void> => {
    const chunk = batch.slice(offset, offset + EMAIL_CONCURRENCY);

    if (chunk.length === 0) {
      return;
    }

    const outcomes = await Promise.all(
      chunk.map(async (user) => {
        try {
          const { html, subject, text } = await campaign.renderEmail(
            user.name.toLowerCase(),
            input.window
          );

          await email.send({
            from: FROM_ADDRESS,
            html,
            subject,
            text,
            to: user.email,
          });

          return user.id;
        } catch (error) {
          log.error({
            error,
            event: "reminders.email_delivery_failed",
            kind: input.kind,
            periodKey,
            userId: user.id,
          });

          return null;
        }
      })
    );

    const succeededUserIds = outcomes.filter((id): id is string => id !== null);

    if (succeededUserIds.length > 0) {
      await db.reminderDelivery.createMany({
        data: succeededUserIds.map((userId) => ({
          kind: input.kind,
          periodKey,
          userId,
        })),
        skipDuplicates: true,
      });
      sentCount += succeededUserIds.length;
    }

    if (succeededUserIds.length < chunk.length) {
      throw new RetryableError("Failed to deliver reminder email batch", {
        retryAfter: getRetryAfterMs(attempt),
      });
    }

    await processOffset(offset + EMAIL_CONCURRENCY);
  };

  await processOffset(0);

  return { nextCursor, sentCount };
};

processReminderBatch.maxRetries = 5;
