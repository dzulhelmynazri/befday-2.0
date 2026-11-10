import type { Database } from "@befday-2.0/db";
import { waitForSleep } from "@workflow/vitest";
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

import { userOnboardingWorkflow } from "@/workflows/user-onboarding";

import {
  createTestDb,
  resetDatabase,
  stubWorkflowFetch,
} from "./workflow.test-helper";

const TEST_USER = {
  email: "ada@example.com",
  id: "user_onboarding_1",
  name: "Ada Lovelace",
};

let db: Database;
let fetchStub: ReturnType<typeof stubWorkflowFetch>;

const seedUser = (dateOfBirth: Date | null = null) =>
  db.user.create({
    data: {
      birthDay: dateOfBirth ? dateOfBirth.getUTCDate() : null,
      birthMonth: dateOfBirth ? dateOfBirth.getUTCMonth() + 1 : null,
      dateOfBirth,
      email: TEST_USER.email,
      id: TEST_USER.id,
      name: TEST_USER.name,
    },
  });

describe(userOnboardingWorkflow, () => {
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

  it("sends welcome and birthday prompt when dateOfBirth is null", async () => {
    await seedUser();

    const run = await start(userOnboardingWorkflow, [TEST_USER]);
    const sleepId = await waitForSleep(run);
    await run.wakeUp({ correlationIds: [sleepId] });

    const result = await run.returnValue;
    expect(result).toStrictEqual({ status: "prompted" });
    expect(fetchStub.sentEmails).toHaveLength(2);
  });

  it("skips birthday prompt when user already set dateOfBirth", async () => {
    await seedUser(new Date("1995-05-12T00:00:00Z"));

    const run = await start(userOnboardingWorkflow, [TEST_USER]);
    const sleepId = await waitForSleep(run);
    await run.wakeUp({ correlationIds: [sleepId] });

    const result = await run.returnValue;
    expect(result).toStrictEqual({ status: "completed" });
    expect(fetchStub.sentEmails).toHaveLength(1);
  });

  it("returns skipped when user is deleted before sleep finishes", async () => {
    await seedUser();

    const run = await start(userOnboardingWorkflow, [TEST_USER]);
    const sleepId = await waitForSleep(run);
    await db.user.delete({ where: { id: TEST_USER.id } });
    await run.wakeUp({ correlationIds: [sleepId] });

    const result = await run.returnValue;
    expect(result).toStrictEqual({ status: "skipped" });
    expect(fetchStub.sentEmails).toHaveLength(1);
  });

  it("retries transient welcome email failure and completes flow", async () => {
    await seedUser();
    fetchStub = stubWorkflowFetch({ shouldFailEmail: () => true });

    const run = await start(userOnboardingWorkflow, [TEST_USER]);
    const sleepId = await waitForSleep(run);
    await run.wakeUp({ correlationIds: [sleepId] });

    const result = await run.returnValue;
    expect(result).toStrictEqual({ status: "prompted" });
    expect(fetchStub.mockFetch).toHaveBeenCalledTimes(3);
    expect(fetchStub.sentEmails).toHaveLength(2);
  });
});
