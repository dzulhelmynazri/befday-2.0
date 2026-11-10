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

import {
  partnerApprovedWorkflow,
  partnerSubmittedWorkflow,
} from "@/workflows/partner-perks";

import {
  createTestDb,
  resetDatabase,
  stubWorkflowFetch,
} from "./workflow.test-helper";

let db: Database;
let fetchStub: ReturnType<typeof stubWorkflowFetch>;

const seedPartnerPerk = async (options?: {
  contactEmail?: string | null;
  contactName?: string | null;
  status?: "DRAFT" | "PUBLISHED";
}) => {
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

  return db.birthdayPerk.create({
    data: {
      badge: "FREE",
      brandId: brand.id,
      contactEmail:
        options?.contactEmail === undefined
          ? "partner@zuscoffee.com"
          : options.contactEmail,
      contactName:
        options?.contactName === undefined ? "Amir" : options.contactName,
      contactPhone: "+60123456789",
      headline: "Free 1x handcrafted drink",
      howToRedeem: ["Show IC at counter"],
      perksList: ["Free drink"],
      sourceUrls: [],
      status: options?.status ?? "DRAFT",
      validity: "Birthday month",
    },
  });
};

describe("partnerPerksWorkflows", () => {
  beforeAll(() => {
    db = createTestDb();
  });

  beforeEach(async () => {
    vi.clearAllMocks();
    await resetDatabase(db);
    fetchStub = stubWorkflowFetch();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  afterAll(async () => {
    await resetDatabase(db);
    await db.$disconnect();
  });

  it("sends Telegram alert and submission confirmation email in parallel", async () => {
    const perk = await seedPartnerPerk();

    const run = await start(partnerSubmittedWorkflow, [perk.id]);
    await run.returnValue;

    expect(fetchStub.telegramCalls).toStrictEqual([
      "https://api.telegram.org/bottg-token/sendMessage",
    ]);
    expect(fetchStub.sentEmails).toStrictEqual([
      {
        subject: "we received your submission for zus coffee on befday",
        to: ["partner@zuscoffee.com"],
      },
    ]);
  });

  it("retries failed confirmation email without re-sending Telegram alert", async () => {
    const perk = await seedPartnerPerk();
    fetchStub = stubWorkflowFetch({ shouldFailEmail: () => true });

    const run = await start(partnerSubmittedWorkflow, [perk.id]);
    await run.returnValue;

    expect(fetchStub.telegramCalls).toHaveLength(1);
    expect(fetchStub.sentEmails).toHaveLength(1);
    expect(fetchStub.mockFetch).toHaveBeenCalledTimes(3);
  });

  it("sends partner approved email when contact fields exist", async () => {
    const perk = await seedPartnerPerk({ status: "PUBLISHED" });

    const run = await start(partnerApprovedWorkflow, [perk.id]);
    await run.returnValue;

    expect(fetchStub.sentEmails).toStrictEqual([
      {
        subject: "your birthday perk for zus coffee is now live on befday",
        to: ["partner@zuscoffee.com"],
      },
    ]);
  });

  it("skips partner approved email when contact details are missing", async () => {
    const perk = await seedPartnerPerk({
      contactEmail: null,
      contactName: null,
      status: "PUBLISHED",
    });

    const run = await start(partnerApprovedWorkflow, [perk.id]);
    await run.returnValue;

    expect(fetchStub.sentEmails).toHaveLength(0);
  });
});
