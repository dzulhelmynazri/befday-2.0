import type { Database } from "@befday-2.0/db";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { start } from "workflow/api";

import { dailyRemindersWorkflow } from "@/workflows/daily-reminders";

import {
  createTestDb,
  resetDatabase,
  stubWorkflowFetch,
} from "./workflow.test-helper";

let db: Database;
let fetchStub: ReturnType<typeof stubWorkflowFetch>;

const seedPublishedPerk = async () => {
  const brand = await db.brand.create({
    data: {
      description: "Malaysian specialty coffee chain",
      googleMapUrl: "https://maps.google.com/?q=Zus",
      logoUrl: "https://cdn.befday.com/zus.png",
      name: "Zus Coffee",
      slug: "zus-coffee",
      websiteUrl: "https://zuscoffee.com",
    },
  });

  await db.birthdayPerk.create({
    data: {
      badge: "FREE",
      brandId: brand.id,
      headline: "Free 1x Drink",
      howToRedeem: ["Show IC"],
      perksList: ["Free drink"],
      sourceUrls: [],
      status: "PUBLISHED",
      validity: "Birthday month",
    },
  });
};

describe(dailyRemindersWorkflow, () => {
  beforeAll(() => {
    db = createTestDb();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    await resetDatabase(db);
    await seedPublishedPerk();
    fetchStub = stubWorkflowFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  afterAll(async () => {
    await resetDatabase(db);
    await db.$disconnect();
  });

  it("runs today and 7-day campaigns without kickoff on mid-month dates", async () => {
    await db.user.createMany({
      data: [
        {
          birthDay: 10,
          birthMonth: 5,
          email: "today@example.com",
          id: "user_01",
          name: "Today User",
        },
        {
          birthDay: 17,
          birthMonth: 5,
          email: "soon@example.com",
          id: "user_02",
          name: "Soon User",
        },
        {
          birthDay: 25,
          birthMonth: 5,
          email: "later@example.com",
          id: "user_03",
          name: "Later User",
        },
      ],
    });

    const run = await start(dailyRemindersWorkflow, [
      "2026-05-10T01:00:00.000Z",
    ]);

    const result = await run.returnValue;

    expect(result).toStrictEqual({
      date: { day: 10, month: 5 },
      totalSent: 2,
    });
    expect(fetchStub.sentEmails).toHaveLength(2);

    const deliveries = await db.reminderDelivery.findMany({
      orderBy: { userId: "asc" },
      select: { kind: true, periodKey: true, userId: true },
    });

    expect(deliveries).toStrictEqual([
      {
        kind: "BIRTHDAY_TODAY",
        periodKey: "2026-05-10",
        userId: "user_01",
      },
      {
        kind: "BIRTHDAY_UPCOMING_7D",
        periodKey: "2026-05-10",
        userId: "user_02",
      },
    ]);
  });

  it("runs birth-month kickoff on the 1st and avoids duplicate sends on batch retry", async () => {
    await db.user.createMany({
      data: [
        {
          birthDay: 1,
          birthMonth: 5,
          email: "u1@example.com",
          id: "user_01",
          name: "First",
        },
        {
          birthDay: 1,
          birthMonth: 5,
          email: "u2@example.com",
          id: "user_02",
          name: "Second",
        },
        {
          birthDay: 20,
          birthMonth: 5,
          email: "u3@example.com",
          id: "user_03",
          name: "Third",
        },
      ],
    });

    fetchStub = stubWorkflowFetch({
      shouldFailEmail: (body) => body.to.includes("u2@example.com"),
    });

    const run = await start(dailyRemindersWorkflow, [
      "2026-05-01T01:00:00.000Z",
    ]);

    const result = await run.returnValue;

    expect(result).toStrictEqual({
      date: { day: 1, month: 5 },
      totalSent: 4,
    });

    const u1Calls = fetchStub.sentEmails.filter((email) =>
      email.to.includes("u1@example.com")
    );

    expect(u1Calls).toHaveLength(2);
    await expect(db.reminderDelivery.count()).resolves.toBe(5);

    const rerun = await start(dailyRemindersWorkflow, [
      "2026-05-01T01:00:00.000Z",
    ]);

    await expect(rerun.returnValue).resolves.toStrictEqual({
      date: { day: 1, month: 5 },
      totalSent: 0,
    });
  });

  it("paginates batches larger than 50 users via cursor", async () => {
    const batchUsers = [];

    for (let index = 1; index <= 52; index += 1) {
      const id = `user_${String(index).padStart(3, "0")}`;
      batchUsers.push({
        birthDay: 10,
        birthMonth: 5,
        email: `${id}@example.com`,
        id,
        name: `User ${index}`,
      });
    }

    await db.user.createMany({ data: batchUsers });

    const run = await start(dailyRemindersWorkflow, [
      "2026-05-10T01:00:00.000Z",
    ]);

    const result = await run.returnValue;

    expect(result).toStrictEqual({
      date: { day: 10, month: 5 },
      totalSent: 52,
    });
    expect(fetchStub.sentEmails).toHaveLength(52);
    await expect(db.reminderDelivery.count()).resolves.toBe(52);
  });
});
