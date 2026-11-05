import { defineTool } from "eve/tools";
import { z } from "zod";

export default defineTool({
  description: "Get the current time in ISO format or a specific timezone",
  execute({ timeZone }) {
    const now = new Date();

    return {
      formatted: timeZone
        ? new Intl.DateTimeFormat("en-US", {
            dateStyle: "full",
            timeStyle: "long",
            timeZone,
          }).format(now)
        : now.toUTCString(),
      iso: now.toISOString(),
      timeZone: timeZone ?? "UTC",
    };
  },
  inputSchema: z.object({
    timeZone: z
      .string()
      .optional()
      .describe("Optional IANA time zone name (e.g. 'America/New_York')"),
  }),
});
