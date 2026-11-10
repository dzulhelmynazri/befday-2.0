import type { Prisma, ReminderKind } from "@befday-2.0/db";
import {
  renderBirthMonthKickoffEmail,
  renderBirthdayReminderEmail,
} from "@befday-2.0/email";
import { RetryableError, getStepMetadata } from "workflow";

import { FROM_ADDRESS, getRetryAfterMs } from "@/lib/workflows";
import {
  addLocalDays,
  getLocalDateParts,
  getLocalMonthName,
} from "@/utils/date";

const BATCH_SIZE = 50;
const EMAIL_CONCURRENCY = 5;
const FEATURED_PERKS_LIMIT = 3;
const PERKS_URL = "https://www.befday.com";

type DailyReminderKind = Exclude<ReminderKind, "ADD_BIRTHDAY_PROMPT">;

interface ReminderWindow {
  readonly dailyPeriodKey: string;
  readonly day7: number;
  readonly featuredPerks: string[];
  readonly isFirstOfMonth: boolean;
  readonly month7: number;
  readonly monthName: string;
  readonly monthlyPeriodKey: string;
  readonly todayDay: number;
  readonly todayMonth: number;
}

interface CampaignConfig {
  readonly getPeriodKey: (window: ReminderWindow) => string;
  readonly getWhere: (window: ReminderWindow) => Prisma.UserWhereInput;
  readonly renderEmail: (
    name: string,
    window: ReminderWindow
  ) => Promise<{
    readonly html: string;
    readonly subject: string;
    readonly text: string;
  }>;
}

const CAMPAIGN_CONFIG = {
  BIRTHDAY_TODAY: {
    getPeriodKey: (window) => window.dailyPeriodKey,
    getWhere: (window) => ({
      birthDay: window.todayDay,
      birthMonth: window.todayMonth,
    }),
    renderEmail: async (name, window) => {
      const rendered = await renderBirthdayReminderEmail({
        daysRemaining: 0,
        featuredPerks: window.featuredPerks,
        name,
        perksUrl: PERKS_URL,
      });

      return {
        ...rendered,
        subject: "happy birthday from befday! 🎂 your perks are ready",
      };
    },
  },
  BIRTHDAY_UPCOMING_7D: {
    getPeriodKey: (window) => window.dailyPeriodKey,
    getWhere: (window) => ({
      birthDay: window.day7,
      birthMonth: window.month7,
    }),
    renderEmail: async (name, window) => {
      const rendered = await renderBirthdayReminderEmail({
        daysRemaining: 7,
        featuredPerks: window.featuredPerks,
        name,
        perksUrl: PERKS_URL,
      });

      return {
        ...rendered,
        subject: "your birthday is in 7 days — get your perks ready",
      };
    },
  },
  BIRTH_MONTH_KICKOFF: {
    getPeriodKey: (window) => window.monthlyPeriodKey,
    getWhere: (window) => ({
      birthMonth: window.todayMonth,
    }),
    renderEmail: async (name, window) => {
      const rendered = await renderBirthMonthKickoffEmail({
        featuredPerks: window.featuredPerks,
        monthName: window.monthName,
        name,
        perksUrl: PERKS_URL,
      });

      return {
        ...rendered,
        subject: `happy birth month! 🎂 your ${window.monthName} perks guide`,
      };
    },
  },
} satisfies Record<DailyReminderKind, CampaignConfig>;

const prepareReminderWindow = async (
  referenceIso: string
): Promise<ReminderWindow> => {
  "use step";

  const { getDb } = await import("@/services");
  const db = getDb();
  const now = new Date(referenceIso);

  const {
    day: todayDay,
    month: todayMonth,
    year: todayYear,
  } = getLocalDateParts(now);

  const { day: day7, month: month7 } = getLocalDateParts(addLocalDays(now, 7));

  const topPerks = await db.birthdayPerk.findMany({
    include: { brand: true },
    orderBy: { verifiedAt: "desc" },
    take: FEATURED_PERKS_LIMIT,
    where: { status: "PUBLISHED" },
  });

  const featuredPerks = topPerks.map(
    (perk) =>
      `${perk.brand.name.toLowerCase()} — ${perk.headline.toLowerCase()}`
  );

  const monthlyPeriodKey = `${todayYear}-${String(todayMonth).padStart(2, "0")}`;

  return {
    dailyPeriodKey: `${monthlyPeriodKey}-${String(todayDay).padStart(2, "0")}`,
    day7,
    featuredPerks,
    isFirstOfMonth: todayDay === 1,
    month7,
    monthName: getLocalMonthName(now),
    monthlyPeriodKey,
    todayDay,
    todayMonth,
  };
};

prepareReminderWindow.maxRetries = 3;

const processReminderBatch = async (input: {
  readonly cursor: string | null;
  readonly kind: DailyReminderKind;
  readonly window: ReminderWindow;
}): Promise<{
  readonly nextCursor: string | null;
  readonly sentCount: number;
}> => {
  "use step";

  const [{ email, getDb }, { log }] = await Promise.all([
    import("@/services"),
    import("@/lib/evlog"),
  ]);

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

const runCampaign = async (
  kind: DailyReminderKind,
  window: ReminderWindow,
  cursor: string | null = null,
  sentCount = 0
): Promise<number> => {
  const batch = await processReminderBatch({ cursor, kind, window });
  const totalSent = sentCount + batch.sentCount;

  if (batch.nextCursor === null) {
    return totalSent;
  }

  return runCampaign(kind, window, batch.nextCursor, totalSent);
};

/** Started daily from /api/cron/reminders. */
export const dailyRemindersWorkflow = async (
  referenceIso: string
): Promise<{
  readonly date: { readonly day: number; readonly month: number };
  readonly totalSent: number;
}> => {
  "use workflow";

  const window = await prepareReminderWindow(referenceIso);

  const activeKinds: DailyReminderKind[] = [
    "BIRTHDAY_TODAY",
    "BIRTHDAY_UPCOMING_7D",
  ];

  if (window.isFirstOfMonth) {
    activeKinds.push("BIRTH_MONTH_KICKOFF");
  }

  const counts = await Promise.all(
    activeKinds.map((kind) => runCampaign(kind, window))
  );

  return {
    date: { day: window.todayDay, month: window.todayMonth },
    totalSent: counts.reduce((sum, count) => sum + count, 0),
  };
};
