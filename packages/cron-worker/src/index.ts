export interface Env {
  CRON_SECRET: string;
  NEXT_PUBLIC_SITE_URL: string;
}

export interface ScheduledEvent {
  cron: string;
  scheduledTime: number;
}

export interface ExecutionContext {
  waitUntil: (promise: Promise<unknown>) => void;
}

export default {
  async scheduled(
    _event: ScheduledEvent,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<void> {
    const response = await fetch(
      `${env.NEXT_PUBLIC_SITE_URL}/api/cron/reminders`,
      {
        headers: {
          Authorization: `Bearer ${env.CRON_SECRET}`,
        },
        method: "POST",
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Cron execution failed [${response.status}]: ${errorText}`);
    }
  },
};
