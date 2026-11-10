import type { DailyReminderKind } from "./campaigns";
import type { ReminderWindow } from "./steps/prepare-reminder-window";
import { prepareReminderWindow } from "./steps/prepare-reminder-window";
import { processReminderBatch } from "./steps/process-reminder-batch";

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
