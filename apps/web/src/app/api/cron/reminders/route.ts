import { NextResponse } from "next/server";
import { start } from "workflow/api";

import { env } from "@/env.server";
import { useLogger as getLogger, withEvlog } from "@/lib/evlog";
import { dailyRemindersWorkflow } from "@/workflows/daily-reminders";

const handleCron = async (request: Request) => {
  const authHeader = request.headers.get("authorization");

  if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const referenceIso = new Date().toISOString();

  getLogger().set({
    workflow: {
      name: "dailyRemindersWorkflow",
      referenceIso,
    },
  });

  try {
    const run = await start(dailyRemindersWorkflow, [referenceIso]);

    getLogger().set({
      workflow: {
        runId: run.runId,
      },
    });

    return NextResponse.json(
      {
        accepted: true,
        referenceIso,
        runId: run.runId,
      },
      { status: 202 }
    );
  } catch {
    getLogger().set({
      workflow: {
        error: "Failed to start reminders workflow",
      },
    });

    return NextResponse.json(
      { error: "Failed to start reminders workflow" },
      { status: 500 }
    );
  }
};

export const GET = withEvlog(handleCron);
export const POST = withEvlog(handleCron);
