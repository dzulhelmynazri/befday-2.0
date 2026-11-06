// oxlint-disable typescript/no-non-null-assertion
import { scheduleSocialPostSchema } from "@befday-2.0/contracts";
import { defineTool } from "eve/tools";

export default defineTool({
  description:
    "Schedules or publishes social media posts across channels (Twitter/X, Instagram, LinkedIn, Facebook) via NeuLink.",
  async execute(input) {
    try {
      const response = await fetch("https://api.neulink.com/v1/posts", {
        body: JSON.stringify({
          channels: input.channels,
          media: input.mediaUrls,
          scheduled_at: input.scheduledAt,
          text: input.text,
        }),
        headers: {
          Authorization: `Bearer ${process.env.NEULINK_API_KEY!}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      if (!response.ok) {
        const errorText = await response.text();

        return {
          error: `NeuLink API failed (${response.status}): ${errorText}`,
          success: false,
        };
      }

      const data: unknown = await response.json();

      return {
        data,
        success: true,
      };
    } catch {
      return {
        error: "Failed to connect to NeuLink API",
        success: false,
      };
    }
  },
  inputSchema: scheduleSocialPostSchema,
});
