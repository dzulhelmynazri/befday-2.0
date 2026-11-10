import { getDb } from "@/services";
import {
  addLocalDays,
  getLocalDateParts,
  getLocalMonthName,
} from "@/utils/date";

const FEATURED_PERKS_LIMIT = 3;

export interface ReminderWindow {
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

export const prepareReminderWindow = async (
  referenceIso: string
): Promise<ReminderWindow> => {
  "use step";

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
