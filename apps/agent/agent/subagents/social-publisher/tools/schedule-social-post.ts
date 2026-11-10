import { scheduleSocialPostSchema } from "@befday-2.0/contracts";
import { defineTool } from "eve/tools";
import { auto } from "eve/tools/approval";

import { db } from "@/lib/db";

export default defineTool({
  approval: auto({
    instructions:
      "Check that this post describes verified birthday perks accurately. Return clear for routine perk announcements. Return caution if it makes false discount claims, uses offensive language, or looks spammy.",
  }),
  description:
    "Schedules or publishes social media posts across channels (Twitter/X, Instagram, LinkedIn, Facebook, Threads, TikTok, Pinterest, Google Business) via NeuLink, and records lastPostedAt and lastTheme on featured brands.",
  async execute(input) {
    const response = await fetch("https://api.neulink.com/v1/posts", {
      body: JSON.stringify({
        auto_add_music: input.autoAddMusic,
        channels: input.channels,
        media: input.mediaUrls,
        scheduled_at: input.scheduledAt,
        text: input.text,
      }),
      headers: {
        // oxlint-disable-next-line typescript/no-non-null-assertion
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

    if (input.brandSlugs.length > 0) {
      await db.birthdayPerk.updateMany({
        data: {
          lastPostedAt: new Date(),
          lastTheme: input.theme,
        },
        where: {
          brand: {
            slug: { in: input.brandSlugs },
          },
        },
      });
    }

    return {
      data,
      success: true,
    };
  },
  inputSchema: scheduleSocialPostSchema,
});
