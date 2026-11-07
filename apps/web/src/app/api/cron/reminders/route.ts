import {
  renderAddBirthdayPromptEmail,
  renderBirthMonthKickoffEmail,
  renderBirthdayReminderEmail,
} from "@befday-2.0/email";
import { NextResponse } from "next/server";

import { env } from "@/env.server";
import { email, getDb } from "@/services";
import {
  addLocalDays,
  getLocalDateParts,
  getLocalMonthName,
} from "@/utils/date";

export const dynamic = "force-dynamic";

const handleCron = async (request: Request) => {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const now = new Date();

  const { day: todayDay, month: todayMonth } = getLocalDateParts(now);
  const { day: day7, month: month7 } = getLocalDateParts(addLocalDays(now, 7));

  // Top active perks for reminder emails
  const topPerks = await db.birthdayPerk.findMany({
    include: { brand: true },
    orderBy: { verifiedAt: "desc" },
    take: 3,
    where: { status: "PUBLISHED" },
  });

  const featuredPerks = topPerks.map(
    (perk) =>
      `${perk.brand.name.toLowerCase()} — ${perk.headline.toLowerCase()}`
  );

  // 1. Birthday Today (daysRemaining = 0)
  const todayUsers = await db.user.findMany({
    select: { email: true, name: true },
    where: {
      birthDay: todayDay,
      birthMonth: todayMonth,
    },
  });

  await Promise.all(
    todayUsers.map(async (user) => {
      const { html, text } = await renderBirthdayReminderEmail({
        daysRemaining: 0,
        featuredPerks,
        name: user.name.toLowerCase(),
        perksUrl: "https://www.befday.com",
      });

      await email.send({
        from: "befday <hello@befday.com>",
        html,
        subject: "happy birthday from befday! 🎂 your perks are ready",
        text,
        to: user.email,
      });
    })
  );

  // 2. Upcoming Birthday in 7 Days (daysRemaining = 7)
  const upcomingUsers = await db.user.findMany({
    select: { email: true, name: true },
    where: {
      birthDay: day7,
      birthMonth: month7,
    },
  });

  await Promise.all(
    upcomingUsers.map(async (user) => {
      const { html, text } = await renderBirthdayReminderEmail({
        daysRemaining: 7,
        featuredPerks,
        name: user.name.toLowerCase(),
        perksUrl: "https://www.befday.com",
      });

      await email.send({
        from: "befday <hello@befday.com>",
        html,
        subject: "your birthday is in 7 days — get your perks ready",
        text,
        to: user.email,
      });
    })
  );

  // 3. Birth Month Kickoff (on the 1st of each month)
  let kickoffSent = 0;

  if (todayDay === 1) {
    const monthName = getLocalMonthName(now);

    const monthUsers = await db.user.findMany({
      select: { email: true, name: true },
      where: {
        birthMonth: todayMonth,
      },
    });

    await Promise.all(
      monthUsers.map(async (user) => {
        const { html, text } = await renderBirthMonthKickoffEmail({
          featuredPerks,
          monthName,
          name: user.name.toLowerCase(),
          perksUrl: "https://www.befday.com",
        });

        await email.send({
          from: "befday <hello@befday.com>",
          html,
          subject: `happy birth month! 🎂 your ${monthName} perks guide`,
          text,
          to: user.email,
        });
      })
    );

    kickoffSent = monthUsers.length;
  }

  // 4. Prompt users without dateOfBirth (created 3 to 4 days ago)
  const threeDaysAgo = addLocalDays(now, -3);
  const fourDaysAgo = addLocalDays(now, -4);

  const missingDobUsers = await db.user.findMany({
    select: { email: true, name: true },
    where: {
      createdAt: {
        gte: fourDaysAgo,
        lte: threeDaysAgo,
      },
      dateOfBirth: null,
    },
  });

  await Promise.all(
    missingDobUsers.map(async (user) => {
      const { html, text } = await renderAddBirthdayPromptEmail({
        name: user.name.toLowerCase(),
        profileUrl: "https://www.befday.com/onboarding",
      });

      await email.send({
        from: "befday <hello@befday.com>",
        html,
        subject: "one quick step — add your birthday on befday",
        text,
        to: user.email,
      });
    })
  );

  return NextResponse.json({
    date: { day: todayDay, month: todayMonth },
    kickoffSent,
    promptSent: missingDobUsers.length,
    success: true,
    todaySent: todayUsers.length,
    upcomingSent: upcomingUsers.length,
  });
};

export const GET = handleCron;
export const POST = handleCron;
