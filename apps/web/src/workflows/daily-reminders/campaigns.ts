import type { Prisma, ReminderKind } from "@befday-2.0/db";
import {
  renderBirthMonthKickoffEmail,
  renderBirthdayReminderEmail,
} from "@befday-2.0/email";

import type { ReminderWindow } from "./steps/prepare-reminder-window";

const PERKS_URL = "https://www.befday.com";

export type DailyReminderKind = Exclude<ReminderKind, "ADD_BIRTHDAY_PROMPT">;

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

export const CAMPAIGN_CONFIG = {
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

